import { Container, PageHeader, PageTitle, MainContent } from '@/components/layout/Container';
import RankingPageClient from '@/components/RankingPageClient';
import { fetchGenreRanking } from '@/services/api';

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
        {/* 클라이언트 컴포넌트로 인터랙션 기능 분리 */}
        <RankingPageClient
          initialData={initialData?.data || []}
        />
      </MainContent>
    </Container>
  );
}