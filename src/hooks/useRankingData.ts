'use client';

import { useState, useEffect, useCallback } from 'react';
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

export function useRankingData(genre: GenreType = 'romance') {
  const [state, setState] = useState<UseRankingDataState>({
    items: [],
    isLoading: true,
    isLoadingMore: false,
    hasMore: true,
    error: null,
    currentPage: 0
  });

  // 첫 페이지 로드
  const loadInitialData = useCallback(async () => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      error: null
    }));

    try {
      const response = await fetchGenreRanking(genre, 1);
      
      setState(prev => ({
        ...prev,
        items: response.data,
        isLoading: false,
        hasMore: response.hasNext,
        currentPage: 1,
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '데이터를 불러오는데 실패했습니다.';
      
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));
    }
  }, [genre]);

  // 다음 페이지 로드
  const loadMoreData = useCallback(async () => {
    if (state.isLoadingMore || !state.hasMore || state.isLoading) {
      return;
    }

    setState(prev => ({
      ...prev,
      isLoadingMore: true,
      error: null
    }));

    try {
      const nextPage = state.currentPage + 1;
      const response = await fetchGenreRanking(genre, nextPage);
      
      setState(prev => ({
        ...prev,
        items: [...prev.items, ...response.data],
        isLoadingMore: false,
        hasMore: response.hasNext,
        currentPage: nextPage,
        error: null
      }));
    } catch (error) {
      const errorMessage = error instanceof ApiError 
        ? error.message 
        : '추가 데이터를 불러오는데 실패했습니다.';
      
      setState(prev => ({
        ...prev,
        isLoadingMore: false,
        hasMore: false, // 🔥 에러 발생 시 무한스크롤 중단
        error: errorMessage
      }));
    }
  }, [genre, state.currentPage, state.hasMore, state.isLoadingMore, state.isLoading]);

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

  // 컴포넌트 마운트 시 또는 장르 변경 시 초기 데이터 로드
  useEffect(() => {
    refreshData();
  }, [genre, refreshData]);

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
