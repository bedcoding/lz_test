'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

const SkeletonContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.border} 25%,
    ${({ theme }) => theme.colors.surface} 50%,
    ${({ theme }) => theme.colors.border} 75%
  );
  background-size: 200px 100%;
  animation: ${shimmer} 1.5s infinite;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
`;

const SkeletonThumbnail = styled(SkeletonBase)`
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 60px;
    height: 75px;
  }
`;

const SkeletonContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const SkeletonTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 20px;
  width: 60%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 18px;
  }
`;

const SkeletonRankStatus = styled(SkeletonBase)`
  width: 40px;
  height: 20px;
`;

const SkeletonArtist = styled(SkeletonBase)`
  height: 14px;
  width: 40%;
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

const SkeletonMetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const SkeletonTag = styled(SkeletonBase)`
  height: 12px;
  width: 60px;
`;

const SkeletonFreeEpisode = styled(SkeletonBase)`
  height: 12px;
  width: 50px;
`;

interface SkeletonItemProps {
  className?: string;
}

export default function SkeletonItem({ className }: SkeletonItemProps) {
  return (
    <SkeletonContainer className={className}>
      <SkeletonThumbnail />
      
      <SkeletonContent>
        <SkeletonTopRow>
          <SkeletonTitle />
          <SkeletonRankStatus />
        </SkeletonTopRow>
        
        <SkeletonArtist />
        
        <SkeletonMetaRow>
          <SkeletonFreeEpisode />
          <SkeletonTag />
        </SkeletonMetaRow>
      </SkeletonContent>
    </SkeletonContainer>
  );
}
