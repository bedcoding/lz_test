import styled from 'styled-components';
import { FilterState, FilterType } from '@/types/ranking';
import { getFilterLabel } from '@/utils/filter';
import Button from '@/components/common/Button';

// 메인 컨테이너 - 필터 버튼들을 가로로 배치, 모바일에서 wrap 허용
const FilterContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
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
        <Button
          key={filterType}
          size="md"
          active={filters[filterType]}
          onClick={() => handleFilterClick(filterType)}
          aria-pressed={filters[filterType]}
          aria-label={`${getFilterLabel(filterType)} 필터 ${filters[filterType] ? '해제' : '적용'}`}
        >
          {getFilterLabel(filterType)}
        </Button>
      ))}
    </FilterContainer>
  );
}
