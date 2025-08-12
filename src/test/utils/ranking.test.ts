import { describe, it, expect } from 'vitest';
import { 
  getRankingStatus, 
  getRankingIcon, 
  getScheduleText,
  getContentsStateText,
  getFreeEpisodeText
} from '@/utils/ranking';

describe('ranking 유틸리티 함수', () => {
  describe('getRankingStatus', () => {
    it('순위가 상승했을 때 up 상태와 차이값을 반환한다', () => {
      const result1 = getRankingStatus(5, 8);
      expect(result1.status).toBe('up');
      expect(result1.diff).toBe(3);

      const result2 = getRankingStatus(1, 10);
      expect(result2.status).toBe('up');
      expect(result2.diff).toBe(9);
    });

    it('순위가 하락했을 때 down 상태와 차이값을 반환한다', () => {
      const result1 = getRankingStatus(8, 5);
      expect(result1.status).toBe('down');
      expect(result1.diff).toBe(3);

      const result2 = getRankingStatus(10, 1);
      expect(result2.status).toBe('down');
      expect(result2.diff).toBe(9);
    });

    it('순위가 동일할 때 same 상태와 0 차이값을 반환한다', () => {
      const result1 = getRankingStatus(5, 5);
      expect(result1.status).toBe('same');
      expect(result1.diff).toBe(0);

      const result2 = getRankingStatus(1, 1);
      expect(result2.status).toBe('same');
      expect(result2.diff).toBe(0);
    });
  });

  describe('getRankingIcon', () => {
    it('상승 상태일 때 ▲ 아이콘을 반환한다', () => {
      expect(getRankingIcon('up')).toBe('▲');
    });

    it('하락 상태일 때 ▼ 아이콘을 반환한다', () => {
      expect(getRankingIcon('down')).toBe('▼');
    });

    it('동일 상태일 때 - 아이콘을 반환한다', () => {
      expect(getRankingIcon('same')).toBe('-');
    });
  });

  describe('getContentsStateText', () => {
    it('scheduled 상태를 "연재중"으로 변환한다', () => {
      expect(getContentsStateText('scheduled')).toBe('연재중');
    });

    it('completed 상태를 "완결"로 변환한다', () => {
      expect(getContentsStateText('completed')).toBe('완결');
    });
  });

  describe('getFreeEpisodeText', () => {
    it('무료 회차를 "N화 무료" 형식으로 생성한다', () => {
      expect(getFreeEpisodeText(5)).toBe('5화 무료');
      expect(getFreeEpisodeText(0)).toBe('0화 무료');
      expect(getFreeEpisodeText(10)).toBe('10화 무료');
    });
  });

  describe('getScheduleText', () => {
    it('단일 요일을 "매주 N요일 연재" 형식으로 변환한다', () => {
      expect(getScheduleText(['MON'])).toBe('매주 월요일 연재');
      expect(getScheduleText(['TUE'])).toBe('매주 화요일 연재');
      expect(getScheduleText(['WED'])).toBe('매주 수요일 연재');
      expect(getScheduleText(['THU'])).toBe('매주 목요일 연재');
      expect(getScheduleText(['FRI'])).toBe('매주 금요일 연재');
      expect(getScheduleText(['SAT'])).toBe('매주 토요일 연재');
      expect(getScheduleText(['SUN'])).toBe('매주 일요일 연재');
    });

    it('여러 요일을 조합하여 반환한다', () => {
      expect(getScheduleText(['MON', 'WED', 'FRI'])).toBe('매주 월요일, 수요일, 금요일 연재');
      expect(getScheduleText(['TUE', 'THU'])).toBe('매주 화요일, 목요일 연재');
    });

    it('빈 배열일 때 빈 문자열을 반환한다', () => {
      expect(getScheduleText([])).toBe('');
    });
  });


});
