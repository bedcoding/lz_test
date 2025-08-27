'use client';

import { useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';

interface HelpIconProps {
  title: string;
  description: string;
  techStack?: string[];
  implementation?: string[];
  position?: 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left';
  size?: 'sm' | 'md';
}

const HelpContainer = styled.div<{ position: HelpIconProps['position'] }>`
  position: absolute;
  ${({ position }) => {
    switch (position) {
      case 'top-left':
        return 'top: 8px; left: 8px;';
      case 'top-center':
        return 'top: 8px; left: 50%; transform: translateX(-50%);';
      case 'bottom-right':
        return 'bottom: 8px; right: 8px;';
      case 'bottom-left':
        return 'bottom: 8px; left: 8px;';
      default:
        return 'top: 8px; right: 8px;';
    }
  }}
  z-index: 50;
`;

const HelpButton = styled.button<{ size: HelpIconProps['size'] }>`
  width: ${({ size }) => size === 'sm' ? '20px' : '24px'};
  height: ${({ size }) => size === 'sm' ? '20px' : '24px'};
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.9);
  border: 2px solid white;
  color: white;
  font-size: ${({ size }) => size === 'sm' ? '11px' : '13px'};
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(59, 130, 246, 1);
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }
`;

const HelpModal = styled.div<{ size: HelpIconProps['size'] }>`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  min-width: ${({ size }) => size === 'sm' ? '300px' : '400px'};
  max-width: ${({ size }) => size === 'sm' ? '400px' : '500px'};
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  z-index: 1000;
`;

const HelpOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const HelpTitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
`;

const HelpDescription = styled.p`
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 16px;
`;

const HelpSection = styled.div`
  margin-bottom: 16px;
`;

const HelpSectionTitle = styled.h4`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
`;

const HelpList = styled.ul`
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  margin-left: 16px;
`;

const HelpListItem = styled.li`
  margin-bottom: 4px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  width: 24px;
  height: 24px;
  border: none;
  background: #f3f4f6;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #6b7280;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const TechBadge = styled.span`
  display: inline-block;
  background: #dbeafe;
  color: #1e40af;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 6px;
  margin-bottom: 4px;
  font-weight: 500;
`;

export default function HelpIcon({ 
  title, 
  description, 
  techStack, 
  implementation, 
  position = 'top-right',
  size = 'md' 
}: HelpIconProps) {
  const [isOpen, setIsOpen] = useState(false);

  const modalContent = isOpen ? (
    <>
      <HelpOverlay onClick={() => setIsOpen(false)} />
      <HelpModal size={size}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
          <HelpTitle>{title}</HelpTitle>
          <button 
            onClick={() => setIsOpen(false)}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '20px', 
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0',
              lineHeight: '1'
            }}
            aria-label="도움말 닫기"
          >
            ×
          </button>
        </div>
        
        <HelpDescription>{description}</HelpDescription>

        {techStack && techStack.length > 0 && (
          <HelpSection>
            <HelpSectionTitle>🛠️ 기술 스택</HelpSectionTitle>
            <div>
              {techStack.map((tech, index) => (
                <TechBadge key={index}>{tech}</TechBadge>
              ))}
            </div>
          </HelpSection>
        )}

        {implementation && implementation.length > 0 && (
          <HelpSection>
            <HelpSectionTitle>⚙️ 주요 구현 내용</HelpSectionTitle>
            <HelpList>
              {implementation.map((item, index) => (
                <HelpListItem key={index}>{item}</HelpListItem>
              ))}
            </HelpList>
          </HelpSection>
        )}
      </HelpModal>
    </>
  ) : null;

  return (
    <>
      <HelpContainer position={position}>
        <HelpButton 
          size={size}
          onClick={() => setIsOpen(true)}
          aria-label="도움말 보기"
        >
          ?
        </HelpButton>
      </HelpContainer>
      
      {typeof document !== 'undefined' && modalContent && 
        createPortal(modalContent, document.body)
      }
    </>
  );
}
