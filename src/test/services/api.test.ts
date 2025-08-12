import { describe, it, expect } from 'vitest';
import { fetchGenreRanking, ApiError } from '@/services/api';
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

describe('API 서비스', () => {
  describe('fetchGenreRanking', () => {
    it('로맨스 장르 데이터를 성공적으로 가져온다', async () => {
      const result = await fetchGenreRanking('romance', 1);

      expect(result).toBeDefined();
      expect(result.hasNext).toBe(true);
      expect(result.count).toBe(100);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data[0]).toMatchObject({
        id: 5310249108766720,
        title: '아가씨와 우렁총각',
        genres: ['romance']
      });
    });

    it('드라마 장르 데이터를 성공적으로 가져온다', async () => {
      const result = await fetchGenreRanking('drama', 1);

      expect(result).toBeDefined();
      expect(result.hasNext).toBe(true);
      expect(result.count).toBe(100);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data[0]).toMatchObject({
        id: 5551016703033344,
        title: '백억년을 자는 남자',
        genres: ['drama']
      });
    });

    it('hasNext 값이 데이터에 따라 동적으로 설정된다', async () => {
      // 첫 번째 페이지는 항상 hasNext: true일 것으로 예상
      const page1 = await fetchGenreRanking('romance', 1);
      expect(page1.hasNext).toBe(true);

      // 동적으로 마지막 페이지를 찾아서 테스트
      let currentPage = 1;
      let response = page1;
      
      // hasNext가 false가 될 때까지 페이지를 순회
      while (response.hasNext && currentPage < 10) { // 무한루프 방지를 위한 상한선
        currentPage++;
        response = await fetchGenreRanking('romance', currentPage);
      }

      // 마지막 페이지는 hasNext: false
      expect(response.hasNext).toBe(false);
      expect(currentPage).toBeGreaterThan(1); // 최소 2페이지는 있어야 함
    });

    it('서버 에러 시 ApiError를 발생시킨다', async () => {
      // 에러 핸들러 임시 추가
      server.use(
        http.get('/api/comics/romance', () => {
          return HttpResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
          );
        })
      );

      await expect(fetchGenreRanking('romance', 1)).rejects.toThrow(ApiError);
      await expect(fetchGenreRanking('romance', 1)).rejects.toThrow('HTTP error! status: 500');
    });

    it('서버가 error 객체를 반환할 때 ApiError를 발생시킨다', async () => {
      // 에러 응답 핸들러 임시 추가
      server.use(
        http.get('/api/comics/romance', () => {
          return HttpResponse.json({ error: 'Bad Request' });
        })
      );

      await expect(fetchGenreRanking('romance', 1)).rejects.toThrow(ApiError);
      await expect(fetchGenreRanking('romance', 1)).rejects.toThrow('Bad Request');
    });

    it('네트워크 에러 시 적절한 에러 메시지를 반환한다', async () => {
      // 네트워크 에러 시뮬레이션
      server.use(
        http.get('/api/comics/romance', () => {
          return HttpResponse.error();
        })
      );

      await expect(fetchGenreRanking('romance', 1)).rejects.toThrow(ApiError);
      await expect(fetchGenreRanking('romance', 1)).rejects.toThrow(
        '네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
      );
    });

    it('페이지 번호를 page 쿼리 파라미터로 전달한다', async () => {
      let requestUrl = '';

      // 요청 URL 캡처용 핸들러
      server.use(
        http.get('/api/comics/romance', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json({
            hasNext: true,
            count: 100,
            data: []
          });
        })
      );

      await fetchGenreRanking('romance', 3);

      expect(requestUrl).toContain('page=3');
    });

    it('드라마 장르 요청 시 /api/comics/drama API를 호출한다', async () => {
      let requestUrl = '';

      server.use(
        http.get('/api/comics/drama', ({ request }) => {
          requestUrl = request.url;
          return HttpResponse.json({
            hasNext: true,
            count: 100,
            data: []
          });
        })
      );

      await fetchGenreRanking('drama', 2);

      expect(requestUrl).toContain('/api/comics/drama');
      expect(requestUrl).toContain('page=2');
    });

    it('Content-Type 헤더를 application/json으로 설정한다', async () => {
      let requestHeaders = new Headers();

      server.use(
        http.get('/api/comics/romance', ({ request }) => {
          requestHeaders = request.headers;
          return HttpResponse.json({
            hasNext: true,
            count: 100,
            data: []
          });
        })
      );

      await fetchGenreRanking('romance', 1);

      expect(requestHeaders.get('Content-Type')).toBe('application/json');
    });
  });
});
