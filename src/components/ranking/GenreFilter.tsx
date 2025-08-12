'use client';

import styled from 'styled-components';
import { GenreType, GenreState } from '@/types/ranking';
import { getGenreLabel } from '@/utils/filter';

const GenreContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const GenreButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.xl};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.border
  };
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.background
  };
  color: ${({ theme, $active }) => 
    $active ? 'white' : theme.colors.text.primary
  };
  font-size: ${({ theme }) => theme.fonts.size.sm};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ $active, theme }) => !$active && `
      background-color: ${theme.colors.surface};
    `}
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.md};
    font-size: ${({ theme }) => theme.fonts.size.xs};
  }
`;

interface GenreFilterProps {
  genreState: GenreState;
  onGenreChange: (genre: GenreType) => void;
  className?: string;
}

export default function GenreFilter({
  genreState,
  onGenreChange,
  className
}: GenreFilterProps) {
  const genres: GenreType[] = ['romance', 'drama'];

  const handleGenreClick = (genre: GenreType) => {
    onGenreChange(genre);
  };

  return (
    <GenreContainer className={className} role="group" aria-label="장르 선택">
      {genres.map((genre) => (
        <GenreButton
          key={genre}
          $active={genreState.selectedGenre === genre}
          onClick={() => handleGenreClick(genre)}
          aria-pressed={genreState.selectedGenre === genre}
          aria-label={`${getGenreLabel(genre)} 장르 선택`}
        >
          {getGenreLabel(genre)}
        </GenreButton>
      ))}
    </GenreContainer>
  );
}
