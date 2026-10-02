import React, { useState, useEffect, useCallback } from 'react';
import Hero from '../components/Hero';
import MenuSection from '../components/MenuSection';
import About from '../components/About';
import FeedbackSection from '../components/FeedbackSection';
import Location from '../components/Location';
import Contact from '../components/Contact';
import ApiClient from '../services/api';
import { FALLBACK_MENU_ITEMS, DEFAULT_CATEGORIES } from '../data/constants';

export const Home = () => {
  const [menuItems, setMenuItems] = useState(FALLBACK_MENU_ITEMS);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackStats, setFeedbackStats] = useState({ totalFeedback: 3, averageRating: 5.0 });
  const [itemRatingsMap, setItemRatingsMap] = useState({});

  // 1. Calculate item ratings map from feedback
  const calculateItemRatings = useCallback((feedbacks) => {
    const map = {};
    feedbacks.forEach((fb) => {
      if (fb.itemName && fb.rating) {
        const nameKey = fb.itemName.toLowerCase().trim();
        if (!map[nameKey]) {
          map[nameKey] = { totalReviews: 0, totalRating: 0, averageRating: 0 };
        }
        map[nameKey].totalReviews += 1;
        map[nameKey].totalRating += Number(fb.rating);
        map[nameKey].averageRating = map[nameKey].totalRating / map[nameKey].totalReviews;
      }
      if (fb.itemId) {
        const idKey = String(fb.itemId);
        if (!map[idKey]) {
          map[idKey] = { totalReviews: 0, totalRating: 0, averageRating: 0 };
        }
        map[idKey].totalReviews += 1;
        map[idKey].totalRating += Number(fb.rating);
        map[idKey].averageRating = map[idKey].totalRating / map[idKey].totalReviews;
      }
    });
    setItemRatingsMap(map);
  }, []);

  // 2. Fetch feedback data & stats
  const fetchFeedbackData = useCallback(async () => {
    try {
      const [listRes, statsRes] = await Promise.allSettled([
        ApiClient.getFeedback(50),
        ApiClient.getFeedbackStats()
      ]);

      if (listRes.status === 'fulfilled' && listRes.value?.data) {
        const list = Array.isArray(listRes.value.data) ? listRes.value.data : [];
        setFeedbackList(list);
        calculateItemRatings(list);
      }

      if (statsRes.status === 'fulfilled' && statsRes.value?.data) {
        setFeedbackStats(statsRes.value.data);
      }
    } catch (e) {
      console.warn("Feedback fetch warning:", e.message);
    }
  }, [calculateItemRatings]);

  // 3. Initial Load from Backend API
  useEffect(() => {
    const loadInitialData = async () => {
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
        console.warn("Initial data load notice:", e.message);
      }
    };

    loadInitialData();
    fetchFeedbackData();
  }, [fetchFeedbackData]);

  return (
    <main>
      <Hero stats={feedbackStats} />
      <MenuSection
        menuItems={menuItems}
        categories={categories}
        itemRatingsMap={itemRatingsMap}
        showPopular={true}
      />
      <About stats={feedbackStats} />
      <FeedbackSection
        feedbackList={feedbackList}
        stats={feedbackStats}
        menuItems={menuItems}
        onRefresh={fetchFeedbackData}
      />
      <Location stats={feedbackStats} />
      <Contact stats={feedbackStats} />
    </main>
  );
};

export default Home;
