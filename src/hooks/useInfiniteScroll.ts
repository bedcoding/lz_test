'use client';

import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number;
  rootMargin?: string;
}

export function useInfiniteScroll({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.1,
  rootMargin = '100px'
}: UseInfiniteScrollOptions) {
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      
      if (
        entry?.isIntersecting && 
        hasMore && 
        !isLoading
      ) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    // 감시할 DOM 요소 (무한스크롤 트리거)
    const element = loadMoreTriggerRef.current;
    if (!element) return;

    // IntersectionObserver: 특정 요소가 화면에 보이는지 감시하는 브라우저 API
    // 예: 스크롤해서 "더보기" 버튼이 화면에 나타나면 자동으로 다음 페이지 로드
    const observer = new IntersectionObserver(handleIntersection, {
      threshold,    // 얼마나 보여야 감지할지 (0.1 = 10% 보이면 감지)
      rootMargin    // 미리 감지할 여백 (예: "-100px" = 100px 전에 미리 감지)
    });

    // 실제 감시 시작 - element가 화면에 나타나면 handleIntersection 호출
    observer.observe(element);

    // 컴포넌트 언마운트 시 정리 (메모리 누수 방지)
    return () => {
      try {
        observer.unobserve(element);  // 특정 요소 감시 중단
        observer.disconnect();        // observer 완전히 종료
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Error cleaning up IntersectionObserver:', error);
        }
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  return { loadMoreTriggerRef };
}
