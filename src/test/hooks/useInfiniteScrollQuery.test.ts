import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useInfiniteScrollQuery } from '@/hooks/useInfiniteScrollQuery';

// Intersection Observer 모킹
const mockIntersectionObserver = vi.fn((callback: IntersectionObserverCallback) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);

describe('useInfiniteScrollQuery TanStack Query 최적화 무한스크롤 훅', () => {
  let mockOnLoadMore: ReturnType<typeof vi.fn>;

  // 헬퍼 함수: 타입 안전한 intersection 시뮬레이션
  const simulateIntersection = (
    callback: IntersectionObserverCallback, 
    isIntersecting: boolean
  ) => {
    const mockEntries = [{ isIntersecting }] as IntersectionObserverEntry[];
    const mockObserver = {} as IntersectionObserver;
    callback(mockEntries, mockObserver);
  };

  beforeEach(() => {
    mockOnLoadMore = vi.fn();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loadMoreTriggerRef를 반환한다', () => {
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    expect(result.current.loadMoreTriggerRef).toBeDefined();
    expect(typeof result.current.loadMoreTriggerRef).toBe('function');
  });

  it('IntersectionObserver가 지원되지 않는 환경에서는 작동하지 않는다', () => {
    // IntersectionObserver 비활성화
    vi.stubGlobal('IntersectionObserver', undefined);

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    expect(mockIntersectionObserver).not.toHaveBeenCalled();

    // 다시 복원
    vi.stubGlobal('IntersectionObserver', mockIntersectionObserver);
  });

  it('노드가 null이면 observer를 생성하지 않는다', () => {
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    result.current.loadMoreTriggerRef(null);

    expect(mockIntersectionObserver).not.toHaveBeenCalled();
  });

  it('유효한 노드가 전달되면 IntersectionObserver를 생성한다', () => {
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.1,
        rootMargin: '100px'
      }
    );
  });

  it('커스텀 threshold와 rootMargin을 설정할 수 있다', () => {
    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        threshold: 0.5,
        rootMargin: '200px',
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    expect(mockIntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      {
        threshold: 0.5,
        rootMargin: '200px'
      }
    );
  });

  it('isLoading이 true일 때는 onLoadMore를 호출하지 않는다', () => {
    // IntersectionObserver 콜백 캡처용
    let intersectionCallback: IntersectionObserverCallback;
    
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: true, // 로딩 중
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    // intersection 시뮬레이션 (엘리먼트가 보임)
    simulateIntersection(intersectionCallback!, true);

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('hasMore가 false일 때는 onLoadMore를 호출하지 않는다', () => {
    let intersectionCallback: IntersectionObserverCallback;
    
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: false, // 더 이상 데이터 없음
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    simulateIntersection(intersectionCallback!, true);

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('isFetching이 true일 때는 onLoadMore를 호출하지 않는다', () => {
    let intersectionCallback: IntersectionObserverCallback;
    
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        isFetching: true, // TanStack Query fetching 중
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    simulateIntersection(intersectionCallback!, true);

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('모든 조건이 만족될 때 onLoadMore를 호출한다', async () => {
    let intersectionCallback: IntersectionObserverCallback;
    
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
        isFetching: false,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    // intersection 시뮬레이션
    simulateIntersection(intersectionCallback!, true);

    // Promise.resolve를 기다려야 함
    await new Promise(resolve => setTimeout(resolve, 0));

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1);
  });

  it('엘리먼트가 intersection되지 않으면 onLoadMore를 호출하지 않는다', () => {
    let intersectionCallback: IntersectionObserverCallback;
    
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    // intersection되지 않음
    simulateIntersection(intersectionCallback!, false);

    expect(mockOnLoadMore).not.toHaveBeenCalled();
  });

  it('새로운 노드로 변경할 때 이전 노드를 unobserve한다', () => {
    const mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    mockIntersectionObserver.mockReturnValue(mockObserver);

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement1 = document.createElement('div');
    const mockElement2 = document.createElement('div');

    // 첫 번째 노드 설정
    result.current.loadMoreTriggerRef(mockElement1);
    expect(mockObserver.observe).toHaveBeenCalledWith(mockElement1);

    // 두 번째 노드로 변경
    result.current.loadMoreTriggerRef(mockElement2);
    expect(mockObserver.unobserve).toHaveBeenCalledWith(mockElement1);
    expect(mockObserver.observe).toHaveBeenCalledWith(mockElement2);
  });

  it('언마운트 시 observer를 정리한다', () => {
    const mockObserver = {
      observe: vi.fn(),
      unobserve: vi.fn(),
      disconnect: vi.fn(),
    };

    mockIntersectionObserver.mockReturnValue(mockObserver);

    const { result, unmount } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: mockOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    unmount();

    expect(mockObserver.disconnect).toHaveBeenCalled();
  });

  it('중복 호출을 방지한다 (pendingRef)', async () => {
    let intersectionCallback: IntersectionObserverCallback;
    
    mockIntersectionObserver.mockImplementation((callback: IntersectionObserverCallback) => {
      intersectionCallback = callback;
      return {
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
      };
    });

    // 느린 비동기 함수로 모킹
    const slowOnLoadMore = vi.fn(() => 
      new Promise(resolve => setTimeout(resolve, 100))
    );

    const { result } = renderHook(() =>
      useInfiniteScrollQuery({
        hasMore: true,
        isLoading: false,
        onLoadMore: slowOnLoadMore,
      })
    );

    const mockElement = document.createElement('div');
    result.current.loadMoreTriggerRef(mockElement);

    // 빠르게 여러 번 intersection 트리거
    simulateIntersection(intersectionCallback!, true);
    simulateIntersection(intersectionCallback!, true);
    simulateIntersection(intersectionCallback!, true);

    // 첫 번째 호출이 완료될 때까지 대기
    await new Promise(resolve => setTimeout(resolve, 150));

    // 중복 호출 방지로 1번만 호출되어야 함
    expect(slowOnLoadMore).toHaveBeenCalledTimes(1);
  });
});
