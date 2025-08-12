'use client';

import React from 'react';
import styled from 'styled-components';
import { ComicRankItem } from '@/types/ranking';
import RankingItem from './RankingItem';
import SkeletonItem from '@/components/common/SkeletonItem';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing['2xl']};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const EmptyTitle = styled.h3`
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const EmptyDescription = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.base};
  line-height: 1.6;
`;

const LoadMoreTrigger = styled.div<{ $hidden?: boolean }>`
  height: ${({ $hidden }) => $hidden ? '0' : '20px'};
  margin: ${({ $hidden, theme }) => $hidden ? '0' : `${theme.spacing.lg} 0`};
`;

const SkeletonContainer = styled.div<{ $isFirst?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  
  ${({ $isFirst, theme }) => $isFirst && `
    margin-top: -${theme.spacing.md};
  `}
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.ranking.down};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.ranking.down}33;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.md} 0;
`;

interface RankingListProps {
  items: ComicRankItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  onLoadMore: () => void;
  loadMoreTriggerRef: React.RefObject<HTMLDivElement>;
  className?: string;
}

export default function RankingList({
  items,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onLoadMore,
  loadMoreTriggerRef,
  className
}: RankingListProps) {
  // 초기 로딩 상태 - 스켈레톤 UI 표시
  if (isLoading && items.length === 0) {
    return (
      <ListContainer className={className}>
        {Array.from({ length: 10 }, (_, index) => (
          <SkeletonItem key={`skeleton-${index}`} />
        ))}
      </ListContainer>
    );
  }

  // 에러 상태
  if (error && items.length === 0) {
    return (
      <ErrorMessage>
        <h3>데이터를 불러올 수 없습니다</h3>
        <p>{error}</p>
        <button 
          onClick={onLoadMore}
          style={{ 
            marginTop: '16px', 
            padding: '8px 16px', 
            border: 'none', 
            borderRadius: '4px',
            backgroundColor: '#FF6B6B',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          다시 시도
        </button>
      </ErrorMessage>
    );
  }

  // 빈 상태 (필터링 결과가 없을 때)
  if (items.length === 0) {
    return (
      <EmptyState>
        <EmptyTitle>검색 결과가 없습니다</EmptyTitle>
        <EmptyDescription>
          다른 필터 조건을 선택해보세요.
        </EmptyDescription>
      </EmptyState>
    );
  }

  return (
    <ListContainer className={className}>
      {items.map((item) => (
        <RankingItem 
          key={item.id} 
          item={item}
        />
      ))}
      
      {/* 무한 스크롤 트리거 (로딩 중이 아닐 때만) */}
      {hasMore && !isLoadingMore && (
        <LoadMoreTrigger ref={loadMoreTriggerRef} />
      )}
      
      {/* 추가 로딩 상태 - 최소 스켈레톤 UI */}
      {isLoadingMore && (
        <SkeletonContainer $isFirst>
          <LoadMoreTrigger ref={loadMoreTriggerRef} $hidden />
          {Array.from({ length: 5 }, (_, index) => (
            <SkeletonItem key={`more-skeleton-${index}`} mode="minimal" />
          ))}
        </SkeletonContainer>
      )}
      
      {/* 에러가 있지만 기존 데이터는 표시하는 경우 */}
      {error && items.length > 0 && (
        <ErrorMessage>
          <p>추가 데이터를 불러오는데 실패했습니다: {error}</p>
          <button 
            onClick={onLoadMore}
            style={{ 
              marginTop: '8px', 
              padding: '8px 16px', 
              border: 'none', 
              borderRadius: '4px',
              backgroundColor: '#FF6B6B',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            다시 시도
          </button>
        </ErrorMessage>
      )}
    </ListContainer>
  );
}
