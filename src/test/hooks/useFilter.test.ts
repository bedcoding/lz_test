import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFilter } from '@/hooks/useFilter';
import { ComicRankItem } from '@/types/ranking';

describe('useFilter 웹툰 필터링 기능 (연재중/완결/무료회차)', () => {
  const mockItems: ComicRankItem[] = [
    {
      id: 1,
      alias: 'ongoing-free',
      title: '연재중 무료작품',
      artists: [{ name: '작가1', role: 'writer', email: null, id: 'artist1' }],
      schedule: { periods: ['MON'], anchor: 0 },
      genres: ['romance'],
      badges: '',
      freedEpisodeSize: 5,
      contentsState: 'scheduled',
      isPrint: false,
      currentRank: 1,
      previousRank: 1,
      updatedAt: 1640000000000,
      thumbnailSrc: 'test1.jpg'
    },
    {
      id: 2,
      alias: 'completed-paid',
      title: '완결 유료작품',
      artists: [{ name: '작가2', role: 'writer', email: null, id: 'artist2' }],
      schedule: { periods: [], anchor: 0 },
      genres: ['romance'],
      badges: '',
      freedEpisodeSize: 1,
      contentsState: 'completed',
      isPrint: false,
      currentRank: 2,
      previousRank: 2,
      updatedAt: 1640000000000,
      thumbnailSrc: 'test2.jpg'
    },
    {
      id: 3,
      alias: 'completed-free',
      title: '완결 무료작품',
      artists: [{ name: '작가3', role: 'writer', email: null, id: 'artist3' }],
      schedule: { periods: [], anchor: 0 },
      genres: ['romance'],
      badges: '',
      freedEpisodeSize: 10,
      contentsState: 'completed',
      isPrint: false,
      currentRank: 3,
      previousRank: 3,
      updatedAt: 1640000000000,
      thumbnailSrc: 'test3.jpg'
    }
  ];

  it('초기 상태에서는 모든 필터가 false이고 모든 아이템을 반환한다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    expect(result.current.filters).toEqual({
      ongoing: false,
      completed: false,
      freeEpisodes: false
    });
    expect(result.current.filteredItems).toEqual(mockItems);
  });

  it('연재중 필터를 활성화하면 연재중 작품만 반환한다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    act(() => {
      result.current.handleFilterToggle('ongoing');
    });

    expect(result.current.filters.ongoing).toBe(true);
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].contentsState).toBe('scheduled');
  });

  it('완결 필터를 활성화하면 완결 작품만 반환한다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    act(() => {
      result.current.handleFilterToggle('completed');
    });

    expect(result.current.filters.completed).toBe(true);
    expect(result.current.filteredItems).toHaveLength(2);
    result.current.filteredItems.forEach(item => {
      expect(item.contentsState).toBe('completed');
    });
  });

  it('무료회차 필터를 활성화하면 3개 이상 무료회차 작품만 반환한다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    act(() => {
      result.current.handleFilterToggle('freeEpisodes');
    });

    expect(result.current.filters.freeEpisodes).toBe(true);
    expect(result.current.filteredItems).toHaveLength(2);
    result.current.filteredItems.forEach(item => {
      expect(item.freedEpisodeSize).toBeGreaterThanOrEqual(3);
    });
  });

  it('여러 필터를 동시에 활성화할 수 있다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    act(() => {
      result.current.handleFilterToggle('completed');
    });

    act(() => {
      result.current.handleFilterToggle('freeEpisodes');
    });

    expect(result.current.filters.completed).toBe(true);
    expect(result.current.filters.freeEpisodes).toBe(true);
    
    // 완결이면서 무료회차 3개 이상인 작품
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].title).toBe('완결 무료작품');
  });

  it('활성화된 필터를 다시 클릭하면 비활성화된다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    // 필터 활성화
    act(() => {
      result.current.handleFilterToggle('ongoing');
    });
    expect(result.current.filters.ongoing).toBe(true);

    // 같은 필터 다시 클릭하여 비활성화
    act(() => {
      result.current.handleFilterToggle('ongoing');
    });
    expect(result.current.filters.ongoing).toBe(false);
    expect(result.current.filteredItems).toEqual(mockItems);
  });

  it('아이템 목록이 변경되면 필터가 새로운 목록에 적용된다', () => {
    const { result, rerender } = renderHook(
      ({ items }) => useFilter(items),
      { initialProps: { items: mockItems } }
    );

    // 완결 필터 활성화
    act(() => {
      result.current.handleFilterToggle('completed');
    });
    expect(result.current.filteredItems).toHaveLength(2);

    // 새로운 아이템 목록으로 업데이트 (연재중 작품만)
    const newItems = [mockItems[0]]; // 연재중 작품만
    rerender({ items: newItems });

    // 완결 필터가 여전히 활성화되어 있지만, 연재중 작품만 있으므로 빈 배열
    expect(result.current.filters.completed).toBe(true);
    expect(result.current.filteredItems).toHaveLength(0);
  });

  it('빈 배열이 전달되면 빈 배열을 반환한다', () => {
    const { result } = renderHook(() => useFilter([]));

    expect(result.current.filteredItems).toEqual([]);

    // 필터를 활성화해도 여전히 빈 배열
    act(() => {
      result.current.handleFilterToggle('ongoing');
    });
    expect(result.current.filteredItems).toEqual([]);
  });

  it('여러 필터를 동시 적용할 때 AND 조건으로 작동한다', () => {
    const { result } = renderHook(() => useFilter(mockItems));

    // ongoing과 freeEpisodes 동시 활성화
    act(() => {
      result.current.handleFilterToggle('ongoing');
    });
    act(() => {
      result.current.handleFilterToggle('freeEpisodes');
    });

    // 연재중이면서 무료회차 3개 이상인 작품
    expect(result.current.filteredItems).toHaveLength(1);
    expect(result.current.filteredItems[0].title).toBe('연재중 무료작품');
    expect(result.current.filteredItems[0].contentsState).toBe('scheduled');
    expect(result.current.filteredItems[0].freedEpisodeSize).toBeGreaterThanOrEqual(3);
  });
});
