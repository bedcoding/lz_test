'use client';

import styled from 'styled-components';
import { FilterState, FilterType, GenreType, GenreState } from '@/types/ranking';
import { getFilterLabel, getGenreLabel } from '@/utils/filter';

const FilterPanelContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.lg};
  
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;
    align-items: flex-start;
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const FilterLabel = styled.div`
  font-size: ${({ theme }) => theme.fonts.size.base};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  min-width: 60px;
  margin-right: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-right: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
`;

const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    width: 100%;
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
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
    ${({ $active, theme }) => !$active && `
      border-color: ${theme.colors.primary};
      background-color: ${theme.colors.surface};
    `}
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.size.xs};
  }
`;

const GenreButton = styled.button<{ $active: boolean }>`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
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
    ${({ $active, theme }) => !$active && `
      border-color: ${theme.colors.primary};
      background-color: ${theme.colors.surface};
    `}
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fonts.size.xs};
  }
`;

interface FilterPanelProps {
  filters: FilterState;
  onFilterChange: (filterType: FilterType) => void;
  genreState: GenreState;
  onGenreChange: (genre: GenreType) => void;
  className?: string;
}

export default function FilterPanel({
  filters,
  onFilterChange,
  genreState,
  onGenreChange,
  className
}: FilterPanelProps) {
  const filterTypes: FilterType[] = ['ongoing', 'completed', 'freeEpisodes'];
  const genres: GenreType[] = ['romance', 'drama'];

  const handleFilterClick = (filterType: FilterType) => {
    onFilterChange(filterType);
  };

  const handleGenreClick = (genre: GenreType) => {
    onGenreChange(genre);
  };

  return (
    <FilterPanelContainer className={className}>
      {/* 필터 행 */}
      <FilterRow>
        <FilterLabel>필터</FilterLabel>
        <FilterButtons role="group" aria-label="작품 필터링 옵션">
          {filterTypes.map((filterType) => (
            <FilterButton
              key={filterType}
              $active={filters[filterType]}
              onClick={() => handleFilterClick(filterType)}
              aria-pressed={filters[filterType]}
              aria-label={`${getFilterLabel(filterType)} 필터 ${filters[filterType] ? '해제' : '적용'}`}
            >
              {getFilterLabel(filterType)}
            </FilterButton>
          ))}
        </FilterButtons>
      </FilterRow>

      {/* 장르 행 */}
      <FilterRow>
        <FilterLabel>장르</FilterLabel>
        <FilterButtons role="group" aria-label="장르 선택">
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
        </FilterButtons>
      </FilterRow>
    </FilterPanelContainer>
  );
}
