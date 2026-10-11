import { currentUser, mockListings } from '@/data/mockData';
import { Listing, NewListing } from '@/types/listing';
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * In-memory listings store. Swap the internals for API calls when the backend
 * exists; screens only talk to this hook.
 */
type ListingsContextValue = {
  listings: Listing[];
  getListing: (id: string) => Listing | undefined;
  addListing: (listing: NewListing) => Listing;
  bookmarks: Set<string>;
  toggleBookmark: (id: string) => void;
};

const ListingsContext = createContext<ListingsContextValue | null>(null);

export function ListingsProvider({ children }: { children: React.ReactNode }) {
  const [listings, setListings] = useState<Listing[]>(mockListings);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  const getListing = useCallback((id: string) => listings.find(l => l.id === id), [listings]);

  const addListing = useCallback((input: NewListing) => {
    const listing = {
      ...input,
      id: `l-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: 'open',
      postedBy: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        verified: currentUser.verified,
        rating: currentUser.rating,
        reviewCount: currentUser.reviewCount,
      },
    } as Listing;
    setListings(prev => [listing, ...prev]);
    return listing;
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const value = useMemo(
    () => ({ listings, getListing, addListing, bookmarks, toggleBookmark }),
    [listings, getListing, addListing, bookmarks, toggleBookmark]
  );

  return <ListingsContext.Provider value={value}>{children}</ListingsContext.Provider>;
}

export function useListings() {
  const ctx = useContext(ListingsContext);
  if (!ctx) throw new Error('useListings must be used inside ListingsProvider');
  return ctx;
}
