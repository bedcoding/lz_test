// 랭킹 변동을 나타내는 컴포넌트
import styled from 'styled-components';
import { getRankingStatus, getRankingIcon } from '@/utils/ranking';

// 메인 컨테이너 - 아이콘과 텍스트를 가로로 정렬, 상태에 따라 색상 변경
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

// 랭킹 상태 아이콘 (↑, ↓, -)
const StatusIcon = styled.span`
  font-size: ${({ theme }) => theme.fonts.size.xs};
  line-height: 1;
`;

// 순위 변동 수치 텍스트
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
      {/* 랭킹 변동 아이콘 (↑↓-) */}
      <StatusIcon aria-hidden="true">{icon}</StatusIcon>
      
      {/* 변동 수치 표시 (변동이 있고 수치가 0보다 클 때만) */}
      {showDiff && diff > 0 && (
        <StatusText>
          {diff}
        </StatusText>
      )}
      
      {/* 접근성: 스크린 리더 사용자를 위한 텍스트 (화면에는 보이지 않음) */}
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
