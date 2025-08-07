import { RankingStatus, RankingStatusInfo, Period } from '@/types/ranking';

/**
 * 현재 랭킹과 이전 랭킹을 비교하여 상태를 반환
 * @param currentRank 현재 랭킹
 * @param previousRank 이전 랭킹
 * @returns RankingStatusInfo
 */
export function getRankingStatus(currentRank: number, previousRank: number): RankingStatusInfo {
  if (currentRank < previousRank) {
    return {
      status: 'up' as RankingStatus,
      diff: previousRank - currentRank
    };
  }
  
  if (currentRank > previousRank) {
    return {
      status: 'down' as RankingStatus,
      diff: currentRank - previousRank
    };
  }
  
  return {
    status: 'same' as RankingStatus,
    diff: 0
  };
}

/**
 * 랭킹 상태에 따른 아이콘 반환
 * @param status RankingStatus
 * @returns string
 */
export function getRankingIcon(status: RankingStatus): string {
  switch (status) {
    case 'up':
      return '▲';
    case 'down':
      return '▼';
    case 'same':
    default:
      return '-';
  }
}

/**
 * 연재 요일을 한글로 변환
 * @param period Period
 * @returns string
 */
export function getPeriodInKorean(period: Period): string {
  const periodMap: Record<Period, string> = {
    MON: '월요일',
    TUE: '화요일',
    WED: '수요일',
    THU: '목요일',
    FRI: '금요일',
    SAT: '토요일',
    SUN: '일요일'
  };
  
  return periodMap[period];
}

/**
 * 연재 스케줄 텍스트 생성
 * @param periods Period[]
 * @returns string
 */
export function getScheduleText(periods: Period[]): string {
  if (periods.length === 0) {
    return '';
  }
  
  if (periods.length === 1) {
    return `매주 ${getPeriodInKorean(periods[0])} 연재`;
  }
  
  const koreanPeriods = periods.map(getPeriodInKorean);
  return `매주 ${koreanPeriods.join(', ')} 연재`;
}

/**
 * 작품 상태 텍스트 반환
 * @param contentsState 'scheduled' | 'completed'
 * @returns string
 */
export function getContentsStateText(contentsState: 'scheduled' | 'completed'): string {
  return contentsState === 'scheduled' ? '연재중' : '완결';
}

/**
 * 무료 회차 텍스트 생성
 * @param freedEpisodeSize number
 * @returns string
 */
export function getFreeEpisodeText(freedEpisodeSize: number): string {
  return `${freedEpisodeSize}화 무료`;
}
