import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import React from 'react';
import { useRankingDataQuery } from '@/hooks/useRankingDataQuery';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('useRankingDataQuery TanStack Query 기반 데이터 훅', () => {
  let queryClient: QueryClient;

  const createWrapper = () => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false, // 테스트에서는 재시도 비활성화
          gcTime: 0, // 가비지 컬렉션 즉시 실행
        },
      },
    });

    return function Wrapper({ children }: { children: ReactNode }) {
      return (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      );
    };
  };

  beforeEach(() => {
    queryClient?.clear();
  });

  it('초기 상태에서는 로딩 상태이고 데이터가 없다', () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);
    expect(result.current.items).toEqual([]);
    expect(result.current.error).toBe(null);
  });

  it('로맨스 장르 데이터를 성공적으로 로드한다', async () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.items).toBeInstanceOf(Array);
    expect(result.current.items.length).toBeGreaterThan(0);
    expect(result.current.items[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      genres: ['romance']
    });
    expect(result.current.error).toBe(null);
  });

  it('드라마 장르 데이터를 성공적으로 로드한다', async () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'drama' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.items).toBeInstanceOf(Array);
    expect(result.current.items.length).toBeGreaterThan(0);
    expect(result.current.items[0]).toMatchObject({
      id: expect.any(Number),
      title: expect.any(String),
      genres: ['drama']
    });
  });

  it('hasMore 상태가 올바르게 설정된다', async () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 첫 번째 페이지는 보통 hasMore가 true
    expect(result.current.hasMore).toBe(true);
  });

  it('장르 변경 시 새로운 데이터를 로드한다', async () => {
    const { result, rerender } = renderHook(
      ({ genre }: { genre: 'romance' | 'drama' }) => useRankingDataQuery({ genre }),
      { 
        wrapper: createWrapper(),
        initialProps: { genre: 'romance' as 'romance' | 'drama' }
      }
    );

    // 로맨스 데이터 로드 완료 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const romanceItems = result.current.items;
    expect(romanceItems[0].genres).toContain('romance');

    // 드라마로 장르 변경
    rerender({ genre: 'drama' });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const dramaItems = result.current.items;
    expect(dramaItems[0].genres).toContain('drama');
    expect(dramaItems).not.toEqual(romanceItems);
  });

  it('loadMoreData 함수로 다음 페이지를 로드할 수 있다', async () => {
    // 페이지 2 요청에 지연 추가
    server.use(
      http.get('/api/comics/romance', async ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        
        if (page === '2') {
          // 2페이지 요청시 500ms 지연
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return HttpResponse.json({
          hasNext: page === '1',
          count: 100,
          data: Array.from({ length: 20 }, (_, i) => ({
            id: parseInt(page || '1') * 1000 + i,
            title: `작품 ${parseInt(page || '1') * 20 + i}`,
            genres: ['romance'],
            artists: [{ name: '작가', role: 'writer', id: 'artist1' }],
            schedule: { periods: ['MON'] },
            freedEpisodeSize: 3,
            contentsState: 'scheduled',
            print: false,
            currentRank: i + 1,
            previousRank: i + 1,
            updatedAt: 1640000000000,
            thumbnailSrc: 'test.jpg'
          }))
        });
      })
    );

    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    // 첫 번째 페이지 로드 완료 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const initialItemCount = result.current.items.length;
    expect(result.current.hasMore).toBe(true);
    expect(initialItemCount).toBeGreaterThan(0);

    // 다음 페이지 로드 시작
    result.current.loadMoreData();

    // 로딩 상태 확인 (지연 때문에 잡을 수 있어야 함)
    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(true);
    }, { timeout: 100 });

    // 로딩 완료 대기
    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    }, { timeout: 1000 });

    // 아이템 수가 증가했는지 확인
    expect(result.current.items.length).toBeGreaterThan(initialItemCount);
  });

  it('데이터 구조와 무결성을 올바르게 처리한다', async () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    const { items, hasMore, error } = result.current;

    // 데이터 타입 검증
    expect(Array.isArray(items)).toBe(true);
    expect(typeof hasMore).toBe('boolean');
    expect(typeof result.current.isLoading).toBe('boolean');
    expect(typeof result.current.isLoadingMore).toBe('boolean');

    // 각 아이템의 필수 속성 확인
    if (items.length > 0) {
      const firstItem = items[0];
      expect(firstItem).toHaveProperty('id');
      expect(firstItem).toHaveProperty('title');
      expect(firstItem).toHaveProperty('genres');
      expect(firstItem).toHaveProperty('artists');
      expect(firstItem).toHaveProperty('currentRank');
      
      // 장르가 올바른지 확인
      expect(firstItem.genres).toContain('romance');
      
      // ID가 숫자인지 확인
      expect(typeof firstItem.id).toBe('number');
      
      // 제목이 문자열인지 확인
      expect(typeof firstItem.title).toBe('string');
      expect(firstItem.title.length).toBeGreaterThan(0);
    }

    // 함수들이 정의되어 있는지 확인
    expect(typeof result.current.loadMoreData).toBe('function');
    expect(typeof result.current.refreshData).toBe('function');
    expect(typeof result.current.retryLoadMore).toBe('function');
  });

  it('refreshData 함수로 데이터를 새로고침할 수 있다', async () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    // 초기 데이터 로드 완료 대기
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    // 새로고침 실행
    result.current.refreshData();

    // 리프레시 상태 확인
    await waitFor(() => {
      expect(result.current.isRefetching).toBe(false);
    });

    expect(result.current.error).toBe(null);
  });

  it('enabled=false 설정 시 쿼리를 실행하지 않는다', () => {
    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance', enabled: false }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(false);
    expect(result.current.items).toEqual([]);
    expect(result.current.isFetching).toBe(false);
  });

  it('중복 아이템이 제거된다 (dedupeById)', async () => {
    // 중복 아이템이 포함된 응답 모킹
    server.use(
      http.get('/api/comics/romance', ({ request }) => {
        const url = new URL(request.url);
        const page = url.searchParams.get('page');
        
        if (page === '1') {
          return HttpResponse.json({
            hasNext: true,
            count: 100,
            data: [
              { id: 1, title: '작품1', genres: ['romance'] },
              { id: 2, title: '작품2', genres: ['romance'] }
            ]
          });
        } else if (page === '2') {
          return HttpResponse.json({
            hasNext: false,
            count: 100,
            data: [
              { id: 2, title: '작품2', genres: ['romance'] }, // 중복
              { id: 3, title: '작품3', genres: ['romance'] }
            ]
          });
        }
      })
    );

    const { result } = renderHook(
      () => useRankingDataQuery({ genre: 'romance' }),
      { wrapper: createWrapper() }
    );

    // 첫 번째 페이지 로드
    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.items).toHaveLength(2);

    // 두 번째 페이지 로드
    result.current.loadMoreData();

    await waitFor(() => {
      expect(result.current.isLoadingMore).toBe(false);
    });

    // 중복 제거되어 3개만 있어야 함 (id: 1, 2, 3)
    expect(result.current.items).toHaveLength(3);
    const ids = result.current.items.map(item => item.id);
    expect(ids).toEqual([1, 2, 3]);
  });
});
