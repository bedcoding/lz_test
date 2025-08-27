'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

interface QueryProviderProps {
  children: React.ReactNode;
}

export default function QueryProvider({ children }: QueryProviderProps) {
  // QueryClient를 컴포넌트 내부에서 생성하여 SSR 시 서버-클라이언트 간 상태 불일치 방지
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // 5분간 캐시 유지
        staleTime: 5 * 60 * 1000,
        // 백그라운드에서 자동으로 refetch
        refetchOnWindowFocus: true,
        // 네트워크 재연결시 refetch
        refetchOnReconnect: true,
        // 에러 시 재시도 설정
        retry: (failureCount, error) => {
          // API 에러 코드가 4xx인 경우 재시도하지 않음
          if (error && typeof error === 'object' && 'status' in error) {
            const status = error.status as number;
            if (status >= 400 && status < 500) return false;
          }
          // 그 외의 경우 최대 3회 재시도
          return failureCount < 3;
        },
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
      mutations: {
        // 뮤테이션 에러 시 재시도 설정
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools 비활성화 */}
      {/* {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools 
          initialIsOpen={false}
        />
      )} */}
    </QueryClientProvider>
  );
}
