'use client';

import { useEffect } from 'react';
import FilterPanel from '@/components/ranking/FilterPanel';
import RankingList from '@/components/ranking/RankingList';
import { useRankingData } from '@/hooks/useRankingData';
import { useFilter } from '@/hooks/useFilter';
import { useGenre } from '@/hooks/useGenre';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ComicRankItem } from '@/types/ranking';

interface RankingPageClientProps {
  initialData: ComicRankItem[];
}

export default function RankingPageClient({ 
  initialData
}: RankingPageClientProps) {
  // 장르 상태 관리
  const { genreState, handleGenreChange } = useGenre();

  // 랭킹 데이터 관리 (초기 데이터 직접 전달)
  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreData,
    retryLoadMore
  } = useRankingData(genreState.selectedGenre, initialData);

  // 필터링 관리
  const {
    filters,
    filteredItems,
    handleFilterToggle
  } = useFilter(items);

  // 무한 스크롤 관리
  const { loadMoreTriggerRef } = useInfiniteScroll({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMoreData
  });

  // 필터링 결과가 적을 때 자동으로 더 많은 데이터 로드
  useEffect(() => {
    const MIN_ITEMS_THRESHOLD = 10; // 최소 아이템 수
    
    // 필터링된 결과가 임계값보다 적고, 더 로드할 데이터가 있으며, 현재 로딩 중이 아닌 경우
    if (
      filteredItems.length < MIN_ITEMS_THRESHOLD && 
      hasMore && 
      !isLoadingMore && 
      !isLoading &&
      items.length > 0 // 초기 데이터가 있을 때만
    ) {
      loadMoreData();
    }
  }, [filteredItems.length, hasMore, isLoadingMore, isLoading, items.length, loadMoreData]);

  return (
    <>
      {/* 통합 필터 패널 */}
      <FilterPanel
        filters={filters}
        onFilterChange={handleFilterToggle}
        genreState={genreState}
        onGenreChange={handleGenreChange}
      />
      
      {/* 랭킹 리스트 */}
      <div id="main-content">
        <RankingList
          items={filteredItems}
          isLoading={isLoading}
          isLoadingMore={isLoadingMore}
          hasMore={hasMore}
          error={error}
          onLoadMore={loadMoreData}
          onRetryLoadMore={retryLoadMore}
          loadMoreTriggerRef={loadMoreTriggerRef}
        />
      </div>
    </>
  );
}
