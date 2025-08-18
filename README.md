# 웹툰 랭킹 조회
> **Github**: [https://github.com/bedcoding/lz_test](https://github.com/bedcoding/lz_test)

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

### Data Fetching & State Management
- **TanStack Query**: 서버 상태 관리 라이브러리
  - *선택 이유*: 자동 캐싱, 백그라운드 refetching, 무한 쿼리 내장 지원, 강력한 에러 핸들링, DevTools 지원
  - *주요 기능*: useInfiniteQuery로 무한스크롤 최적화, Query Hydration으로 SSR 데이터 연동

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
│   │   ├── layout/            # 레이아웃 컴포넌트
│   │   │   ├── Container.tsx
│   │   │   ├── ThemeProvider.tsx
│   │   │   └── StyledComponentsRegistry.tsx
│   │   ├── QueryHydration.tsx         # TanStack Query SSR 하이드레이션
│   │   └── RankingPageClientQuery.tsx # TanStack Query 기반 클라이언트 컴포넌트
│   ├── hooks/                 # Custom Hooks
│   │   ├── useFilter.ts               # 필터링 로직
│   │   ├── useGenre.ts                # 장르 상태 관리
│   │   ├── useInfiniteScrollQuery.ts  # TanStack Query 기반 무한스크롤
│   │   └── useRankingDataQuery.ts     # TanStack Query 기반 데이터 훅
│   ├── providers/             # Context Providers
│   │   └── QueryProvider.tsx         # TanStack Query 설정
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

**사용 가능한 엔드포인트:**
- `GET /api/comics/romance?page=1`
- `GET /api/comics/drama?page=1`

**Path Parameters:**
- `genre`: 장르명 (`romance` | `drama`)

**Query Parameters:**
- `page`: 페이지 번호 (1~5, 각 장르당 5페이지 제공)

## 🎨 컴포넌트 설계

### 재사용성 고려사항

1. **장르별 확장 가능성**
   - `useRankingDataQuery` 훅에서 장르를 파라미터로 받을 수 있도록 설계
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
- **Intersection Observer API**와 **TanStack Query** 통합
- 사용자가 스크롤 하단 도달 시 자동 로딩
- 캐싱, 백그라운드 리프레시, 에러 처리 및 재시도 기능

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

### 🎯 구현한 최적화 기법 및 효과
- **React.memo**: 컴포넌트 메모이제이션으로 불필요한 리렌더링 방지
  - 적용: `RankingItem`, `SkeletonItem` 컴포넌트
  - 효과: 무한스크롤 시 기존 100개 아이템이 매번 리렌더링되지 않음

- **useMemo**: 의존성이 변경되지 않으면 이전 계산 결과 재사용
  - 적용: `useFilter`에서 필터링된 아이템 배열 캐싱
  - 효과: 100개 아이템 필터링 연산을 캐싱하여 렌더링 성능 향상

- **useCallback**: 동일한 함수 참조 유지로 자식 리렌더링 방지
  - 적용: `useRankingDataQuery`와 `useInfiniteScrollQuery`에서 API 호출 함수들 최적화
  - 효과: API 호출 함수들의 불필요한 재생성 방지

- **next/image**: 자동 이미지 최적화
  - 적용: 웹툰 썸네일 이미지에 적용 (WebP/AVIF, 레이지 로딩, 반응형)
  - 효과: 썸네일 이미지 자동 WebP 변환으로 용량 50% 감소

- **next/font**: Google Fonts 최적화
  - 적용: Inter 폰트 최적화 로딩
  - 효과: 폰트 로딩 성능 개선

- **Intersection Observer**: 효율적인 뷰포트 감지
  - 적용: `useInfiniteScrollQuery`에서 TanStack Query와 통합된 무한 스크롤 구현
  - 효과: 스크롤 이벤트 대비 성능 향상, 캐싱 및 백그라운드 리프레시와 완벽 연동

- **TanStack Query 캐싱**: 서버 상태 관리 최적화
  - 적용: `useRankingDataQuery`에서 무한 쿼리 캐싱
  - 효과: 5분간 캐시 유지, 백그라운드 리프레시, 중복 요청 방지

### ⚙️ Next.js 자동 최적화
- **코드 스플리팅**: 페이지별 자동 분할
- **트리 쉐이킹**: 사용하지 않는 코드 제거
- **압축 및 Minification**: 자동 번들 압축

---

## 📋 체크리스트

### 🎯 기본 요구사항
- ✅ **Next.js 활용** (React + TypeScript)
- ✅ **styled-components** 사용
- ✅ **반응형 웹** 구현 (Desktop, Mobile)
- ✅ **모던 브라우저** 환경 고려 (Chrome, Safari, Firefox)
- ✅ **로컬 개발 환경** 구성 및 README 작성
- ✅ **컴포넌트 재사용성** 고려
- ✅ **라이브러리 적용 이유** README에 작성

### 🏗️ 구현 스펙
- ✅ **다른 장르 재사용** 가능한 구조 설계 (로맨스 + 드라마)
- ✅ **무한 스크롤** 기능 구현
- ✅ **작품 썸네일** 노출 (`thumbnailSrc`)
- ✅ **작품 타이틀** 노출 (`title`)
- ✅ **작가명** 노출 (`artists` - writer, painter, scripter)
- ✅ **랭킹 상태** 표현 (상승↗️, 하락↘️, 변동없음➖)
- ✅ **무료 회차** 노출 (`freedEpisodeSize`)
- ✅ **완결/연재 여부** 노출 (`contentsState`)
- ✅ **연재 요일** 표시 (매주 X요일 연재)

### 🔍 필터링 기능
- ✅ **연재중 필터** 구현
- ✅ **완결 필터** 구현
- ✅ **무료회차 3개 이상** 필터 구현
- ✅ **필터 중복 설정** 가능
- ✅ **연재중/완결 상호 배타적** 처리

### 🌐 API 구현
- ✅ **GET /api/comics/romance** 구현 (page 1~5)
- ✅ **GET /api/comics/drama** 구현 (추가 구현)
- ✅ **Mock 데이터** 활용
- ✅ **API Interface** 준수

### 🚀 추가 구현사항
- ✅ **다중 장르 지원** (로맨스 + 드라마)
- ✅ **장르 필터** 추가 구현
- ✅ **테스트 코드** 작성 (Vitest + RTL + MSW)
- ✅ **SEO 최적화** (메타데이터, Open Graph)
- ✅ **성능 최적화** (React.memo, next/image, useMemo/useCallback)
- ✅ **접근성** 고려 (ARIA, 스크린 리더)
- ✅ **에러 핸들링** 및 재시도 기능
- ✅ **스켈레톤 UI** 로딩 상태
- ✅ **배포** (Vercel)
