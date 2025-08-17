import { ComicRankApiResponse, ComicRankApiSuccessResponse } from '@/types/ranking';

// 환경별 BASE_URL 설정 (서버/클라이언트 구분)
const getBaseUrl = () => {
  if (typeof window === 'undefined') {
    // 서버 환경: 절대 URL 필요
    if (process.env.NODE_ENV === 'production') {
      return process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}`
        : 'https://lz-test-one.vercel.app';
    }
    return 'http://localhost:3000';
  } else {
    // 클라이언트 환경: 상대 경로 가능
    return process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3000';
  }
};

export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 로맨스 장르 랭킹 데이터를 가져오는 함수
 * @param page 페이지 번호 (1 이상의 자연수)
 * @returns Promise<ComicRankApiSuccessResponse>
 */
export async function fetchRomanceRanking(page: number): Promise<ComicRankApiSuccessResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/comics/romance?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data: ComicRankApiResponse = await response.json();

    // 에러 응답인지 확인
    if ('error' in data) {
      throw new ApiError(data.error);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // 네트워크 에러 등
    console.error('API fetch error:', error);
    throw new ApiError('네트워크 오류가 발생했습니다.');
  }
}

/**
 * 장르별 랭킹 데이터를 가져오는 함수
 * @param genre 장르명 (romance, drama 등)
 * @param page 페이지 번호 (1 이상의 자연수)
 */
export async function fetchGenreRanking(genre: string, page: number): Promise<ComicRankApiSuccessResponse> {
  try {
    const response = await fetch(`${getBaseUrl()}/api/comics/${genre}?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new ApiError(`HTTP error! status: ${response.status}`, response.status);
    }

    const data: ComicRankApiResponse = await response.json();

    if ('error' in data) {
      throw new ApiError(data.error);
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    console.error('API fetch error:', error);
    throw new ApiError('네트워크 오류가 발생했습니다.');
  }
}
