import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vitest 테스트 환경 설정
 */
export default defineConfig({
  // React JSX 변환과 Fast Refresh 지원
  plugins: [react()],
  
  test: {
    // DOM 환경 시뮬레이션: React 컴포넌트 렌더링을 위해 필요
    environment: 'jsdom',
    
    // 테스트 실행 전 초기 설정 파일: MSW 서버, Jest-DOM 매처 등 설정
    setupFiles: ['./src/test/setup.ts'],
    
    // 전역 함수 사용 가능: describe, it, expect 등을 import 없이 사용
    globals: true,
    
    // CSS 모듈과 스타일 처리 지원: styled-components 테스트를 위해 필요
    css: true,
    
    // 상세한 테스트 결과 출력: 각 테스트의 성공/실패 상태를 자세히 표시
    reporters: ['verbose'],
    
    // 코드 커버리지 설정
    coverage: {
      // 커버리지 리포트 형식: 터미널(text), JSON 파일, HTML 대시보드
      reporter: ['text', 'json', 'html'],
      
      // 커버리지 측정에서 제외할 파일들
      exclude: [
        'node_modules/',      // 외부 라이브러리
        'src/test/',          // 테스트 파일 자체
        '**/*.d.ts',          // TypeScript 타입 선언 파일
        '**/*.config.*',      // 설정 파일들
        '**/coverage/**',     // 커버리지 리포트 파일들
        '.next/**'            // Next.js 빌드 파일들 (Windows11에서 npm run test:coverage 했더니 :라는 텍스트 들어갔다고 경로 오류 뜨길래 추가함)
      ]
    }
  },
  
  // 모듈 해석 설정
  resolve: {
    alias: {
      // '@' 별칭을 src 디렉토리로 설정: import '@/components/Button' 형태로 사용 가능
      '@': path.resolve(__dirname, './src')
    }
  }
});
