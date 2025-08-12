'use client';

import { useState } from 'react';
import { GenreType, GenreState } from '@/types/ranking';
import { getInitialGenreState } from '@/utils/filter';

export function useGenre() {
  const [genreState, setGenreState] = useState<GenreState>(getInitialGenreState);

  // 장르 변경 함수
  const handleGenreChange = (genre: GenreType) => {
    setGenreState({ selectedGenre: genre });
  };

  // 장르 초기화
  const resetGenre = () => {
    setGenreState(getInitialGenreState());
  };

  return {
    genreState,
    handleGenreChange,
    resetGenre
  };
}
