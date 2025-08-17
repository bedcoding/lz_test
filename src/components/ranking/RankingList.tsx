// 웹툰 무한스크롤 리스트
import { RefObject } from 'react';
import styled from 'styled-components';
import { ComicRankItem } from '@/types/ranking';
import RankingItem from './RankingItem';
import SkeletonItem from '@/components/common/SkeletonItem';
import Button from '@/components/common/Button';

// 메인 리스트 컨테이너 - flex column으로 아이템들을 세로 배치
const ListContainer = styled.div`
  display: flex;
  flex-direction: column;  // RankingItem 리스트들 세로 배치
  gap: ${({ theme }) => theme.spacing.md};
`;

// 빈 상태 표시 - 필터링 결과가 없을 때
const EmptyState = styled.div`
  text-align: center;  // 텍스트 중앙 정렬
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

// 무한스크롤 트리거 - IntersectionObserver가 감지할 요소
const LoadMoreTrigger = styled.div<{ $hidden?: boolean }>`
  height: ${({ $hidden }) => $hidden ? '0' : '20px'};
  margin: ${({ $hidden, theme }) => $hidden ? '0' : `${theme.spacing.lg} 0`};
`;

// 스켈레톤 로딩 컨테이너 - 추가 데이터 로딩 중 표시
const SkeletonContainer = styled.div<{ $isFirst?: boolean }>`
  display: flex;
  flex-direction: column;  // 스켈레톤 아이템들도 세로 스택
  gap: ${({ theme }) => theme.spacing.md};
  
  ${({ $isFirst, theme }) => $isFirst && `
    margin-top: -${theme.spacing.md};
  `}
`;

// 무한스크롤 에러 UI - 재시도 버튼 포함
const InfiniteScrollError = styled.div`
  display: flex;
  flex-direction: column;  // 에러 메시지와 버튼을 세로 배치
  align-items: center;     // 수평 중앙 정렬
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  text-align: center;
  margin: 0;
  font-size: ${({ theme }) => theme.fonts.size.sm};
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
  onRetryLoadMore: () => void;
  loadMoreTriggerRef: RefObject<HTMLDivElement | null>;
  className?: string;
}

export default function RankingList({
  items,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  onLoadMore,
  onRetryLoadMore,
  loadMoreTriggerRef,
  className
}: RankingListProps) {
  // 초기 로딩 상태 - 10개의 스켈레톤 UI 표시
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
        <EmptyTitle>결과가 없습니다</EmptyTitle>
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

      {/* 무한스크롤 중 에러 발생 시 재시도 UI */}
      {items.length > 0 && error && !hasMore && !isLoadingMore && (
        <InfiniteScrollError>
          <ErrorText>{error}</ErrorText>
          <Button active onClick={onRetryLoadMore}>
            다시 시도
          </Button>
        </InfiniteScrollError>
      )}

    </ListContainer>
  );
}
