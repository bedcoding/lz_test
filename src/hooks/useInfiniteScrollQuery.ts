import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollQueryOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
  isFetching?: boolean;
}

export function useInfiniteScrollQuery({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px',
  isFetching = false
}: UseInfiniteScrollQueryOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const nodeRef = useRef<HTMLDivElement | null>(null);
  const pendingRef = useRef(false);
  
  // TanStack Query 상태를 ref로 관리하여 최신 값 참조
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const isFetchingRef = useRef(isFetching);
  const onLoadMoreRef = useRef(onLoadMore);

  // props 변경시 ref 동기화
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { isFetchingRef.current = isFetching; }, [isFetching]);
  useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);

  const loadMoreTriggerRef = useCallback((node: HTMLDivElement | null) => {
    // 이전 노드 감시 해제
    if (observerRef.current && nodeRef.current) {
      observerRef.current.unobserve(nodeRef.current);
    }
    
    nodeRef.current = node;
    
    // 조건 확인
    if (!node || typeof IntersectionObserver === 'undefined') return;

    // observer 생성 (한 번만)
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        
        // TanStack Query의 isFetching 상태도 고려하여 중복 호출 방지
        if (
          !hasMoreRef.current || 
          isLoadingRef.current || 
          isFetchingRef.current ||
          pendingRef.current
        ) return;
        
        // 락 설정 후 비동기 처리
        pendingRef.current = true;
        Promise.resolve(onLoadMoreRef.current()).finally(() => {
          pendingRef.current = false;
        });
      }, {
        threshold,
        rootMargin
      });
    }
    
    // 새 노드 감시 시작
    observerRef.current.observe(node);
  }, [threshold, rootMargin]);

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트시 observer 정리
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { loadMoreTriggerRef };
}
