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
}

// JSON 데이터의 작가 타입 (email 필드 포함)
export interface RawArtist extends Artist {
  email?: string | null; // JSON 데이터에만 존재
}

// 공통 웹툰 데이터 필드
interface BaseComicFields {
  id: number;
  alias: string;
  title: string;
  genres: string[];
  freedEpisodeSize: number;
  contentsState: "scheduled" | "completed";
  currentRank: number;
  previousRank: number;
  updatedAt: number;
  thumbnailSrc: string | null;
}

// API Interface (기업 명세서)
export interface ComicRankItem extends BaseComicFields {
  artists: Artist[]; // API용 작가 정보
  schedule: {
    periods: Period[]; // 연재 요일
  };
  print: boolean; // API 표준 필드명
}

// JSON 데이터 타입 (변환 전)
export interface RawComicItem extends BaseComicFields {
  artists: RawArtist[]; // JSON용 작가 정보 (email 포함)
  schedule: {
    periods: Period[];
    anchor?: number; // JSON에만 존재
  };
  badges?: string; // JSON에만 존재
  isPrint: boolean; // JSON 필드명
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