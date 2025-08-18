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
  const observerRef = useRef<IntersectionObserver | null>(null);  // observer 인스턴스는 한 번만 생성하여 재사용 (메모리 아끼려고)
  const nodeRef = useRef<HTMLDivElement | null>(null);  // 무한스크롤을 위해 집어넣은 리스트 맨 아래 보이지 않는 div (이게 화면에 나타나면 추가로 로드함)
  const pendingRef = useRef(false);  // 중복 호출 방지를 위한 락
  
  // 무한스크롤 콜백이 항상 최신 상태값을 사용하도록 ref로 보관 (useCallback으로 생성된 함수가 클로저로 인해 오래된 값을 참조하는 문제 방지)
  const hasMoreRef = useRef(hasMore);
  const isLoadingRef = useRef(isLoading);
  const onLoadMoreRef = useRef(onLoadMore);

  // props가 변경될 때마다 ref를 최신 값으로 동기화
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);
  useEffect(() => { isLoadingRef.current = isLoading; }, [isLoading]);
  useEffect(() => { onLoadMoreRef.current = onLoadMore; }, [onLoadMore]);

  // 무한스크롤을 위해 집어넣은 리스트 맨 아래 보이지 않는 div가 바뀔 때마다 무한스크롤 감지를 다시 설정함
  const loadMoreTriggerRef = useCallback((node: HTMLDivElement | null) => {
    // 이전 노드가 있으면 감시 해제
    if (observerRef.current && nodeRef.current) {
      observerRef.current.unobserve(nodeRef.current);
    }
    
    nodeRef.current = node;
    
    // 새 노드가 없거나 브라우저에서 IntersectionObserver를 지원하지 않으면 종료
    if (!node || typeof IntersectionObserver === 'undefined') return;

    // 성능 최적화를 위해 observer가 없으면 한번만 생성
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting) return;
        
        // 최신 ref 값으로 조건 확인 + 락 확인으로 중복 호출 방지
        if (!hasMoreRef.current || isLoadingRef.current || pendingRef.current) return;
        
        // 락 설정하고 비동기 처리 - 동시 실행 방지
        pendingRef.current = true;
        Promise.resolve(onLoadMoreRef.current()).finally(() => {
          pendingRef.current = false; // 완료 후 락 해제
        });
      }, {
        threshold,    // 10% 보이면 트리거
        rootMargin    // 100px 미리 감지
      });
    }
    
    // 새 노드 감시 시작 (무한스크롤을 위해 집어넣은 리스트 맨 아래 보이지 않는 div가 바뀔 때에도 연속성 보장)
    observerRef.current.observe(node);
  }, [threshold, rootMargin]);

  useEffect(() => {
    return () => {
      // 컴포넌트 언마운트 시 observer 정리
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { loadMoreTriggerRef };
}