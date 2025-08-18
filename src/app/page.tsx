import { Container, PageHeader, PageTitle, MainContent } from '@/components/layout/Container';
import RankingPageClientQuery from '@/components/RankingPageClientQuery';
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
      <PageHeader>
        <PageTitle>웹툰 랭킹</PageTitle>
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