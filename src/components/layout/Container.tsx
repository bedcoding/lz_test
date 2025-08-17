'use client';

import styled from 'styled-components';

/**
 * 페이지 전체 레이아웃을 담당하는 컨테이너 컴포넌트들
 * - 중앙 정렬 및 최대 너비 제한
 * - 반응형 패딩 적용
 * - Flexbox 없이 기본 블록 레이아웃 사용
 */

// 메인 컨테이너 - 중앙 정렬 및 반응형 패딩
export const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;  // 수평 중앙 정렬
  padding: 0 ${({ theme }) => theme.spacing.md};
  
  // 태블릿 크기에서 패딩 축소
  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
  
  // 모바일 크기에서 패딩 축소
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: 0 ${({ theme }) => theme.spacing.sm};
  }
`;

// 페이지 헤더 - 제목 영역
export const PageHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.xl} 0 ${({ theme }) => theme.spacing.lg};
  text-align: center;  // 텍스트 중앙 정렬
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

// 페이지 제목 - 반응형 폰트 크기
export const PageTitle = styled.h1`
  font-size: ${({ theme }) => theme.fonts.size['3xl']};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  
  // 모바일에서 폰트 크기 축소
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fonts.size['2xl']};
  }
`;

// 메인 콘텐츠 영역 - 필터 패널과 랭킹 리스트를 포함
export const MainContent = styled.main`
  min-height: 100vh;  // 최소 화면 높이 확보
  padding-bottom: ${({ theme }) => theme.spacing['2xl']};  // 하단 여백
`;
