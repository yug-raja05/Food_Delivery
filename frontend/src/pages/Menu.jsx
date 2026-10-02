import React, { useState, useEffect } from 'react';
import MenuSection from '../components/MenuSection';
import ApiClient from '../services/api';
import { FALLBACK_MENU_ITEMS, DEFAULT_CATEGORIES } from '../data/constants';

export const Menu = () => {
  const [menuItems, setMenuItems] = useState(FALLBACK_MENU_ITEMS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadMenuData = async () => {
      try {
        const [catsRes, menuRes] = await Promise.allSettled([
          ApiClient.getCategories(),
          ApiClient.getMenu()
        ]);

        if (catsRes.status === 'fulfilled' && Array.isArray(catsRes.value?.data) && catsRes.value.data.length > 0) {
          const apiCats = catsRes.value.data.map((c) => ({
            id: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            slug: c.slug || c.name.toLowerCase().replace(/\s+/g, '-'),
            name: c.name,
            icon: c.icon || "fas fa-utensils"
          }));
          setCategories([{ id: "all", name: "All Items", icon: "fas fa-utensils" }, ...apiCats]);
        }

        if (menuRes.status === 'fulfilled' && Array.isArray(menuRes.value?.data) && menuRes.value.data.length > 0) {
          setMenuItems(menuRes.value.data);
        }
      } catch (e) {
        console.warn("Menu load warning:", e.message);
      } finally {
        setLoading(false);
      }
    };

    loadMenuData();
  }, []);

  return (
    <main style={{ paddingTop: '1.5rem', minHeight: '80vh' }}>
      <MenuSection
        menuItems={menuItems}
        categories={categories}
        showPopular={false}
      />
    </main>
  );
};

export default Menu;
