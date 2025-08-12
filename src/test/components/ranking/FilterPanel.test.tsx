import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from 'styled-components';
import FilterPanel from '@/components/ranking/FilterPanel';
import { theme } from '@/styles/theme';
import { FilterState, GenreState } from '@/types/ranking';

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('FilterPanel 컴포넌트', () => {
  const mockFilters: FilterState = {
    ongoing: false,
    completed: false,
    freeEpisodes: false
  };

  const mockGenreState: GenreState = {
    selectedGenre: 'romance'
  };

  const mockOnFilterChange = vi.fn();
  const mockOnGenreChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('필터와 장르 제목을 화면에 표시한다', () => {
    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    expect(screen.getByText('필터')).toBeInTheDocument();
    expect(screen.getByText('장르')).toBeInTheDocument();
  });

  it('모든 필터 버튼을 렌더링한다', () => {
    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /연재 중/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /완결/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /무료회차 3개/ })).toBeInTheDocument();
  });

  it('모든 장르 버튼을 렌더링한다', () => {
    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    expect(screen.getByRole('button', { name: /로맨스/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /드라마/ })).toBeInTheDocument();
  });

  it('선택된 필터 버튼이 활성 상태로 표시된다', () => {
    const activeFilters: FilterState = {
      ongoing: true,
      completed: false,
      freeEpisodes: true
    };

    render(
      <TestWrapper>
        <FilterPanel
          filters={activeFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    const ongoingButton = screen.getByRole('button', { name: /연재 중/ });
    const completedButton = screen.getByRole('button', { name: /완결/ });
    const freeEpisodesButton = screen.getByRole('button', { name: /무료회차 3개/ });

    // aria-pressed 속성으로 활성 상태 확인
    expect(ongoingButton).toHaveAttribute('aria-pressed', 'true');
    expect(completedButton).toHaveAttribute('aria-pressed', 'false');
    expect(freeEpisodesButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('선택된 장르 버튼이 활성 상태로 표시된다', () => {
    const dramaGenreState: GenreState = {
      selectedGenre: 'drama'
    };

    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={dramaGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    const romanceButton = screen.getByRole('button', { name: /로맨스/ });
    const dramaButton = screen.getByRole('button', { name: /드라마/ });

    expect(romanceButton).toHaveAttribute('aria-pressed', 'false');
    expect(dramaButton).toHaveAttribute('aria-pressed', 'true');
  });

  it('필터 버튼 클릭 시 onFilterChange가 호출된다', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    const ongoingButton = screen.getByRole('button', { name: /연재 중/ });
    await user.click(ongoingButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('ongoing');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('장르 버튼 클릭 시 onGenreChange가 호출된다', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    const dramaButton = screen.getByRole('button', { name: /드라마/ });
    await user.click(dramaButton);

    expect(mockOnGenreChange).toHaveBeenCalledWith('drama');
    expect(mockOnGenreChange).toHaveBeenCalledTimes(1);
  });

  // 웹 접근성 테스트: 마우스를 사용할 수 없는 사용자가 키보드만으로도 모든 필터 기능을 사용할 수 있도록 보장 (Tab, Enter 키로 완전한 네비게이션이 가능해야 함)
  it('키보드 네비게이션이 작동한다', async () => {
    const user = userEvent.setup();

    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    const ongoingButton = screen.getByRole('button', { name: /연재 중/ });
    
    // Tab키로 포커스 이동
    await user.tab();
    expect(ongoingButton).toHaveFocus();

    // Enter 키로 클릭
    await user.keyboard('{Enter}');
    expect(mockOnFilterChange).toHaveBeenCalledWith('ongoing');
  });

  // 웹 접근성 테스트: 스크린 리더 사용자가 필터와 장르 영역을 명확히 구분할 수 있도록 role="group"과 aria-label 속성 설정
  it('필터와 장르 그룹에 role과 aria-label을 설정한다', () => {
    render(
      <TestWrapper>
        <FilterPanel
          filters={mockFilters}
          onFilterChange={mockOnFilterChange}
          genreState={mockGenreState}
          onGenreChange={mockOnGenreChange}
        />
      </TestWrapper>
    );

    // role="group" 확인: 관련 버튼들을 하나의 그룹으로 묶어줌
    const filterGroup = screen.getByRole('group', { name: /작품 필터링 옵션/ });
    const genreGroup = screen.getByRole('group', { name: /장르 선택/ });

    expect(filterGroup).toBeInTheDocument();
    expect(genreGroup).toBeInTheDocument();

    // aria-label 확인 (스크린 리더가 버튼의 기능을 설명함)
    const ongoingButton = screen.getByRole('button', { name: /연재 중 필터/ });
    expect(ongoingButton).toHaveAttribute('aria-label');
  });
});
