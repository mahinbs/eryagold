import React, { createContext, useContext, useState, useEffect } from 'react';
import { getWishlist, toggleWishlist, getCurrentUser } from '@/supabase/api';
import { useToast } from '@/utils/toast';

interface WishlistContextType {
  wishlistIds: string[];
  toggleItem: (designId: string) => Promise<void>;
  loading: boolean;
  refresh: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchWishlist = async () => {
    try {
      const user = await getCurrentUser();
      if (user) {
        const ids = await getWishlist(user.id);
        if (ids && Array.isArray(ids)) {
          setWishlistIds(ids.map((d: any) => d.id));
        } else {
          setWishlistIds([]);
        }
      } else {
        setWishlistIds([]);
      }
    } catch (error) {
      console.error('Error fetching global wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const toggleItem = async (designId: string) => {
    try {
      const user = await getCurrentUser();
      if (!user) {
        showToast('Please sign in to save items', 'error');
        return;
      }

      const res = await toggleWishlist(user.id, designId);
      if (res.status === 'added') {
        setWishlistIds(prev => [...prev, designId]);
        showToast('Added to shortlist', 'success');
      } else {
        setWishlistIds(prev => prev.filter(id => id !== designId));
        showToast('Removed from shortlist', 'success');
      }
    } catch (error) {
      showToast('Failed to update wishlist', 'error');
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleItem, loading, refresh: fetchWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
