'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useLocalStorage } from '@/app/hooks/useLocalStorage';

interface RecentlyViewedContextType {
  recentlyViewed: number[];
  addToRecentlyViewed: (id: number) => void;
  clearRecentlyViewed: () => void;
}

const RecentlyViewedContext = createContext<RecentlyViewedContextType | undefined>(undefined);

export function RecentlyViewedProvider({ children }: { children: ReactNode }) {
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage<number[]>('recently-viewed', []);

  const addToRecentlyViewed = (id: number) => {
    setRecentlyViewed(prev => {
      // Remove if already exists
      const filtered = prev.filter(viewedId => viewedId !== id);
      // Add to front, keep only last 10
      return [id, ...filtered].slice(0, 10);
    });
  };

  const clearRecentlyViewed = () => setRecentlyViewed([]);

  return (
    <RecentlyViewedContext.Provider value={{ recentlyViewed, addToRecentlyViewed, clearRecentlyViewed }}>
      {children}
    </RecentlyViewedContext.Provider>
  );
}

export function useRecentlyViewed() {
  const context = useContext(RecentlyViewedContext);
  if (!context) {
    throw new Error('useRecentlyViewed must be used within RecentlyViewedProvider');
  }
  return context;
}
