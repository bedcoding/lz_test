'use client';

import { useEffect } from 'react';
import styled from 'styled-components';
import FilterPanel from '@/components/ranking/FilterPanel';
import RankingList from '@/components/ranking/RankingList';
import QueryHydration from '@/components/QueryHydration';
import HelpIcon from '@/components/common/HelpIcon';
import { useRankingDataQuery } from '@/hooks/useRankingDataQuery';
import { useFilter } from '@/hooks/useFilter';
import { useGenre } from '@/hooks/useGenre';
import { useInfiniteScrollQuery } from '@/hooks/useInfiniteScrollQuery';
import { ComicRankApiSuccessResponse } from '@/types/ranking';

// 페이지 컨테이너 - HelpIcon 플로팅을 위한 relative positioning
const PageContainer = styled.div`
  position: relative;
`;

interface RankingPageClientQueryProps {
  initialResponse?: ComicRankApiSuccessResponse | null;
}

export default function RankingPageClientQuery(props?: RankingPageClientQueryProps) {
  const { initialResponse = null } = props || {};
  // 장르 상태 관리
  const { genreState, handleGenreChange } = useGenre();

  // TanStack Query 기반 랭킹 데이터 관리
  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreData,
    retryLoadMore,
    isFetching,
    isRefetching
  } = useRankingDataQuery({ 
    genre: genreState.selectedGenre 
  });

  // 필터링 관리 (기존 데이터가 있으면 사용, 없으면 초기 응답 데이터 사용)
  const dataToFilter = items.length > 0 ? items : (initialResponse?.data || []);
  const {
    filters,
    filteredItems,
    handleFilterToggle
  } = useFilter(dataToFilter);

  // TanStack Query용 무한 스크롤 관리
  const { loadMoreTriggerRef } = useInfiniteScrollQuery({
    hasMore,
    isLoading: isLoadingMore,
    onLoadMore: loadMoreData,
    isFetching // TanStack Query의 isFetching 상태 추가
  });

  // 필터링 결과가 적을 때 자동으로 더 많은 데이터 로드
  useEffect(() => {
    const MIN_ITEMS_THRESHOLD = 10;
    
    if (
      filteredItems.length < MIN_ITEMS_THRESHOLD && 
      hasMore && 
      !isLoadingMore && 
      !isLoading &&
      !isFetching && // 추가: fetching 중이 아닐 때만
      items.length > 0
    ) {
      loadMoreData();
    }
  }, [
    filteredItems.length, 
    hasMore, 
    isLoadingMore, 
    isLoading, 
    isFetching,
    items.length, 
    loadMoreData
  ]);

  return (
    <PageContainer>
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
        
        {/* 개발 환경에서 TanStack Query 상태 표시 */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            position: 'fixed', 
            top: '10px', 
            right: '10px', 
            background: 'rgba(0,0,0,0.8)', 
            color: 'white', 
            padding: '10px', 
            borderRadius: '5px',
            fontSize: '12px',
            zIndex: 1000
          }}>
            <div>Loading: {isLoading.toString()}</div>
            <div>LoadingMore: {isLoadingMore.toString()}</div>
            <div>Fetching: {isFetching.toString()}</div>
            <div>Refetching: {isRefetching.toString()}</div>
            <div>HasMore: {hasMore.toString()}</div>
            <div>Items: {items.length}</div>
            <div>Filtered: {filteredItems.length}</div>
          </div>
        )}
      </div>
    </PageContainer>
  );
}
