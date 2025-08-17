// 스켈레톤 로딩 아이템
import { memo } from 'react';
import styled, { keyframes } from 'styled-components';

// 시머 애니메이션 - 로딩 상태를 나타내는 좌우 이동 효과
const shimmer = keyframes`
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
`;

// 메인 컨테이너 - RankingItem의 ItemContainer와 동일한 레이아웃
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

// 기본 스켈레톤 스타일 - 모든 스켈레톤 요소들이 상속
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

// 썸네일 스켈레톤 - 고정 크기, 축소되지 않음
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

// 콘텐츠 영역 - 나머지 공간을 모두 차지
const SkeletonContent = styled.div`
  flex: 1;
  min-width: 0;
`;

// 상단 행 - 제목과 랭킹 상태를 양 끝에 배치
const SkeletonTopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// 제목 스켈레톤 - 너비를 60%로 제한
const SkeletonTitle = styled(SkeletonBase)`
  height: 20px;
  width: 60%;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    height: 18px;
  }
`;

// 랭킹 상태 스켈레톤 - 작은 고정 크기
const SkeletonRankStatus = styled(SkeletonBase)`
  width: 40px;
  height: 20px;
`;

// 작가 스켈레톤 - 비교적 작은 크기
const SkeletonArtist = styled(SkeletonBase)`
  height: 14px;
  width: 40%;
  margin: ${({ theme }) => theme.spacing.xs} 0;
`;

// 메타 정보 행 - 여러 태그들을 가로로 배치
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

// 일반 태그 스켈레톤
const SkeletonTag = styled(SkeletonBase)`
  height: 12px;
  width: 60px;
`;

// 무료 회차 스켈레톤
const SkeletonFreeEpisode = styled(SkeletonBase)`
  height: 12px;
  width: 50px;
`;

interface SkeletonItemProps {
  className?: string;
  mode?: 'full' | 'minimal';
}

// 로딩 상태 변경 시 불필요한 리렌더링 방지를 위한 memo 추가
const SkeletonItem = memo(function SkeletonItem({ className, mode = 'full' }: SkeletonItemProps) {
  if (mode === 'minimal') {
    return (
      <SkeletonContainer className={className}>
        <SkeletonThumbnail />
        <SkeletonContent>
          {/* 빈 공간 - 데이터 로딩을 기다림 */}
        </SkeletonContent>
      </SkeletonContainer>
    );
  }

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
});

export default SkeletonItem;
