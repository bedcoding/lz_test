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

포괄적인 테스트 스택으로 코드 품질과 안정성을 보장합니다.

### 🛠️ 테스트 스택

#### **Vitest** - 차세대 테스트 프레임워크
```typescript
// vitest.config.ts에서 설정
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts']
  }
});
```
- **무엇인가?**: Vite 기반의 빠른 테스트 프레임워크
- **왜 선택했나?**: Jest 대비 **5-10배 빠른 속도**, ES6 모듈 네이티브 지원
- **어디서 사용?**: 모든 테스트 파일 (`.test.ts`, `.test.tsx`)
- **실제 예시**: `src/test/utils/filter.test.ts` - 필터링 로직 단위 테스트

#### **React Testing Library (RTL)** - 사용자 중심 컴포넌트 테스트
```typescript
// src/test/components/ranking/RankingItem.test.tsx
import { render, screen } from '@testing-library/react';

it('웹툰 제목, 작가명, 순위를 표시한다', () => {
  render(<RankingItem item={mockItem} />);
  expect(screen.getByText('테스트 웹툰')).toBeInTheDocument();
});
```
- **무엇인가?**: "사용자가 보는 것"을 테스트하는 React 컴포넌트 테스트 라이브러리
- **왜 선택했나?**: Enzyme 대비 **실제 사용자 경험**에 집중, **접근성 고려**
- **어디서 사용?**: React 컴포넌트와 커스텀 훅 테스트
- **실제 예시**: `src/test/components/ranking/FilterPanel.test.tsx` - 버튼 클릭, 키보드 네비게이션 테스트

#### **MSW (Mock Service Worker)** - 네트워크 레벨 API 모킹
```typescript
// src/test/mocks/handlers.ts
export const handlers = [
  http.get('/api/comics/romance', async ({ request }) => {
    const pageData = await loadPageData('romance', page);
    return HttpResponse.json(pageData);
  })
];
```
- **무엇인가?**: 실제 네트워크 요청을 가로채서 가짜 응답을 제공하는 도구
- **왜 선택했나?**: **실제 API와 동일한 방식**으로 테스트, **브라우저와 Node.js 모두 지원**
- **어디서 사용?**: API 호출이 있는 모든 테스트 (컴포넌트, 훅, 서비스)
- **실제 예시**: `src/test/services/api.test.ts` - API 요청/응답, 에러 처리 테스트

#### **jsdom** - 브라우저 환경 시뮬레이션
- **무엇인가?**: Node.js 환경에서 DOM API를 제공하는 라이브러리
- **왜 필요한가?**: React 컴포넌트 렌더링, DOM 조작 테스트를 위해 필수
- **어디서 사용?**: 모든 React 컴포넌트 테스트의 기반 환경

### 📋 테스트 명령어

```bash
# 기본 테스트 실행 (watch 모드)
npm test

# 단일 실행 (CI/CD 환경)
npm run test:run

# 테스트 UI 실행 (브라우저에서 시각적 확인)
npm run test:ui

# 커버리지 리포트 생성
npm run test:coverage

# 변경사항 감지하여 테스트 실행
npm run test:watch
```

### 🎯 테스트 구조

```
src/test/
├── components/              # 컴포넌트 테스트 (RTL 사용)
│   └── ranking/
│       ├── RankingItem.test.tsx        # 웹툰 아이템 렌더링, 이미지 로딩 테스트
│       └── FilterPanel.test.tsx        # 필터 버튼 클릭, 키보드 네비게이션 테스트
├── hooks/                   # 커스텀 훅 테스트 (renderHook 사용)
│   └── useFilter.test.ts               # 필터 상태 관리, 웹툰 필터링 로직 테스트
├── services/                # API 서비스 테스트 (MSW 활용)
│   └── api.test.ts                     # API 요청/응답, 에러 처리, 페이지네이션 테스트
├── utils/                   # 유틸리티 함수 테스트 (순수 함수)
│   ├── filter.test.ts                  # 필터링 로직, 라벨 생성 함수 테스트
│   └── ranking.test.ts                 # 랭킹 상태 계산, 아이콘 생성 함수 테스트
├── mocks/                   # MSW 모킹 설정
│   ├── server.ts                       # MSW 서버 설정
│   └── handlers.ts                     # API 엔드포인트 Mock 핸들러 (실제 JSON 데이터 활용)
└── setup.ts                 # 테스트 환경 설정 (MSW, jsdom, 전역 Mock)
```

