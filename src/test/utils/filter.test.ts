import { describe, it, expect } from 'vitest';
import { 
  getFilterLabel, 
  getGenreLabel, 
  getInitialFilterState,
  getInitialGenreState,
  filterComicItems 
} from '@/utils/filter';
import { ComicRankItem, FilterState } from '@/types/ranking';

describe('filter 유틸리티 함수', () => {
  describe('getFilterLabel', () => {
    it('필터 타입에 따라 해당하는 한국어 라벨을 반환한다', () => {
      expect(getFilterLabel('ongoing')).toBe('연재 중');
      expect(getFilterLabel('completed')).toBe('완결');
      expect(getFilterLabel('freeEpisodes')).toBe('무료회차 3개 ↑');
    });
  });

  describe('getGenreLabel', () => {
    it('장르 타입에 따라 해당하는 한국어 라벨을 반환한다', () => {
      expect(getGenreLabel('romance')).toBe('로맨스');
      expect(getGenreLabel('drama')).toBe('드라마');
    });
  });

  describe('getInitialFilterState', () => {
    it('초기 필터 상태를 모두 false로 반환한다', () => {
      const initialState = getInitialFilterState();
      expect(initialState).toEqual({
        ongoing: false,
        completed: false,
        freeEpisodes: false
      });
    });
  });

  describe('getInitialGenreState', () => {
    it('초기 장르 상태를 romance로 반환한다', () => {
      const initialState = getInitialGenreState();
      expect(initialState).toEqual({
        selectedGenre: 'romance'
      });
    });
  });

  describe('filterComicItems', () => {
    const mockItems: ComicRankItem[] = [
      {
        id: 1,
        alias: 'ongoing-free',
        title: '연재중 무료작품',
        artists: [{ name: '작가1', role: 'writer', id: 'artist1' }],
        schedule: { periods: ['MON'] },
        genres: ['romance'],
        freedEpisodeSize: 5,
        contentsState: 'scheduled',
        print: false,
        currentRank: 1,
        previousRank: 1,
        updatedAt: 1640000000000,
        thumbnailSrc: 'test1.jpg'
      },
      {
        id: 2,
        alias: 'completed-paid',
        title: '완결 유료작품',
        artists: [{ name: '작가2', role: 'writer', id: 'artist2' }],
        schedule: { periods: [] },
        genres: ['romance'],
        freedEpisodeSize: 1,
        contentsState: 'completed',
        print: false,
        currentRank: 2,
        previousRank: 2,
        updatedAt: 1640000000000,
        thumbnailSrc: 'test2.jpg'
      },
      {
        id: 3,
        alias: 'completed-free',
        title: '완결 무료작품',
        artists: [{ name: '작가3', role: 'writer', id: 'artist3' }],
        schedule: { periods: [] },
        genres: ['romance'],
        freedEpisodeSize: 10,
        contentsState: 'completed',
        print: false,
        currentRank: 3,
        previousRank: 3,
        updatedAt: 1640000000000,
        thumbnailSrc: 'test3.jpg'
      }
    ];

    it('연재중 필터 활성화 시 scheduled 상태 작품만 반환한다', () => {
      const filters: FilterState = {
        ongoing: true,
        completed: false,
        freeEpisodes: false
      };

      const result = filterComicItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].contentsState).toBe('scheduled');
      expect(result[0].title).toBe('연재중 무료작품');
    });

    it('완결 필터 활성화 시 completed 상태 작품만 반환한다', () => {
      const filters: FilterState = {
        ongoing: false,
        completed: true,
        freeEpisodes: false
      };

      const result = filterComicItems(mockItems, filters);
      expect(result).toHaveLength(2);
      result.forEach(item => {
        expect(item.contentsState).toBe('completed');
      });
    });

    it('무료회차 필터 활성화 시 3화 이상 무료인 작품만 반환한다', () => {
      const filters: FilterState = {
        ongoing: false,
        completed: false,
        freeEpisodes: true
      };

      const result = filterComicItems(mockItems, filters);
      expect(result).toHaveLength(2);
      result.forEach(item => {
        expect(item.freedEpisodeSize).toBeGreaterThanOrEqual(3);
      });
    });

    it('여러 필터를 동시에 적용할 수 있다', () => {
      const filters: FilterState = {
        ongoing: false,
        completed: true,
        freeEpisodes: true
      };

      const result = filterComicItems(mockItems, filters);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('완결 무료작품');
      expect(result[0].contentsState).toBe('completed');
      expect(result[0].freedEpisodeSize).toBeGreaterThanOrEqual(3);
    });

    it('모든 필터가 false일 때는 모든 아이템을 반환한다', () => {
      const filters: FilterState = {
        ongoing: false,
        completed: false,
        freeEpisodes: false
      };

      const result = filterComicItems(mockItems, filters);
      expect(result).toHaveLength(3);
      expect(result).toEqual(mockItems);
    });

    it('빈 배열을 전달하면 빈 배열을 반환한다', () => {
      const filters: FilterState = {
        ongoing: true,
        completed: false,
        freeEpisodes: false
      };

      const result = filterComicItems([], filters);
      expect(result).toHaveLength(0);
      expect(result).toEqual([]);
    });
  });
});
