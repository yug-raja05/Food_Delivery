import React from 'react';

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  dietFilter,
  onDietFilterChange
}) => {
  return (
    <div className="menu-filter-container reveal">
      {/* Category Tabs */}
      <div className="category-tabs" id="categoryTabs" role="tablist">
        {categories.map((cat) => {
          const isSelected = (cat.id || cat.slug) === selectedCategory;
          return (
            <button
              key={cat.id || cat.slug || cat._id}
              type="button"
              className={`filter-btn ${isSelected ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id || cat.slug)}
              role="tab"
              aria-selected={isSelected}
            >
              {cat.icon && <i className={cat.icon}></i>}
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Diet Controls Bar */}
      <div className="menu-controls-bar">
        {/* Search Input with Clear Button */}
        <div className="search-box-wrapper">
          <i className="fas fa-magnifying-glass search-icon"></i>
          <input
            type="text"
            className="search-input"
            id="menuSearchInput"
            placeholder="Search biryani, fried rice, noodles, kabab..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search menu items"
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-search-btn show"
              id="clearSearchBtn"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
            >
              <i className="fas fa-xmark"></i>
            </button>
          )}
        </div>

        {/* Dietary Toggles */}
        <div className="dietary-toggles" role="group" aria-label="Dietary preferences">
          <button
            type="button"
            className={`diet-toggle-btn ${dietFilter === 'all' ? 'active' : ''}`}
            onClick={() => onDietFilterChange('all')}
          >
            <i className="fas fa-utensils"></i> All Dishes
          </button>
          <button
            type="button"
            className={`diet-toggle-btn veg ${dietFilter === 'veg' ? 'active' : ''}`}
            onClick={() => onDietFilterChange(dietFilter === 'veg' ? 'all' : 'veg')}
          >
            <span className="diet-icon-symbol veg"></span> Veg Only
          </button>
          <button
            type="button"
            className={`diet-toggle-btn nonveg ${dietFilter === 'nonveg' ? 'active' : ''}`}
            onClick={() => onDietFilterChange(dietFilter === 'nonveg' ? 'all' : 'nonveg')}
          >
            <span className="diet-icon-symbol nonveg"></span> Non-Veg
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
