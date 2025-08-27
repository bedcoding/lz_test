'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import HelpIcon from '@/components/common/HelpIcon';

// 기본 버튼 스타일
const baseButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid transparent;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

// active 상태에 따라 색상 변경
const buttonStyles = css<{ $active?: boolean }>`
  background-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.background};
  color: ${({ $active, theme }) => 
    $active ? '#ffffff' : theme.colors.text.primary};
  border-color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.border};
  
  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
    ${({ $active, theme }) => !$active && `
      background-color: ${theme.colors.surface};
    `}
  }
  
  &:active {
    transform: translateY(1px);
  }
`;

// 버튼을 감싸는 컨테이너 - HelpIcon 플로팅을 위한 relative positioning
const ButtonWrapper = styled.div`
  position: relative;
  display: inline-block;
`;

// 단순화된 버튼 컴포넌트 - active 상태와 size만 관리
const StyledButton = styled.button<{ 
  $size: 'sm' | 'md' | 'lg';
  $active?: boolean;
}>`
  ${baseButtonStyles}
  ${buttonStyles}
  
  ${({ $size }) => {
    switch ($size) {
      case 'sm':
        return css`
          padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
          font-size: ${({ theme }) => theme.fonts.size.xs};
        `;
      case 'lg':
        return css`
          padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
          font-size: ${({ theme }) => theme.fonts.size.base};
        `;
      case 'md':
      default:
        return css`
          padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
          font-size: ${({ theme }) => theme.fonts.size.sm};
        `;
    }
  }}
`;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
  children: ReactNode;
  showHelp?: boolean;  // HelpIcon 표시 여부
}

export default function Button({
  size = 'md',
  active = false,
  children,
  showHelp = false,
  ...props
}: ButtonProps) {
  if (showHelp) {
    return (
      <ButtonWrapper>
        <HelpIcon 
          title="재사용 버튼 컴포넌트"
          description="다양한 크기와 상태를 지원하는 재사용 가능한 버튼 컴포넌트입니다."
          techStack={[
            'Styled Components', 
            'CSS-in-JS',
            'TypeScript Props',
            'Theme System',
            'Accessibility'
          ]}
          implementation={[
            '3가지 크기 옵션 (sm, md, lg)으로 유연한 사용',
            'active 상태에 따른 동적 스타일 변경',
            'hover, focus, active 상호작용 애니메이션',
            'disabled 상태 처리 및 시각적 피드백',
            'CSS transition으로 부드러운 상태 전환',
            'focus outline으로 키보드 네비게이션 지원',
            'theme 시스템 활용한 일관된 디자인',
            'HTMLButtonElement 속성 완전 상속'
          ]}
          position="top-right"
          size="sm"
        />
        <StyledButton
          $size={size}
          $active={active}
          {...props}
        >
          {children}
        </StyledButton>
      </ButtonWrapper>
    );
  }

  return (
    <StyledButton
      $size={size}
      $active={active}
      {...props}
    >
      {children}
    </StyledButton>
  );
}
