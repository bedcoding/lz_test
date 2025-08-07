'use client';

import React from 'react';
import { Container, PageHeader, PageTitle, MainContent } from '@/components/layout/Container';
import RankingFilter from '@/components/ranking/RankingFilter';
import RankingList from '@/components/ranking/RankingList';
import { useRankingData } from '@/hooks/useRankingData';
import { useFilter } from '@/hooks/useFilter';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

export default function Home() {
  // 랭킹 데이터 관리
  const {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    error,
    loadMoreData
  } = useRankingData();

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
        <PageTitle>로맨스 장르 랭킹</PageTitle>
      </PageHeader>
      
      <MainContent>
        {/* 필터링 영역 */}
        <RankingFilter
          filters={filters}
          onFilterChange={handleFilterToggle}
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