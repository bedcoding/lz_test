/**
 * 테스트 환경 설정 파일
 * 
 * React 컴포넌트와 API 호출 테스트를 위한 전역 설정을 담당합니다.
 * 모든 테스트 파일 실행 전에 자동으로 로드됩니다.
 */

import '@testing-library/jest-dom';
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { server } from './mocks/server';

/**
 * MSW (Mock Service Worker) 서버 설정
 * API 호출을 실제 서버가 아닌 가짜 응답으로 처리하여 안정적인 테스트 환경 제공
 */
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers(); // 각 테스트 후 MSW 핸들러 초기화
  cleanup(); // React Testing Library 정리 작업
});
afterAll(() => server.close());

/**
 * window.matchMedia Mock 설정
 * CSS 미디어 쿼리 관련 기능을 jsdom 환경에서 사용할 수 있도록 Mock 처리
 * 반응형 컴포넌트 테스트에 필요
 */
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated: 구형 브라우저 호환성을 위한 레거시 API
    removeListener: vi.fn(), // deprecated: 구형 브라우저 호환성을 위한 레거시 API
    addEventListener: vi.fn(), // 현재 표준 API
    removeEventListener: vi.fn(), // 현재 표준 API
    dispatchEvent: vi.fn(),
  })),
});

/**
 * IntersectionObserver Mock 설정
 * 무한스크롤 기능 테스트를 위해 필요
 * 실제 DOM 교차점 감지가 아닌 Mock 함수로 동작
 */
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(), // 요소 관찰 시작
  unobserve: vi.fn(), // 요소 관찰 중단
  disconnect: vi.fn(), // 모든 관찰 중단
}));

/**
 * fetch API Mock 설정
 * MSW가 HTTP 요청을 가로채서 처리할 수 있도록 전역 fetch를 Mock으로 설정
 */
global.fetch = vi.fn();
