/**
 * Multi-Vendor Faceted Catalog Search & Elastic Filtering Engine
 * Supports full-text scoring, multi-attribute facet aggregation (price buckets, categories,
 * supplier rating thresholds), geo-distance radius filtering, and dynamic sorting.
 */

/**
 * Calculate Haversine distance in km between two GPS coordinates
 */
export function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371.0;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(2));
}

/**
 * Tokenize and normalize query text for keyword matching
 */
export function tokenizeText(text) {
  if (!text || typeof text !== 'string') return [];
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

export const SORT_ORDERS = {
  RELEVANCE: 'RELEVANCE',
  PRICE_ASC: 'PRICE_ASC',
  PRICE_DESC: 'PRICE_DESC',
  RATING_DESC: 'RATING_DESC',
  DISTANCE_ASC: 'DISTANCE_ASC'
};

export class CatalogSearchEngine {
  /**
   * @param {Array<Object>} products - Catalog product items
   * @param {Array<Object>} [suppliers] - Optional supplier details for vendor metadata
   */
  constructor(products = [], suppliers = []) {
    this.suppliersMap = new Map();
    if (suppliers && suppliers.length > 0) {
      suppliers.forEach((s) => this.suppliersMap.set(s.id, s));
    }
    this.products = this._enrichProducts(products);
  }

  /**
   * Enrich product items with supplier details (rating, coordinates, verification)
   */
  _enrichProducts(products) {
    return products.map((p) => {
      const supplier = this.suppliersMap.get(p.supplierId) || {};
      return {
        ...p,
        price: Number(p.price || 0),
        rating: Number(p.rating || supplier.rating || 4.0),
        moq: Number(p.moq || 1),
        stock: Number(p.stock !== undefined ? p.stock : 100),
        supplierName: p.supplierName || supplier.name || 'Verified Supplier',
        supplierVerified: p.supplierVerified ?? supplier.isVerified ?? true,
        location: p.location || supplier.location || { lat: 37.7749, lon: -122.4194, city: 'San Francisco', state: 'CA' }
      };
    });
  }

  /**
   * Update catalog items dynamically
   */
  setProducts(products, suppliers = []) {
    if (suppliers.length > 0) {
      this.suppliersMap.clear();
      suppliers.forEach((s) => this.suppliersMap.set(s.id, s));
    }
    this.products = this._enrichProducts(products);
  }

  /**
   * Execute faceted catalog search with elastic filtering and aggregations
   * @param {Object} [params]
   * @param {string} [params.query] - Text search query
   * @param {string|Array<string>} [params.category] - Category filter
   * @param {number} [params.minPrice] - Minimum price ceiling
   * @param {number} [params.maxPrice] - Maximum price ceiling
   * @param {number} [params.minRating] - Minimum supplier/product rating (e.g. 4.0)
   * @param {boolean} [params.verifiedOnly] - Only verified suppliers
   * @param {boolean} [params.inStockOnly] - Exclude zero-stock items
   * @param {number} [params.maxMoq] - Maximum acceptable MOQ
   * @param {Object} [params.userLocation] - { lat, lon } for distance filtering
   * @param {number} [params.maxRadiusKm] - Max radius distance in km
   * @param {string} [params.sort='RELEVANCE'] - Sort order
   * @param {number} [params.page=1] - Page number (1-based)
   * @param {number} [params.pageSize=12] - Items per page
   * @returns {Object} Filtered items, pagination metadata, and faceted aggregations
   */
  search(params = {}) {
    const {
      query = '',
      category,
      minPrice,
      maxPrice,
      minRating,
      verifiedOnly = false,
      inStockOnly = false,
      maxMoq,
      userLocation,
      maxRadiusKm,
      sort = SORT_ORDERS.RELEVANCE,
      page = 1,
      pageSize = 12
    } = params;

    const queryTokens = tokenizeText(query);
    const categoryFilter = category
      ? Array.isArray(category)
        ? category.map((c) => c.toLowerCase())
        : [category.toLowerCase()]
      : null;

    // 1. Filter and score candidates
    const scoredCandidates = [];

    for (const product of this.products) {
      // Category filter
      if (categoryFilter && !categoryFilter.includes(product.category.toLowerCase())) {
        continue;
      }

      // Price range filter
      if (minPrice !== undefined && product.price < Number(minPrice)) continue;
      if (maxPrice !== undefined && product.price > Number(maxPrice)) continue;

      // Rating filter
      if (minRating !== undefined && product.rating < Number(minRating)) continue;

      // Verified supplier filter
      if (verifiedOnly && !product.supplierVerified) continue;

      // In stock filter
      if (inStockOnly && product.stock <= 0) continue;

      // MOQ filter
      if (maxMoq !== undefined && product.moq > Number(maxMoq)) continue;

      // Distance calculation and radius filter
      let distanceKm = null;
      if (userLocation && product.location && userLocation.lat && userLocation.lon) {
        distanceKm = haversineKm(
          userLocation.lat,
          userLocation.lon,
          product.location.lat,
          product.location.lon
        );
        if (maxRadiusKm !== undefined && distanceKm > Number(maxRadiusKm)) {
          continue;
        }
      }

      // Text scoring
      let relevanceScore = 0;
      if (queryTokens.length > 0) {
        const titleTokens = tokenizeText(product.name || product.title);
        const descTokens = tokenizeText(product.description);
        const catTokens = tokenizeText(product.category);

        let matchCount = 0;
        for (const qt of queryTokens) {
          if (titleTokens.includes(qt)) {
            relevanceScore += 10;
            matchCount++;
          } else if (catTokens.includes(qt)) {
            relevanceScore += 5;
            matchCount++;
          } else if (descTokens.includes(qt)) {
            relevanceScore += 2;
            matchCount++;
          } else if (titleTokens.some((t) => t.includes(qt))) {
            relevanceScore += 3;
            matchCount++;
          }
        }

        // If user searched for query and no tokens matched, skip
        if (matchCount === 0) continue;
      } else {
        relevanceScore = product.rating * 2; // Baseline score
      }

      scoredCandidates.push({
        ...product,
        distanceKm,
        relevanceScore
      });
    }

    // 2. Generate Facet Aggregations over matching result set
    const facets = this._buildFacetAggregations(scoredCandidates);

    // 3. Sorting
    scoredCandidates.sort((a, b) => {
      switch (sort) {
        case SORT_ORDERS.PRICE_ASC:
          return a.price - b.price;
        case SORT_ORDERS.PRICE_DESC:
          return b.price - a.price;
        case SORT_ORDERS.RATING_DESC:
          return b.rating - a.rating;
        case SORT_ORDERS.DISTANCE_ASC:
          return (a.distanceKm ?? 99999) - (b.distanceKm ?? 99999);
        case SORT_ORDERS.RELEVANCE:
        default:
          return b.relevanceScore - a.relevanceScore;
      }
    });

    // 4. Pagination
    const totalMatches = scoredCandidates.length;
    const totalPages = Math.ceil(totalMatches / pageSize) || 1;
    const safePage = Math.max(1, Math.min(page, totalPages));
    const startIndex = (safePage - 1) * pageSize;
    const paginatedItems = scoredCandidates.slice(startIndex, startIndex + pageSize);

    return {
      items: paginatedItems,
      pagination: {
        page: safePage,
        pageSize,
        totalMatches,
        totalPages
      },
      facets,
      appliedFilters: {
        query,
        category,
        minPrice,
        maxPrice,
        minRating,
        verifiedOnly,
        inStockOnly,
        maxMoq,
        maxRadiusKm,
        sort
      }
    };
  }

  /**
   * Build category, price bucket, and rating facet counts
   */
  _buildFacetAggregations(items) {
    const categoryCounts = {};
    const cityCounts = {};
    const priceBuckets = [
      { label: 'Under $25', min: 0, max: 25, count: 0 },
      { label: '$25 to $100', min: 25, max: 100, count: 0 },
      { label: '$100 to $500', min: 100, max: 500, count: 0 },
      { label: '$500+', min: 500, max: Infinity, count: 0 }
    ];
    const ratingBuckets = [
      { minRating: 4.5, label: '4.5 & up', count: 0 },
      { minRating: 4.0, label: '4.0 & up', count: 0 },
      { minRating: 3.0, label: '3.0 & up', count: 0 }
    ];

    let verifiedSupplierCount = 0;
    let inStockCount = 0;

    for (const item of items) {
      // Category count
      const cat = item.category || 'General';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;

      // City count
      if (item.location && item.location.city) {
        cityCounts[item.location.city] = (cityCounts[item.location.city] || 0) + 1;
      }

      // Price buckets
      for (const bucket of priceBuckets) {
        if (item.price >= bucket.min && item.price < bucket.max) {
          bucket.count++;
        }
      }

      // Rating buckets
      for (const rb of ratingBuckets) {
        if (item.rating >= rb.minRating) {
          rb.count++;
        }
      }

      if (item.supplierVerified) verifiedSupplierCount++;
      if (item.stock > 0) inStockCount++;
    }

    return {
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })),
      priceBuckets,
      ratingBuckets,
      cities: Object.entries(cityCounts).map(([city, count]) => ({ city, count })),
      verifiedSupplierCount,
      inStockCount
    };
  }
}

// Dual ESM & CommonJS compatibility
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    SORT_ORDERS,
    haversineKm,
    tokenizeText,
    CatalogSearchEngine
  };
}

export default CatalogSearchEngine;
