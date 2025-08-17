// 필터 + 장르 선택 패널
import styled from 'styled-components';
import { FilterState, FilterType, GenreType, GenreState } from '@/types/ranking';
import { getFilterLabel, getGenreLabel } from '@/utils/filter';
import Button from '@/components/common/Button';

// 메인 컨테이너 - 필터 섹션들을 세로로 스택
const FilterPanelContainer = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
`;

// 각 필터 행 - 라벨과 버튼들을 가로로 배치 (모바일에서는 세로로 변경)
const FilterRow = styled.div`
  display: flex;
  align-items: center;  // 텍스트 세로 중앙 정렬 ('필터', '장르')
  padding: ${({ theme }) => theme.spacing.lg};
  
  // 마지막 필터 행만 제외하고 테두리 추가
  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-direction: column;   // 모바일에서는 필터를 세로로 배치함
    align-items: flex-start;  // 가로 왼쪽 정렬
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// 필터 라벨 - 고정 폭으로 정렬 유지
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

// 버튼 그룹 컨테이너 - 남은 공간을 모두 차지하며 버튼들을 가로로 배치
const FilterButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs};
  flex: 1;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    width: 100%;
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
        </FilterButtons>
      </FilterRow>

      {/* 장르 행 */}
      <FilterRow>
        <FilterLabel>장르</FilterLabel>
        <FilterButtons role="group" aria-label="장르 선택">
          {genres.map((genre) => (
            <Button
              key={genre}
              size="md"
              active={genreState.selectedGenre === genre}
              onClick={() => handleGenreClick(genre)}
              aria-pressed={genreState.selectedGenre === genre}
              aria-label={`${getGenreLabel(genre)} 장르 선택`}
            >
              {getGenreLabel(genre)}
            </Button>
          ))}
        </FilterButtons>
      </FilterRow>
    </FilterPanelContainer>
  );
}
