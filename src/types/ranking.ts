// 연재 요일
export type Period = "MON" | "TUE" | "WED" | "THU" | "FRI" | "SAT" | "SUN";

// 작가 역할
export type ArtistRole =
  | "writer"
  | "painter"
  | "scripter"
  | "original"
  | "publisher"
  | "label";

// 랭킹 상태
export type RankingStatus = "up" | "down" | "same";

// 필터 타입
export type FilterType = "ongoing" | "completed" | "freeEpisodes";

// 장르 타입
export type GenreType = "romance" | "drama";

export interface Artist {
  name: string; // 작가 필명
  role: ArtistRole; // 작가 롤
  id: string; // 작가 id
  email?: string | null; // 작가 이메일 (drama 작품에만 존재)
}

export interface ComicRankItem {
  id: number; // 작품 id
  alias: string; // 작품 형칭
  title: string; // 작품 타이틀
  artists: Artist[]; // 작가 정보
  schedule: {
    periods: Period[]; // 연재 요일
    anchor: number; // 연재 시간 앵커
  };
  genres: string[]; // 작품 장르
  badges: string; // 작품 뱃지 정보
  freedEpisodeSize: number; // 무료회차 수
  contentsState: "scheduled" | "completed"; // 연재, 완결 값
  currentRank: number; // 현재 랭킹
  previousRank: number; // 이전 랭킹
  updatedAt: number; // 업데이트 일자
  isPrint: boolean; // 단행본 여부
  thumbnailSrc: string; // 작품 썸네일 url
}

export interface ComicRankApiSuccessResponse {
  hasNext: boolean; // 다음 page 존재 여부
  count: number; // 아이템 전체 카운트
  data: ComicRankItem[]; // 아이템 리스트
}

export interface ComicRankApiFailResponse {
  error: string; // 에러 메시지
}

// API 응답 타입
export type ComicRankApiResponse = ComicRankApiSuccessResponse | ComicRankApiFailResponse;

// 필터 상태 인터페이스
export interface FilterState {
  ongoing: boolean;
  completed: boolean;
  freeEpisodes: boolean;
}

// 장르 상태 인터페이스
export interface GenreState {
  selectedGenre: GenreType;
}

// 랭킹 상태 유틸리티 함수를 위한 타입
export interface RankingStatusInfo {
  status: RankingStatus;
  diff: number;
}
