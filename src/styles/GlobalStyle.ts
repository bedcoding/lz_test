import { createGlobalStyle } from 'styled-components';
import { Theme } from './theme';

/**
 * 전역 CSS 스타일 - 웹사이트 전체에 적용
 * ThemeProvider에서 사용되어 모든 컴포넌트의 기본 스타일 설정
 * - CSS 리셋 (브라우저 기본 스타일 제거)
 * - 기본 폰트, 색상 설정 (theme 연동)
 * - 유틸리티 클래스 제공
 * - 접근성 관련 스타일 포함
 */
export const GlobalStyle = createGlobalStyle<{ theme: Theme }>`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.text.primary};
    background-color: ${({ theme }) => theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    border: none;
    background: none;
    cursor: pointer;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ul, ol {
    list-style: none;
  }

  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* 스크롤바 스타일링 (Chrome, Safari, Edge 지원) */
  ::-webkit-scrollbar {
    width: 8px;  // 스크롤바 너비
  }

  ::-webkit-scrollbar-track {
    background: ${({ theme }) => theme.colors.surface};  // 스크롤바 배경 트랙
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.text.light};  // 스크롤바 핸들 (드래그 부분)
    border-radius: ${({ theme }) => theme.borderRadius.sm};  // 둥근 모서리
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.text.secondary}; // 마우스 호버 시 더 진한 색상
  }

  /* 포커스 스타일 */
  button:focus,
  a:focus,
  input:focus,
  textarea:focus,
  select:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* 접근성을 위한 스킵 링크 */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 6px;
    background: ${({ theme }) => theme.colors.primary};
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 1000;
    border-radius: ${({ theme }) => theme.borderRadius.sm};
  }

  .skip-link:focus {
    top: 6px;
  }

  /* 반응형 이미지 */
  .responsive-image {
    width: 100%;
    height: auto;
    object-fit: cover;
  }

  /* 텍스트 말줄임 유틸리티 */
  .text-ellipsis {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .text-ellipsis-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  /* 화면 읽기 전용 텍스트 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
