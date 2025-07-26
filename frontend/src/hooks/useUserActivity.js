// hooks/useUserActivity.js
import { useRef, useState, useEffect } from "react";

const MAX_TRACKED = 50;
const DECAY_RATE = 0.000005; // ⏳ Recent actions are more important

export const useUserActivity = () => {
  const [activityLog, setActivityLog] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("userActivity")) || [];
    } catch {
      return [];
    }
  });

  const hoverTimers = useRef({});

  const logView = (product) => {
    if (!product?._id) return;
    addToLog("view", product);
  };

  const logClick = (product) => {
    if (!product?._id) return;
    addToLog("click", product);
  };

  const startHover = (productId) => {
    hoverTimers.current[productId] = Date.now();
  };

  const endHover = (product) => {
    const start = hoverTimers.current[product._id];
    if (!start) return;
    const duration = Date.now() - start;
    delete hoverTimers.current[product._id];
    if (duration > 300) {
      addToLog("hover", product, duration);
    }
  };

  const addToLog = (type, product, duration = 0) => {
    const entry = {
      type,
      productId: product._id,
      timestamp: Date.now(),
      duration,
      category: product.category || null,
    };

    setActivityLog((prev) => {
      const updated = [entry, ...prev].slice(0, MAX_TRACKED);
      localStorage.setItem("userActivity", JSON.stringify(updated));
      return updated;
    });
  };

  // 🧠 Score products for upsell logic
  const getRankedProductScores = () => {
    const now = Date.now();
    const scoreMap = new Map();

    activityLog.forEach((entry) => {
      const timeDecay = 1 / (1 + DECAY_RATE * (now - entry.timestamp));
      const baseScore =
        entry.type === "click" ? 3 : entry.type === "view" ? 2 : 1;
      const durationBonus = entry.duration ? Math.min(entry.duration / 1000, 5) : 0;
      const score = (baseScore + durationBonus) * timeDecay;

      if (!scoreMap.has(entry.productId)) {
        scoreMap.set(entry.productId, 0);
      }
      scoreMap.set(entry.productId, scoreMap.get(entry.productId) + score);
    });

    return [...scoreMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([productId]) => productId);
  };

  // 🧠 Score categories for upsell logic
  const getTopCategories = (limit = 3) => {
    const now = Date.now();
    const catMap = new Map();

    activityLog.forEach((entry) => {
      const timeDecay = 1 / (1 + DECAY_RATE * (now - entry.timestamp));
      const score = (entry.type === "click" ? 3 : 1) * timeDecay;

      if (!entry.category) return;
      if (!catMap.has(entry.category)) {
        catMap.set(entry.category, 0);
      }
      catMap.set(entry.category, catMap.get(entry.category) + score);
    });

    return [...catMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([cat]) => cat);
  };

  return {
    activityLog,
    logView,
    logClick,
    startHover,
    endHover,
    getRankedProductScores,
    getTopCategories,
  };
};
