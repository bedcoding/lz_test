'use client';

import React from 'react';
import styled from 'styled-components';
import { getRankingStatus, getRankingIcon } from '@/utils/ranking';

const StatusContainer = styled.div<{ $status: 'up' | 'down' | 'same' }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  
  color: ${({ theme, $status }) => {
    switch ($status) {
      case 'up':
        return theme.colors.ranking.up;
      case 'down':
        return theme.colors.ranking.down;
      case 'same':
      default:
        return theme.colors.ranking.same;
    }
  }};
`;

const StatusIcon = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  line-height: 1;
`;

const StatusText = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xs};
`;

interface RankingStatusProps {
  currentRank: number;
  previousRank: number;
  showDiff?: boolean;
  className?: string;
}

export default function RankingStatus({
  currentRank,
  previousRank,
  showDiff = true,
  className
}: RankingStatusProps) {
  const { status, diff } = getRankingStatus(currentRank, previousRank);
  const icon = getRankingIcon(status);

  return (
    <StatusContainer $status={status} className={className}>
      <StatusIcon aria-hidden="true">{icon}</StatusIcon>
      {showDiff && diff > 0 && (
        <StatusText>
          {diff}
        </StatusText>
      )}
      <span className="sr-only">
        {status === 'up' 
          ? `${diff}단계 상승` 
          : status === 'down' 
          ? `${diff}단계 하락` 
          : '순위 변동 없음'}
      </span>
    </StatusContainer>
  );
}
