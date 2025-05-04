import { create } from 'zustand';
import { SearchResult } from '@/lib/services/search-service';
import { CategoryResult } from '@/lib/services/search-service';

interface SearchCacheState {
  productCache: Map<string, SearchResult[]>;
  categoryCache: Map<string, CategoryResult[]>;
  setProductCache: (term: string, results: SearchResult[]) => void;
  setCategoryCache: (term: string, results: CategoryResult[]) => void;
  getProductCache: (term: string) => SearchResult[] | undefined;
  getCategoryCache: (term: string) => CategoryResult[] | undefined;
}

export const useSearchCacheStore = create<SearchCacheState>((set, get) => ({
  productCache: new Map(),
  categoryCache: new Map(),
  setProductCache: (term, results) => {
    const newCache = new Map(get().productCache);
    newCache.set(term, results);
    set({ productCache: newCache });
  },
  setCategoryCache: (term, results) => {
    const newCache = new Map(get().categoryCache);
    newCache.set(term, results);
    set({ categoryCache: newCache });
  },
  getProductCache: (term) => get().productCache.get(term),
  getCategoryCache: (term) => get().categoryCache.get(term),
}));
