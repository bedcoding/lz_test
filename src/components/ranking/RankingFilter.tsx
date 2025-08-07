'use client';

import React from 'react';
import styled from 'styled-components';
import { FilterState, FilterType } from '@/types/ranking';
import Button from '@/components/common/Button';
import { getFilterLabel } from '@/utils/filter';

const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.lg} 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const FilterGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  align-items: center;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 100%;
    justify-content: space-between;
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
    <FilterContainer className={className}>
      <FilterGroup role="group" aria-label="작품 필터링 옵션">
        {filterTypes.map((filterType) => (
          <Button
            key={filterType}
            variant="filter"
            size="sm"
            active={filters[filterType]}
            onClick={() => handleFilterClick(filterType)}
            aria-pressed={filters[filterType]}
            aria-label={`${getFilterLabel(filterType)} 필터 ${filters[filterType] ? '해제' : '적용'}`}
          >
            {getFilterLabel(filterType)}
          </Button>
        ))}
      </FilterGroup>
    </FilterContainer>
  );
}
