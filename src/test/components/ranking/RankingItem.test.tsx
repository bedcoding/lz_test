import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { ReactNode } from 'react';
import { ThemeProvider } from 'styled-components';
import RankingItem from '@/components/ranking/RankingItem';
import { theme } from '@/styles/theme';
import { ComicRankItem } from '@/types/ranking';

// Test 컴포넌트 래퍼 (styled-components 테마 적용)
const TestWrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={theme}>
    {children}
  </ThemeProvider>
);

describe('RankingItem 컴포넌트', () => {
  const mockItem: ComicRankItem = {
    id: 1,
    alias: 'test-webtoon',
    title: '테스트 웹툰',
    artists: [
      { name: '테스트 작가', role: 'writer', id: 'test-artist' }
    ],
    schedule: { periods: ['MON', 'WED'] },
    genres: ['romance'],
    freedEpisodeSize: 5,
    contentsState: 'scheduled',
    print: false,
    currentRank: 1,
    previousRank: 3,
    updatedAt: 1640995200000,
    thumbnailSrc: 'https://example.com/test-thumbnail.jpg'
  };

  it('웹툰 제목, 작가명, 순위를 표시한다', () => {
    render(
      <TestWrapper>
        <RankingItem item={mockItem} />
      </TestWrapper>
    );

    // 제목 표시 확인
    expect(screen.getByText('테스트 웹툰')).toBeInTheDocument();
    
    // 작가명 표시 확인
    expect(screen.getByText('테스트 작가')).toBeInTheDocument();
    
    // 순위 표시 확인
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  it('순위 상승 시 상승 아이콘을 표시한다', () => {
    render(
      <TestWrapper>
        <RankingItem item={mockItem} />
      </TestWrapper>
    );

    // 상승 아이콘 (▲) 확인
    expect(screen.getByText('▲')).toBeInTheDocument();
    
    // 변동폭 확인 (3 → 1이므로 2만큼 상승)
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('순위 하락 시 하락 아이콘을 표시한다', () => {
    const descendingItem: ComicRankItem = {
      ...mockItem,
      currentRank: 5,
      previousRank: 2
    };

    render(
      <TestWrapper>
        <RankingItem item={descendingItem} />
      </TestWrapper>
    );

    // 하락 아이콘 (▼) 확인
    expect(screen.getByText('▼')).toBeInTheDocument();
    
    // 변동폭 확인 (2 → 5이므로 3만큼 하락)
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('순위 변동 없음 시 - 아이콘을 표시한다', () => {
    const sameRankItem: ComicRankItem = {
      ...mockItem,
      currentRank: 1,
      previousRank: 1
    };

    render(
      <TestWrapper>
        <RankingItem item={sameRankItem} />
      </TestWrapper>
    );

    // 변동없음 아이콘 (-) 확인
    expect(screen.getByText('-')).toBeInTheDocument();
  });

  it('연재 요일을 "매주 월요일, 수요일 연재" 형식으로 표시한다', () => {
    render(
      <TestWrapper>
        <RankingItem item={mockItem} />
      </TestWrapper>
    );

    // 연재 요일 표시 확인 (실제 형식에 맞춤)
    expect(screen.getByText('매주 월요일, 수요일 연재')).toBeInTheDocument();
  });

  it('완결 작품은 "완결"로 표시한다', () => {
    const completedItem: ComicRankItem = {
      ...mockItem,
      contentsState: 'completed',
      schedule: { periods: [] }
    };

    render(
      <TestWrapper>
        <RankingItem item={completedItem} />
      </TestWrapper>
    );

    expect(screen.getByText('완결')).toBeInTheDocument();
  });

  it('무료회차 정보를 표시한다', () => {
    render(
      <TestWrapper>
        <RankingItem item={mockItem} />
      </TestWrapper>
    );

    // 무료회차 정보 확인
    expect(screen.getByText('5화 무료')).toBeInTheDocument();
  });

  it('무료회차가 0일 때는 "0화 무료"로 표시한다', () => {
    const paidItem: ComicRankItem = {
      ...mockItem,
      freedEpisodeSize: 0
    };

    render(
      <TestWrapper>
        <RankingItem item={paidItem} />
      </TestWrapper>
    );

    expect(screen.getByText('0화 무료')).toBeInTheDocument();
  });

  it('썸네일 이미지에 적절한 alt 텍스트를 설정한다', () => {
    render(
      <TestWrapper>
        <RankingItem item={mockItem} />
      </TestWrapper>
    );

    const thumbnail = screen.getByRole('img');
    expect(thumbnail).toHaveAttribute('alt', '테스트 웹툰 썸네일');
  });

  it('이미지 로딩 에러 시 회색 박스만 표시된다', async () => {
    // 에러를 발생시키는 이미지 URL (유효한 형식이지만 실제로는 존재하지 않음)
    const errorItem: ComicRankItem = {
      ...mockItem,
      thumbnailSrc: 'https://example.com/non-existent-image.jpg'
    };

    render(
      <TestWrapper>
        <RankingItem item={errorItem} />
      </TestWrapper>
    );

    const thumbnail = screen.getByRole('img');
    
    // 이미지 에러 이벤트 발생
    thumbnail.dispatchEvent(new Event('error'));

    await waitFor(() => {
      expect(thumbnail).toHaveClass('error');
    });
  });

  it('이미지 로딩 완료 시 fade-in 효과가 적용된다', async () => {
    render(
      <TestWrapper>
        <RankingItem item={mockItem} />
      </TestWrapper>
    );

    const thumbnail = screen.getByRole('img');
    
    // 이미지 로드 완료 이벤트 발생
    thumbnail.dispatchEvent(new Event('load'));

    await waitFor(() => {
      expect(thumbnail).toHaveClass('loaded');
    });
  });
});
