import { useState, useMemo } from 'react';
import { FilterState, FilterType, ComicRankItem } from '@/types/ranking';
import { 
  getInitialFilterState, 
  toggleFilter, 
  filterComicItems 
} from '@/utils/filter';

export function useFilter(items: ComicRankItem[]) {
  const [filters, setFilters] = useState<FilterState>(getInitialFilterState);

  // 필터 토글 함수
  const handleFilterToggle = (filterType: FilterType) => {
    setFilters(currentFilters => toggleFilter(currentFilters, filterType));
  };

  // 필터링된 아이템들 (메모이제이션)
  const filteredItems = useMemo(() => {
    return filterComicItems(items, filters);
  }, [items, filters]);

  // 필터 초기화
  const resetFilters = () => {
    setFilters(getInitialFilterState());
  };

  // 특정 필터만 설정
  const setFilter = (filterType: FilterType, value: boolean) => {
    setFilters(currentFilters => ({
      ...currentFilters,
      [filterType]: value
    }));
  };

  return {
    filters,
    filteredItems,
    handleFilterToggle,
    resetFilters,
    setFilter
  };
}
