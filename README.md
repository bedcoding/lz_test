# 웹툰 랭킹 조회

> **Live Demo**: [https://lz-test-one.vercel.app/](https://lz-test-one.vercel.app/)


## 🚀 주요 기능

- **랭킹 리스트**: 로맨스·드라마 장르 웹툰의 실시간 랭킹 확인
- **무한 스크롤**: 스크롤을 통한 자동 페이지 로딩
- **필터링**: 연재중/완결/무료회차 조건으로 작품 필터링
- **반응형 디자인**: Desktop, Tablet, Mobile 환경 지원
- **랭킹 상태 표시**: 순위 상승/하락/변동없음 시각적 표현

## 🛠️ 기술 스택

### Core Framework
- **Next.js 15.4.6**: React 기반 풀스택 프레임워크
  - *선택 이유*: SSR/SSG 지원으로 SEO 최적화, API Routes로 백엔드 통합, 파일 기반 라우팅의 직관성
- **React 19.1.0**: 컴포넌트 기반 UI 라이브러리
  - *선택 이유*: 컴포넌트 재사용성, 가상 DOM을 통한 효율적 렌더링, 풍부한 생태계
- **TypeScript 5**: 정적 타입 검사
  - *선택 이유*: 런타임 에러 사전 방지, 개발 경험 향상, 코드 품질 및 유지보수성 증대

### Styling
- **styled-components 6.1.19**: CSS-in-JS 스타일링 라이브러리
  - *선택 이유*: 컴포넌트와 스타일의 강한 결합, 동적 스타일링, 테마 시스템 구축 용이, SSR 호환

### 개발 도구
- **ESLint 9**: 코드 품질 검사
  - *선택 이유*: 코딩 표준 강제, 잠재적 버그 사전 발견, Next.js 최적화 규칙 포함
- **Vite**: 빌드 도구 (Vitest와 통합)
  - *선택 이유*: 빠른 개발 서버, ES 모듈 기반 최적화, 테스트 환경과 일관성

## 🔍 테스트

포괄적인 테스트 스택으로 코드 품질과 안정성을 보장합니다.

### 테스트 스택
| 도구 | 역할 | 선택 이유 |
|------|------|-----------|
| **Vitest 3.2.4** | 테스트 프레임워크 | Jest 대비 **5-10배 빠른 속도**, TypeScript 네이티브 지원 |
| **React Testing Library** | 컴포넌트 테스트 | **사용자 중심 테스트**, 실제 사용자 경험에 집중 |
| **MSW 2.10.4** | API 모킹 | **네트워크 레벨 모킹**, 실제 API와 동일한 동작 |
| **jsdom 26.1.0** | 브라우저 환경 | React 컴포넌트 렌더링을 위한 DOM API 제공 |

### 테스트 명령어
```bash
npm test              # 기본 테스트 실행 (watch 모드)
npm run test:run      # 단일 실행 (CI/CD 환경)
npm run test:coverage # 커버리지 리포트 생성
npm run test:ui       # 브라우저에서 시각적 테스트 UI
```

### 주요 테스트 영역
- **컴포넌트**: 렌더링, 사용자 인터랙션, 접근성 검증
- **커스텀 훅**: 상태 관리, 필터링 로직 테스트
- **API 서비스**: HTTP 요청/응답, 에러 처리 검증
- **유틸리티**: 순수 함수 로직 단위 테스트

## 📁 프로젝트 구조

```
lezhin-ranking/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/comics/         # API 라우트 (romance, drama)
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/
│   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── SkeletonItem.tsx
│   │   ├── ranking/           # 랭킹 관련 컴포넌트
│   │   │   ├── FilterPanel.tsx
│   │   │   ├── GenreFilter.tsx
│   │   │   ├── RankingFilter.tsx
│   │   │   ├── RankingItem.tsx
│   │   │   ├── RankingList.tsx
│   │   │   └── RankingStatus.tsx
│   │   └── layout/            # 레이아웃 컴포넌트
│   │       ├── Container.tsx
│   │       ├── ThemeProvider.tsx
│   │       └── StyledComponentsRegistry.tsx
│   ├── hooks/                 # Custom Hooks
│   │   ├── useFilter.ts
│   │   ├── useGenre.ts
│   │   ├── useInfiniteScroll.ts
│   │   └── useRankingData.ts
│   ├── services/              # API 서비스
│   │   └── api.ts
│   ├── types/                 # TypeScript 타입 정의
│   │   ├── ranking.ts
│   │   └── styled.d.ts
│   ├── styles/                # 스타일 관련
│   │   ├── GlobalStyle.ts
│   │   └── theme.ts
│   ├── test/                  # 테스트 파일
│   │   ├── components/        # 컴포넌트 테스트
│   │   │   └── ranking/
│   │   │       ├── FilterPanel.test.tsx
│   │   │       └── RankingItem.test.tsx
│   │   ├── hooks/             # 커스텀 훅 테스트
│   │   │   └── useFilter.test.ts
│   │   ├── mocks/             # MSW 모킹 설정
│   │   │   ├── handlers.ts
│   │   │   └── server.ts
│   │   ├── services/          # API 서비스 테스트
│   │   │   └── api.test.ts
│   │   ├── utils/             # 유틸리티 함수 테스트
│   │   │   ├── filter.test.ts
│   │   │   └── ranking.test.ts
│   │   └── setup.ts           # 테스트 환경 설정
│   └── utils/                 # 유틸리티 함수
│       ├── filter.ts
│       └── ranking.ts
├── data/                      # Mock 데이터
│   ├── romance/               # 로맨스 장르 데이터
│   │   ├── page_1.json
│   │   └── ...
│   └── drama/                 # 드라마 장르 데이터
│       ├── page_1.json
│       └── ...
├── vitest.config.ts           # Vitest 설정
└── public/                    # 정적 파일
```

## 🚀 시작하기

### 1. 설치

```bash
# 의존성 설치
npm install
```

### 2. 개발 서버 실행

```bash
# 개발 서버 시작 (http://localhost:3000)
npm run dev
```

### 3. 빌드 및 배포

```bash
# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start
```

## 📋 API 명세

### GET /api/comics/{genre}

장르별 웹툰 랭킹 데이터를 가져옵니다.

**Path Parameters:**
- `genre`: 장르명 (`romance` | `drama`)

**Query Parameters:**
- `page`: 페이지 번호 (1 이상의 자연수)

**Response:**
```typescript
{
  hasNext: boolean;
  count: number;
  data: ComicRankItem[];
}
```

**ComicRankItem:**
```typescript
{
  id: number;
  alias: string;
  title: string;
  artists: Artist[];
  schedule: {
    periods: Period[];
    anchor: number;
  };
  genres: string[];
  badges: string;
  freedEpisodeSize: number;
  contentsState: "scheduled" | "completed";
  currentRank: number;
  previousRank: number;
  updatedAt: number;
  isPrint: boolean;
  thumbnailSrc: string;
}
```

## 🎨 컴포넌트 설계

### 재사용성 고려사항

1. **장르별 확장 가능성**
   - `useRankingData` 훅에서 장르를 파라미터로 받을 수 있도록 설계
   - API 엔드포인트 구조 확장 가능

2. **컴포넌트 합성**
   - 각 컴포넌트는 단일 책임 원칙 준수
   - Props를 통한 유연한 설정 가능

3. **타입 안정성**
   - 모든 컴포넌트와 함수에 TypeScript 타입 적용
   - API 응답 타입 엄격 관리

## 🛡️ 접근성 (Accessibility)

- **키보드 네비게이션**: Tab 키를 통한 포커스 이동
- **스크린 리더 지원**: ARIA 레이블과 의미론적 HTML
- **색상 대비**: WCAG 가이드라인 준수
- **스킵 링크**: 본문으로 바로가기 기능

## 📱 반응형 디자인

- **Desktop** (1024px+): 최적화된 레이아웃
- **Tablet** (768px-1023px): 적응형 그리드
- **Mobile** (~767px): 모바일 최적화 UI

## 🎯 핵심 기능 구현

### 1. 무한 스크롤
- **Intersection Observer API** 활용
- 사용자가 스크롤 하단 도달 시 자동 로딩
- 로딩 상태 관리 및 에러 처리

### 2. 필터링 시스템
- **연재중/완결**: 상호 배타적 필터링
- **무료회차 3개 이상**: 독립적 필터링
- 실시간 필터 적용 및 상태 관리

### 3. 랭킹 상태 표시
- **상승(▲)**: 이전 순위보다 상승
- **하락(▼)**: 이전 순위보다 하락
- **변동없음(-)**: 순위 변화 없음
- 순위 변동폭 숫자 표시

## 📈 성능 최적화

- **React.memo**: 주요 컴포넌트 메모이제이션으로 불필요한 리렌더링 방지
- **useMemo/useCallback**: 커스텀 훅에서 연산 결과 캐싱 및 함수 최적화
- **next/image**: 자동 WebP/AVIF 변환, 레이지 로딩, 반응형 최적화
- **next/font**: Google Fonts 최적화로 폰트 로딩 성능 개선
- **Intersection Observer**: 무한 스크롤을 위한 효율적인 뷰포트 감지
- **번들 최적화**: 99.7KB 공유 청크로 최적화된 번들 크기
