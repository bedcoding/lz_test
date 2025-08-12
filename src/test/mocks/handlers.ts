import { http, HttpResponse } from 'msw';
import { ComicRankApiSuccessResponse } from '@/types/ranking';

/**
 * 실제 JSON 파일에서 데이터를 로드하는 함수
 * 파일이 존재하지 않으면 null 반환
 */
async function loadPageData(genre: 'romance' | 'drama', page: number): Promise<ComicRankApiSuccessResponse | null> {
  try {
    // 동적 import를 사용해서 실제 JSON 파일 로드
    const data = await import(`../../../data/${genre}/page_${page}.json`);
    return data.default as ComicRankApiSuccessResponse;
  } catch (error) {
    // 파일이 존재하지 않으면 null 반환
    return null;
  }
}

/**
 * 실제 JSON 파일 기반 Mock 핸들러
 * 
 * 하드코딩된 페이지 제한이나 Mock 데이터 없이,
 * 실제 data/ 폴더의 JSON 파일을 직접 읽어서 사용합니다.
 * 이를 통해 실제 데이터와 100% 일치하는 테스트 환경을 제공합니다.
 */

export const handlers = [
  // 로맨스 랭킹 API
  http.get('/api/comics/romance', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    
    // 실제 JSON 파일에서 데이터 로드
    const pageData = await loadPageData('romance', page);
    
    if (!pageData) {
      // 파일이 존재하지 않으면 404 반환
      return HttpResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // 실제 JSON 파일의 데이터를 그대로 반환 (hasNext 포함)
    return HttpResponse.json(pageData);
  }),

  // 드라마 랭킹 API  
  http.get('/api/comics/drama', async ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    
    // 실제 JSON 파일에서 데이터 로드
    const pageData = await loadPageData('drama', page);
    
    if (!pageData) {
      // 파일이 존재하지 않으면 404 반환
      return HttpResponse.json(
        { error: 'Page not found' },
        { status: 404 }
      );
    }
    
    // 실제 JSON 파일의 데이터를 그대로 반환 (hasNext 포함)
    return HttpResponse.json(pageData);
  }),

  // 에러 시뮬레이션용
  http.get('/api/comics/error', () => {
    return HttpResponse.json(
      { error: 'Server Error' },
      { status: 500 }
    );
  })
];
