import { useState, useEffect, useCallback, useRef } from 'react';
import { ComicRankItem, GenreType } from '@/types/ranking';
import { fetchGenreRanking, ApiError } from '@/services/api';

interface UseRankingDataState {
  items: ComicRankItem[];
  isLoading: boolean;
  isLoadingMore: boolean;
  hasMore: boolean;
  error: string | null;
  currentPage: number;
}

// 무한스크롤 페이지 간 중복 웹툰 방지
function dedupeById(existing: ComicRankItem[], newItems: ComicRankItem[]): ComicRankItem[] {
  const existingIds = new Set(existing.map(item => item.id));
  const uniqueNewItems = newItems.filter(item => !existingIds.has(item.id));  // 새로 받은 웹툰들 중에서 기존에 없던 것들만 걸러내기
  return [...existing, ...uniqueNewItems];  // 기존 웹툰 + 새로 받아온 웹툰
}

export function useRankingData(genre: GenreType = 'romance', initialData?: ComicRankItem[]) {
  const [isFirstMount, setIsFirstMount] = useState(true);
  
  // 빠른 스크롤 시 비동기 응답 순서 꼬임 방지용 ref들 (abortRef: 이전요청 취소, pageRef: 최신페이지 참조, pendingRef: 중복방지)
  const abortRef = useRef<AbortController | null>(null);  // 이전 요청 취소를 위한 AbortController 관리
  const pageRef = useRef(0);  // useCallback에서 최신 페이지 값 참조를 위한 ref (useState의 stale closure 문제 해결)
  const pendingRef = useRef(false);  // 동시 요청 방지를 위한 락을 걸기 위한 ref
  
  // 무한스크롤/페이지네이션 상태 (최초 진입시 initialData가 있으면 초기값으로 설정)
  const [state, setState] = useState<UseRankingDataState>({
    items: initialData || [],
    isLoading: !initialData, // initialData가 있으면 로딩 완료
    isLoadingMore: false,
    hasMore: true,
    error: null,
    currentPage: initialData ? 1 : 0 // initialData가 있으면 1페이지
  });

  // 초기 페이지 ref 설정 - SSR 데이터와 ref 동기화
  useEffect(() => {
    if (initialData) {
      pageRef.current = 1;
    }
  }, [initialData]);

  const loadInitialData = useCallback(async () => {
    abortRef.current?.abort(); // 진행 중인 요청이 있으면 취소 (이전 요청 취소로 레이스 컨디션 방지)
    const abortController = new AbortController();
    abortRef.current = abortController;
    
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));
    
    // 동시 요청 방지 락 설정
    pendingRef.current = true;

    try {
      // AbortSignal 전달해서 취소되지 않은 요청만 처리
      const response = await fetchGenreRanking(genre, 1, { signal: abortController.signal });
      if (!abortController.signal.aborted) {
        setState(prev => ({
          ...prev,
          items: response.data,
          isLoading: false,
          hasMore: response.hasNext,
          currentPage: 1,
          error: null
        }));
        
        // 최초 호출이므로 ref도 1로 동기화
        pageRef.current = 1;
      }
    } catch (error: unknown) {
      // AbortError는 무시 (의도적인 취소)
      if (!abortController.signal.aborted) {
        const errorMessage = error instanceof ApiError 
          ? error.message 
          : '데이터를 불러오는데 실패했습니다.';
        
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: errorMessage
        }));
      }
    } finally {
      // 최후의 순간에는 항상 락을 해제해줌
      pendingRef.current = false;
    }
  }, [genre]);

  // 다음 페이지 로드
  const loadMoreData = useCallback(async () => {
    // 중복 실행 방지
    if (pendingRef.current || state.isLoading || state.isLoadingMore || !state.hasMore) {
      return;
    }

    setState(prev => ({
      ...prev,
      isLoadingMore: true,
      error: null
    }));
    
    // 락 설정으로 동시 실행 방지
    pendingRef.current = true;

    try {
      // 항상 최신 페이지 번호를 가져와서 다음 페이지 계산
      const nextPage = pageRef.current + 1;
      const response = await fetchGenreRanking(genre, nextPage);
      
      setState(prev => ({
        ...prev,
        // 중복 제거로 데이터 무결성 보장
        items: dedupeById(prev.items, response.data),
        isLoadingMore: false,
        hasMore: response.hasNext, // 서버 응답으로만 hasMore 갱신
        currentPage: prev.currentPage + 1,
        error: null
      }));
      // ref도 동기화 (중요!)
      pageRef.current = nextPage;
    } catch (error: unknown) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '추가 데이터를 불러오는데 실패했습니다.';
      
      setState(prev => ({
        ...prev,
        isLoadingMore: false,
        error: errorMessage
      }));
    } finally {
      // 항상 락 해제
      pendingRef.current = false;
    }
  }, [genre, state.isLoading, state.isLoadingMore, state.hasMore]);

  // 데이터 새로고침
  const refreshData = useCallback(() => {
    setState({
      items: [],
      isLoading: true,
      isLoadingMore: false,
      hasMore: true,
      error: null,
      currentPage: 0
    });
    loadInitialData();
  }, [loadInitialData]);

  // 최초 실행시 초기 데이터 로드
  useEffect(() => {
    if (isFirstMount && initialData && initialData.length > 0) {
      setIsFirstMount(false);
      return;
    }

    refreshData();
  }, [genre, refreshData, initialData, isFirstMount]);

  // 무한스크롤 재시도 함수
  const retryLoadMore = useCallback(() => {
    setState(prev => ({
      ...prev,
      hasMore: true, // 재시도를 위해 hasMore 복구
      error: null
    }));
    loadMoreData();
  }, [loadMoreData]);

  return {
    ...state,
    loadMoreData,
    refreshData,
    retryLoadMore
  };
}
