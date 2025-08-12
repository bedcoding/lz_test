'use client';

import React from 'react';
import { Container, PageHeader, PageTitle, MainContent } from '@/components/layout/Container';
import FilterPanel from '@/components/ranking/FilterPanel';
import RankingList from '@/components/ranking/RankingList';
import { useRankingData } from '@/hooks/useRankingData';
import { useFilter } from '@/hooks/useFilter';
import { useGenre } from '@/hooks/useGenre';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Home() {
  // 장르 상태 관리
  const { genreState, handleGenreChange } = useGenre();

  // 랭킹 데이터 관리
  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreData
  } = useRankingData(genreState.selectedGenre);

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

  return (
    <Container>
      <PageHeader>
        <PageTitle>웹툰 랭킹</PageTitle>
      </PageHeader>
      
      <MainContent>
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
            loadMoreTriggerRef={loadMoreTriggerRef}
          />
        </div>
      </MainContent>
    </Container>
  );
}