### 🔄 테스트 스택 선택 이유

| 도구 | 대안 | 선택 이유 |
|------|------|-----------|
| **Vitest** | Jest | • **5-10배 빠른 속도**<br>• ES6 모듈 네이티브 지원<br>• TypeScript 지원 우수 |
| **RTL** | Enzyme | • **사용자 중심 테스트**<br>• React 18+ 완벽 지원<br>• 접근성 고려 |
| **MSW** | axios-mock-adapter | • **네트워크 레벨 모킹**<br>• 브라우저/Node.js 공통 사용<br>• 실제 API와 동일한 동작 |
| **jsdom** | happy-dom | • **안정성 및 호환성**<br>• 풍부한 DOM API 지원<br>• React 생태계 표준 |

### 🎪 테스트 커버리지

주요 테스트 영역:
- **유틸리티 함수**: 필터링, 랭킹 상태 계산 로직
- **컴포넌트**: 렌더링, 사용자 인터랙션, 접근성
- **커스텀 훅**: 상태 관리, 데이터 플로우
- **API 서비스**: HTTP 요청/응답, 에러 처리

### 🔧 테스트 설정

#### vitest.config.ts
```typescript
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: true,
    coverage: {
      reporter: ['text', 'json', 'html']
    }
  }
});
```

#### MSW 모킹
- 실제 네트워크 요청 차단
- 일관된 테스트 데이터 제공
- API 에러 상황 시뮬레이션

### 📊 테스트 Best Practices

#### 1. **사용자 관점 테스트** (RTL 활용)
```typescript
// ❌ 구현 세부사항 테스트
expect(wrapper.state().isLoading).toBe(true);

// ✅ 사용자가 보는 것 테스트  
expect(screen.getByText('로딩 중...')).toBeInTheDocument();
expect(screen.getByRole('button', { name: '로맨스' })).toBeInTheDocument();
```

#### 2. **격리된 테스트** (독립적 실행)
```typescript
// src/test/setup.ts에서 자동 정리
afterEach(() => {
  server.resetHandlers(); // MSW 핸들러 초기화
  cleanup(); // React Testing Library 정리
});
```

#### 3. **모킹 전략** (MSW로 네트워크 격리)
```typescript
// 실제 JSON 데이터 활용
const pageData = await loadPageData('romance', page);
return HttpResponse.json(pageData);

// 에러 시나리오 테스트
http.get('/api/comics/error', () => {
  return HttpResponse.json({ error: 'Server Error' }, { status: 500 });
});
```

#### 4. **접근성 테스트** (A11y 검증)
```typescript
// ARIA 속성 검증
expect(screen.getByRole('group', { name: /작품 필터링 옵션/ })).toBeInTheDocument();

// 키보드 네비게이션 테스트
await user.tab(); // Tab 키 시뮬레이션
await user.keyboard('{Enter}'); // Enter 키 시뮬레이션
```

#### 5. **에러 처리** (다양한 시나리오)
```typescript
// 네트워크 에러, 서버 에러, 404 등 모든 경우 테스트
it('네트워크 에러 시 적절한 에러 메시지를 반환한다', async () => {
  await expect(fetchGenreRanking('invalid', 1)).rejects.toThrow('Network error');
});
```

### 🚀 CI/CD 통합

```bash
# 빌드 전 테스트 실행
npm run test:run && npm run build
```

## 📈 성능 최적화

- **React.memo**: 불필요한 리렌더링 방지
- **useMemo/useCallback**: 연산 결과 캐싱
- **Intersection Observer**: 효율적인 스크롤 감지
- **이미지 최적화**: next/image 활용 예정
