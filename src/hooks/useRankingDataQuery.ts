import { useInfiniteQuery } from '@tanstack/react-query';
import { ComicRankItem, GenreType } from '@/types/ranking';
import { fetchGenreRanking } from '@/services/api';

interface UseRankingDataQueryParams {
  genre: GenreType;
  enabled?: boolean;
}

interface RankingQueryData {
  items: ComicRankItem[];
  hasNext: boolean;
  count: number;
}

// 무한스크롤 페이지 간 중복 웹툰 방지
function dedupeById(pages: RankingQueryData[]): ComicRankItem[] {
  const allItems = pages.flatMap(page => page.items);
  const seenIds = new Set<number>();
  return allItems.filter(item => {
    if (seenIds.has(item.id)) {
      return false;
    }
    seenIds.add(item.id);
    return true;
  });
}

export function useRankingDataQuery({ 
  genre, 
  enabled = true 
}: UseRankingDataQueryParams) {
  const query = useInfiniteQuery({
    queryKey: ['ranking', genre],
    queryFn: async ({ pageParam = 1, signal }) => {
      const response = await fetchGenreRanking(genre, pageParam, { signal });
      return {
        items: response.data,
        hasNext: response.hasNext,
        count: response.count,
        nextPage: response.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    enabled,
    // 초기 페이지 파라미터
    initialPageParam: 1,
    // 캐시 시간 설정 (5분)
    staleTime: 5 * 60 * 1000,
    // 에러 시 재시도 설정
    retry: (failureCount, error) => {
      // API 에러 코드가 4xx인 경우 재시도하지 않음
      if (error && typeof error === 'object' && 'status' in error) {
        const status = error.status as number;
        if (status >= 400 && status < 500) return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // 모든 페이지의 데이터를 평탄화하고 중복 제거
  const items = query.data ? dedupeById(query.data.pages) : [];
  
  // 마지막 페이지에 더 많은 데이터가 있는지 확인
  const hasMore = query.hasNextPage ?? false;

  return {
    // 기존 useRankingData와 동일한 인터페이스 제공
    items,
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    hasMore,
    error: query.error?.message || null,
    currentPage: query.data?.pages.length || 0,
    
    // TanStack Query의 추가 기능들
    loadMoreData: () => {
      if (hasMore && !query.isFetchingNextPage) {
        query.fetchNextPage();
      }
    },
    refreshData: () => {
      query.refetch();
    },
    retryLoadMore: () => {
      if (query.isError) {
        query.refetch();
      } else if (hasMore) {
        query.fetchNextPage();
      }
    },
    
    // 추가 상태들
    isRefetching: query.isRefetching,
    isFetching: query.isFetching,
    
    // 원본 쿼리 객체 (필요시 직접 접근)
    query,
  };
}
