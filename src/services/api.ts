import { ComicRankApiResponse, ComicRankApiSuccessResponse } from '@/types/ranking';

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? ''  // vercel 배포 환경에서는 빈 문자열로 설정
  : 'http://localhost:3000';

// 커스텀 에러 클래스 (기본 Error는 status 코드를 저장할 수 없어서 HTTP 상태별 처리가 불가능함)
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

interface FetchOptions {
  signal?: AbortSignal;      // 요청 취소용
  retry?: number;            // 재시도 횟수
  retryDelayMs?: number;     // 재시도 간격 (ms)
}

// fetch 표준화
async function fetchJson<T>(url: string, options: FetchOptions = {}): Promise<T> {
  const { signal, retry = 0, retryDelayMs = 400 } = options;
  
  // 재시도 루프
  for (let attempt = 0; attempt <= retry; attempt++) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal, // AbortController 지원
      });

      // HTTP 상태 코드 검증
      if (!response.ok) {
        throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
      }

      // 서버가 JSON이 아닌 HTML 에러 페이지 등을 반환하는 경우 방지
      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        throw new ApiError('응답이 JSON 형식이 아닙니다.');
      }

      // 성공 시 JSON 파싱 후 반환
      return await response.json() as T;
    } catch (error: any) {
      // AbortError는 재시도 안함
      if (error?.name === 'AbortError') {
        throw error;
      }
      
      // 마지막 시도였다면 에러 전파
      if (attempt === retry) {
        if (error instanceof ApiError) {
          throw error;
        }
        throw new ApiError(error?.message ?? '네트워크 오류가 발생했습니다.');
      }
      
      // 재시도 (1차: 400ms, 2차: 800ms, 3차: 1600ms 대기 후 재시도)
      await new Promise(resolve => 
        setTimeout(resolve, retryDelayMs * Math.pow(2, attempt))
      );
    }
  }
  
  throw new ApiError('알 수 없는 오류가 발생했습니다.');
}

/**
 * 장르별 랭킹 데이터 표준화 (중복 코드를 fetchJson 헬퍼로 통합함)
 * @param genre 장르명 (romance, drama 등)
 * @param page 페이지 번호 (1 이상의 자연수)
 * @param options 추가 옵션
 *   - signal: 요청 취소용 AbortSignal (뒤늦게 호출된 요청 취소용)
 *   - retry: 재시도 횟수 (기본 1회)
 */
export async function fetchGenreRanking(
  genre: string, 
  page: number, 
  options?: { signal?: AbortSignal; retry?: number }
): Promise<ComicRankApiSuccessResponse> {
  const url = `${BASE_URL}/api/comics/${encodeURIComponent(genre)}?page=${page}`;
  
  // fetchJson 헬퍼 사용으로 모든 공통 로직 처리
  const data = await fetchJson<ComicRankApiResponse>(url, {
    signal: options?.signal,
    retry: options?.retry ?? 1, // 기본 1회 재시도
  });

  // 서버 응답 타입 검증
  if ('error' in data) {
    throw new ApiError(data.error);
  }

  // 성공이면 반환
  return data;
}
