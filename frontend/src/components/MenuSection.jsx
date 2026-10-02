import React, { useState, useMemo } from 'react';
import CategoryFilter from './CategoryFilter';
import MenuCard from './MenuCard';

export const MenuSection = ({ menuItems, categories, itemRatingsMap = {}, showPopular = true }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietFilter, setDietFilter] = useState('all'); // 'all', 'veg', 'nonveg'

  // Popular Dishes list
  const popularItems = useMemo(() => {
    return menuItems.filter((i) => i.isPopular);
  }, [menuItems]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // 1. Category Filter
      if (selectedCategory !== 'all') {
        const itemCat = (item.category || '').toLowerCase();
        if (itemCat !== selectedCategory.toLowerCase()) return false;
      }

      // 2. Diet Filter
      if (dietFilter === 'veg' && !item.isVeg) return false;
      if (dietFilter === 'nonveg' && item.isVeg) return false;

      // 3. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = (item.name || '').toLowerCase().includes(q);
        const descMatch = (item.description || '').toLowerCase().includes(q);
        const catMatch = (item.categoryLabel || '').toLowerCase().includes(q);
        const tagsMatch = Array.isArray(item.tags) && item.tags.some((t) => t.toLowerCase().includes(q));
        if (!nameMatch && !descMatch && !catMatch && !tagsMatch) return false;
      }

      return true;
    });
  }, [menuItems, selectedCategory, dietFilter, searchQuery]);

  return (
    <>
      {/* Popular Highlights Grid */}
      {showPopular && popularItems.length > 0 && (
        <section className="popular-section" id="popular">
          <div className="container">
            <div className="section-header reveal">
              <span className="section-tag"><i className="fas fa-crown"></i> House Specials</span>
              <h2 className="section-title">Popular Delicacies</h2>
              <p className="section-subtitle">The most loved, highly ordered dishes prepared fresh daily on high heat.</p>
            </div>

            <div className="popular-grid" id="popularGrid">
              {popularItems.map((item) => {
                const idKey = String(item.id || item._id);
                const nameKey = (item.name || '').toLowerCase().trim();
                const rating = itemRatingsMap[idKey] || itemRatingsMap[nameKey];
                return (
                  <MenuCard
                    key={item.id || item._id}
                    item={item}
                    itemRating={rating}
                  />
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Main Menu Section */}
      <section className="menu-section" id="menu">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-tag"><i className="fas fa-utensils"></i> Complete Offerings</span>
            <h2 className="section-title">Our Food Menu</h2>
            <p className="section-subtitle">
              Explore freshly prepared aromatic biryani, wok-tossed fried rice, hakka noodles, and seasoned chicken specials.
            </p>
          </div>

          {/* Interactive Category Tabs, Search & Diet Filter */}
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            dietFilter={dietFilter}
            onDietFilterChange={setDietFilter}
          />

          {/* Menu Cards Grid */}
          {filteredItems.length > 0 ? (
            <div className="menu-grid" id="menuGrid">
              {filteredItems.map((item) => {
                const idKey = String(item.id || item._id);
                const nameKey = (item.name || '').toLowerCase().trim();
                const rating = itemRatingsMap[idKey] || itemRatingsMap[nameKey];
                return (
                  <MenuCard
                    key={item.id || item._id}
                    item={item}
                    itemRating={rating}
                  />
                );
              })}
            </div>
          ) : (
            <div className="feedback-empty-card" style={{ padding: '3.5rem 2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
                No dishes found matching your search
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                Try searching for something else or reset your filters.
              </p>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                style={{ marginTop: '1rem' }}
                onClick={() => {
                  setSelectedCategory('all');
                  setDietFilter('all');
                  setSearchQuery('');
                }}
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default MenuSection;
