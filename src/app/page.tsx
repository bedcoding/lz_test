import { Container, PageHeader, PageTitle, MainContent } from '@/components/layout/Container';
import RankingPageClientQuery from '@/components/RankingPageClientQuery';
import HelpIcon from '@/components/common/HelpIcon';
import { fetchGenreRanking } from '@/services/api';

// 동적 렌더링 강제 설정 (빌드 시점에 아직 시작되지 않은 내부 서버에서 API를 호출하면 빌드 오류 발생함)
export const dynamic = 'force-dynamic';

// 서버 컴포넌트 - SEO를 위해 서버에서 초기 데이터 렌더링
export default async function Home() {
  let initialData = null;
  try {
    initialData = await fetchGenreRanking('romance', 1);
  } catch (error) {
    console.error('Failed to load initial data:', error);
  }

  return (
    <Container>
      <PageHeader style={{ position: 'relative' }}>
        <PageTitle>웹툰 랭킹</PageTitle>
        <HelpIcon 
          title="HomePage - 메인 페이지"
          description="HomePage 컴포넌트에서 SSR과 CSR을 결합한 하이브리드 렌더링으로 구현된 웹툰 랭킹 서비스의 메인 페이지입니다."
          techStack={[
            'Next.js App Router', 
            'TanStack Query',
            'React Custom Hooks',
            'SSR + CSR Hybrid',
            'Infinite Scroll',
            'Real-time Filtering'
          ]}
          implementation={[
            'SSR로 초기 데이터 로드, CSR로 인터랙션 처리',
            'TanStack Query로 캐싱과 백그라운드 업데이트',
            'useRankingDataQuery로 무한 스크롤 데이터 관리',
            'useFilter로 실시간 클라이언트 사이드 필터링',
            'useGenre로 장르별 데이터 페칭',
            'useInfiniteScrollQuery로 스크롤 기반 페이지네이션',
            'QueryHydration으로 서버-클라이언트 상태 동기화',
            'optimistic updates와 error boundary 처리',
            '자동 데이터 prefetching으로 UX 최적화'
          ]}
          position="top-right"
        />
      </PageHeader>
      
      <MainContent>
        {/* TanStack Query 기반 클라이언트 컴포넌트 */}
        <RankingPageClientQuery
          initialResponse={initialData}
        />
      </MainContent>
    </Container>
  );
}