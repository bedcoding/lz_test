# 로맨스 장르 랭킹

로맨스 장르 웹툰 랭킹을 확인할 수 있는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **랭킹 리스트**: 로맨스 장르 웹툰의 실시간 랭킹 확인
- **무한 스크롤**: 스크롤을 통한 자동 페이지 로딩
- **필터링**: 연재중/완결/무료회차 조건으로 작품 필터링
- **반응형 디자인**: Desktop, Tablet, Mobile 환경 지원
- **랭킹 상태 표시**: 순위 상승/하락/변동없음 시각적 표현

## 🛠️ 기술 스택

### Core Framework
- **Next.js 14**: React 기반 풀스택 프레임워크
- **React 18**: 컴포넌트 기반 UI 라이브러리
- **TypeScript**: 정적 타입 검사

### Styling
- **styled-components**: CSS-in-JS 스타일링 라이브러리

### 개발 도구
- **ESLint**: 코드 품질 검사
- **Prettier**: 코드 포맷팅 (package.json 설정)

## 📁 프로젝트 구조

```
lezhin-ranking/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/comics/romance/ # API 라우트
│   │   ├── layout.tsx          # 루트 레이아웃
│   │   └── page.tsx           # 메인 페이지
│   ├── components/
│   │   ├── common/            # 공통 컴포넌트
│   │   │   ├── Button.tsx
│   │   │   └── Loading.tsx
│   │   ├── ranking/           # 랭킹 관련 컴포넌트
│   │   │   ├── RankingItem.tsx
│   │   │   ├── RankingList.tsx
│   │   │   ├── RankingFilter.tsx
│   │   │   └── RankingStatus.tsx
│   │   └── layout/            # 레이아웃 컴포넌트
│   │       ├── Container.tsx
│   │       ├── ThemeProvider.tsx
│   │       └── StyledComponentsRegistry.tsx
│   ├── hooks/                 # Custom Hooks
│   │   ├── useInfiniteScroll.ts
│   │   ├── useRankingData.ts
│   │   └── useFilter.ts
│   ├── services/              # API 서비스
│   │   └── api.ts
│   ├── types/                 # TypeScript 타입 정의
│   │   ├── ranking.ts
│   │   └── styled.d.ts
│   ├── styles/                # 스타일 관련
│   │   ├── GlobalStyle.ts
│   │   └── theme.ts
│   └── utils/                 # 유틸리티 함수
│       ├── ranking.ts
│       └── filter.ts
├── data/mock/                 # Mock 데이터
│   └── ranking.json
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

### GET /api/comics/romance

로맨스 장르 랭킹 데이터를 가져옵니다.

**Query Parameters:**
- `page`: 페이지 번호 (1-5)

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
  title: string;
  artists: Artist[];
  currentRank: number;
  previousRank: number;
  freedEpisodeSize: number;
  contentsState: "scheduled" | "completed";
  schedule: { periods: Period[] };
  thumbnailSrc: string;
  // ... 기타 필드
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

## 🔧 기술 선택 이유

### Next.js
- **SSR/SSG 지원**: SEO 최적화 및 초기 로딩 성능
- **API Routes**: 백엔드 API를 같은 프로젝트에서 관리
- **파일 기반 라우팅**: 직관적인 페이지 구조
- **최적화**: 이미지, 폰트, 번들 자동 최적화

### styled-components
- **CSS-in-JS**: 컴포넌트와 스타일의 강한 결합
- **테마 시스템**: 일관된 디자인 시스템 구축
- **동적 스타일링**: Props에 따른 조건부 스타일
- **SSR 지원**: 서버사이드 렌더링 호환

### TypeScript
- **타입 안정성**: 런타임 에러 사전 방지
- **개발 경험**: IntelliSense 및 자동완성
- **코드 품질**: 명시적 인터페이스 정의
- **유지보수성**: 리팩토링 안정성

### Custom Hooks
- **관심사 분리**: 비즈니스 로직과 UI 분리
- **재사용성**: 다른 컴포넌트에서 재사용 가능
- **테스트 용이성**: 로직 단위 테스트 가능

## 🔍 테스트

현재 프로젝트는 기능 구현에 집중되어 있으며, 추후 다음 테스트 도구 추가 예정:
- **Jest**: 단위 테스트
- **React Testing Library**: 컴포넌트 테스트
- **Cypress**: E2E 테스트

## 📈 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useMemo/useCallback**: 연산 결과 캐싱
- **Intersection Observer**: 효율적인 스크롤 감지
- **이미지 최적화**: next/image 활용 예정

## 🚀 배포

현재는 로컬 개발 환경에서만 실행 가능하며, 배포 시 다음 플랫폼 고려:
- **Vercel**: Next.js 최적화 플랫폼
- **Netlify**: 정적 사이트 호스팅
- **AWS**: 엔터프라이즈 환경