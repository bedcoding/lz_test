import styled from 'styled-components';
import { GenreType, GenreState } from '@/types/ranking';
import { getGenreLabel } from '@/utils/filter';
import Button from '@/components/common/Button';

// 메인 컨테이너 - 장르 버튼들을 가로로 배치
const GenreContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.sm} 0;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.xs};
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
    </GenreContainer>
  );
}
