'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { ComicRankApiSuccessResponse } from '@/types/ranking';

interface QueryHydrationProps {
  initialResponse: ComicRankApiSuccessResponse | null;
  children: React.ReactNode;
}

export default function QueryHydration({ 
  initialResponse, 
  children 
}: QueryHydrationProps) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // 서버에서 받은 초기 데이터를 TanStack Query 캐시에 설정 (하이브리드 방식)
    // 초기 데이터는 항상 'romance' 장르이므로, romance 키로만 캐시 설정
    if (initialResponse && initialResponse.data.length > 0) {
      queryClient.setQueryData(
        ['ranking', 'romance'], // 고정: 서버 초기 데이터는 항상 romance
        {
          pages: [{
            items: initialResponse.data,
            hasNext: initialResponse.hasNext,
            count: initialResponse.count,
            nextPage: initialResponse.hasNext ? 2 : undefined,
          }],
          pageParams: [1],
        }
      );
    }
  }, [queryClient, initialResponse]);

  return <>{children}</>;
}
