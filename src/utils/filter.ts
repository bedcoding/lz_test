import { ComicRankItem, FilterState, GenreType, GenreState } from '@/types/ranking';

/**
 * 필터 상태에 따라 작품 목록을 필터링
 * @param items ComicRankItem[]
 * @param filters FilterState
 * @returns ComicRankItem[]
 */
export function filterComicItems(items: ComicRankItem[], filters: FilterState): ComicRankItem[] {
  return items.filter(item => {
    // 연재중/완결 필터 (상호 배타적)
    if (filters.ongoing && item.contentsState !== 'scheduled') {
      return false;
    }
    
    if (filters.completed && item.contentsState !== 'completed') {
      return false;
    }
    
    // 무료회차 3개 이상 필터
    if (filters.freeEpisodes && item.freedEpisodeSize < 3) {
      return false;
    }
    
    return true;
  });
}

/**
 * 필터 상태 초기화
 * @returns FilterState
 */
export function getInitialFilterState(): FilterState {
  return {
    ongoing: false,
    completed: false,
    freeEpisodes: false
  };
}

/**
 * 필터가 활성화되어 있는지 확인
 * @param filters FilterState
 * @returns boolean
 */
export function hasActiveFilters(filters: FilterState): boolean {
  return filters.ongoing || filters.completed || filters.freeEpisodes;
}

/**
 * 활성화된 필터 개수 반환
 * @param filters FilterState
 * @returns number
 */
export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;
  if (filters.ongoing) count++;
  if (filters.completed) count++;
  if (filters.freeEpisodes) count++;
  return count;
}

/**
 * 필터 토글 함수 (연재중/완결은 상호 배타적 처리)
 * @param currentFilters FilterState
 * @param filterType keyof FilterState
 * @returns FilterState
 */
export function toggleFilter(currentFilters: FilterState, filterType: keyof FilterState): FilterState {
  const newFilters = { ...currentFilters };
  
  if (filterType === 'ongoing') {
    newFilters.ongoing = !newFilters.ongoing;
    // 연재중을 켜면 완결을 끔
    if (newFilters.ongoing) {
      newFilters.completed = false;
    }
  } else if (filterType === 'completed') {
    newFilters.completed = !newFilters.completed;
    // 완결을 켜면 연재중을 끔
    if (newFilters.completed) {
      newFilters.ongoing = false;
    }
  } else if (filterType === 'freeEpisodes') {
    newFilters.freeEpisodes = !newFilters.freeEpisodes;
  }
  
  return newFilters;
}

/**
 * 필터 레이블 반환
 * @param filterType keyof FilterState
 * @returns string
 */
export function getFilterLabel(filterType: keyof FilterState): string {
  const labels = {
    ongoing: '연재 중',
    completed: '완결',
    freeEpisodes: '무료회차 3개 ↑'
  };
  
  return labels[filterType];
}

/**
 * 장르 상태 초기화
 * @returns GenreState
 */
export function getInitialGenreState(): GenreState {
  return {
    selectedGenre: 'romance'
  };
}

/**
 * 장르 레이블 반환
 * @param genre GenreType
 * @returns string
 */
export function getGenreLabel(genre: GenreType): string {
  const labels = {
    romance: '로맨스',
    drama: '드라마'
  };
  
  return labels[genre];
}
