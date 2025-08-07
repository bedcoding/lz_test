'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div<{ $centered?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  ${({ $centered }) => $centered && `
    min-height: 200px;
  `}
`;

const Spinner = styled.div<{ $size?: 'sm' | 'md' | 'lg' }>`
  border: 3px solid ${({ theme }) => theme.colors.surface};
  border-top: 3px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  
  ${({ $size = 'md' }) => {
    switch ($size) {
      case 'sm':
        return 'width: 20px; height: 20px;';
      case 'lg':
        return 'width: 48px; height: 48px;';
      case 'md':
      default:
        return 'width: 32px; height: 32px;';
    }
  }}
`;

const LoadingText = styled.p`
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  margin-left: ${({ theme }) => theme.spacing.sm};
`;

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  centered?: boolean;
  className?: string;
}

export default function Loading({ 
  size = 'md', 
  text = '로딩 중...', 
  centered = false,
  className 
}: LoadingProps) {
  return (
    <LoadingContainer $centered={centered} className={className}>
      <Spinner $size={size} role="status" aria-label="로딩 중" />
      {text && <LoadingText>{text}</LoadingText>}
      <span className="sr-only">로딩 중</span>
    </LoadingContainer>
  );
}
