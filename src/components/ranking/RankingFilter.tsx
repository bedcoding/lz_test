'use client';

import styled from 'styled-components';
import { FilterState, FilterType } from '@/types/ranking';
import { getFilterLabel } from '@/utils/filter';

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
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

interface RankingFilterProps {
  filters: FilterState;
  onFilterChange: (filterType: FilterType) => void;
  className?: string;
}

export default function RankingFilter({
  filters,
  onFilterChange,
  className
}: RankingFilterProps) {
  const filterTypes: FilterType[] = ['ongoing', 'completed', 'freeEpisodes'];

  const handleFilterClick = (filterType: FilterType) => {
    onFilterChange(filterType);
  };

  return (
    <FilterContainer className={className} role="group" aria-label="작품 필터링 옵션">
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
    </FilterContainer>
  );
}
