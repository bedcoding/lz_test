import { memo, useState } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { ComicRankItem } from '@/types/ranking';
import RankingStatus from './RankingStatus';
import { 
  getScheduleText, 
  getContentsStateText, 
  getFreeEpisodeText 
} from '@/utils/ranking';

// 메인 컨테이너 - 썸네일과 콘텐츠를 가로로 배치
const ItemContainer = styled.div`
  display: flex;
  align-items: flex-start;  // 상단 정렬 (썸네일 높이가 다를 수 있음)
  gap: ${({ theme }) => theme.spacing.md};  // 썸네일과 콘텐츠 사이 간격
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  transition: all 0.2s ease-in-out;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
    transform: translateY(-2px);
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    gap: ${({ theme }) => theme.spacing.sm};
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

// 썸네일 컨테이너 - 웹툰/드라마 포스터를 표시하는 고정 크기 컨테이너
const Thumbnail = styled.div`
  flex-shrink: 0;  // 공간이 부족해도 썸네일 크기 유지 (축소 비율 0)
  
  // 기본 크기 설정 (4:5 비율 - 포스터 형태)
  width: 80px;
  height: 100px;
  
  // 스타일링
  background-color: ${({ theme }) => theme.colors.border};  // 이미지 로딩 전 기본 배경색
  border-radius: ${({ theme }) => theme.borderRadius.md};
  position: relative;  // 자식 요소(오버레이, 뱃지 등)들의 위치 기준점
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 60px;
    height: 75px;
  }
`;

// 썸네일 이미지가 갑자기 나타나지 않고 부드럽게 뜨도록 처리 (깜빡임 방지)
const ThumbnailImage = styled(Image)`
  border-radius: ${({ theme }) => theme.borderRadius.md};
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  
  &.loaded {
    opacity: 1;
  }
  
  &.error {
    display: none;
  }
`;

// 이미지 로딩중 placeholder (이미지 로드되기 전까지 임시로 보여주는 애니메이션)
const ImagePlaceholder = styled.div`
  position: absolute;
  inset: 0;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background: linear-gradient(
    90deg, 
    #f0f0f0 0%, 
    #f5f5f5 25%, 
    #ffffff 50%, 
    #f5f5f5 75%, 
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s ease-in-out infinite;
  
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  
  &.hide {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
`;

// 이미지 로드 실패 또는 썸네일 부재 시 표시되는 간단한 플레이스홀더
const ThumbnailFallback = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(0,0,0,0.04), rgba(0,0,0,0.08));
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.fonts.size.xs};
`;

// 콘텐츠 영역 - 썸네일 옆의 모든 텍스트 콘텐츠를 담는 컨테이너
const ContentArea = styled.div`
  flex: 1;  // 썸네일을 제외한 나머지 공간 모두 차지 (없으면 내부 콘텐츠 크기만큼만 차지함)
  min-width: 0;  // flex item의 최소 너비 제한 해제 (컨테이너가 작아질 때 콘텐츠 영역도 함께 축소될 수 있도록 허용)
`;

// [랭킹번호 + 제목]과 [랭킹변동 상태]를 좌우 양 끝에 배치하는 상단 행
const TopRow = styled.div`
  display: flex;
  align-items: flex-start;  // 세로축 기준 상단 정렬 (요소들의 높이가 달라도 위쪽 기준선으로 맞춤)
  justify-content: space-between;  // 좌우 양 끝에 배치 (랭킹번호 + 제목 ←→ 랭킹변동 상태)
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

// 랭킹 번호와 제목을 함께 담는 컨테이너 - 남은 공간 모두 사용
const RankAndTitle = styled.div`
  flex: 1;
  min-width: 0;
`;

// 랭킹 번호 스타일 - 고정 폭으로 정렬 유지
const RankNumber = styled.span`
  display: inline-block;
  font-size: ${({ theme }) => theme.fonts.size.xl};
  font-weight: ${({ theme }) => theme.fonts.weight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-right: ${({ theme }) => theme.spacing.sm};
  min-width: 2ch;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fonts.size.lg};
  }
`;

// 작품 제목
const Title = styled.h3`
  display: inline;  // 랭킹 번호 다음에 제목 넣을때 줄바꿈하지 않고 한 줄로 표기
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fonts.size.base};
  }
`;

// 작가명
const Artists = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.4;
`;

// 메타 정보 컨테이너 - 무료회차 + 연재상태(연재중/완결), 스케줄 2개 행을 세로로 배치
const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

// 메타 정보 행 - 이 행에 들어가는 값들을 모두 가로로 나열함 (예시: 무료회차 + 연재상태)
const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    flex-wrap: wrap;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

// 무료 회차 강조 스타일 ("3화 무료")
const FreeEpisodes = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
`;

// 콘텐츠 상태 뱃지 (연재중/완결 등) - 완결 여부에 따라 색상 변경
const ContentState = styled.span<{ $isCompleted: boolean }>`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: ${({ theme }) => theme.fonts.size.xs};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
  
  background-color: ${({ theme, $isCompleted }) => 
    $isCompleted ? theme.colors.text.light : theme.colors.primary};
  color: white;
`;

interface RankingItemProps {
  item: ComicRankItem;
  className?: string;
}

// 무한스크롤 시 기존 아이템들이 리렌더링되지 않도록 memo 추가
const RankingItem = memo(function RankingItem({ item, className }: RankingItemProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const {
    currentRank,
    previousRank,
    title,
    artists,
    schedule,
    freedEpisodeSize,
    contentsState,
    thumbnailSrc
  } = item;

  // writer, painter, scripter 역할의 작가들만 표시
  const displayArtists = artists.filter(artist => 
    ['writer', 'painter', 'scripter'].includes(artist.role)
  );

  const artistNames = displayArtists.map(artist => artist.name).join(', ');
  const scheduleText = getScheduleText(schedule.periods);
  const isCompleted = contentsState === 'completed';
  const stateText = getContentsStateText(contentsState);
  const freeEpisodeText = getFreeEpisodeText(freedEpisodeSize);

  // 이미지 클래스 결정
  const getImageClassName = () => {
    if (imageError) return 'error';
    if (imageLoaded) return 'loaded';
    return '';
  };

  return (
    <ItemContainer 
      role="article"
      className={className}
      aria-labelledby={`title-${item.id}`}
    >
      <Thumbnail>
        {/* 이미지 로딩 애니메이션 */}
        <ImagePlaceholder className={imageLoaded ? 'hide' : ''} />
        
        {thumbnailSrc && !imageError && (
          <ThumbnailImage 
            src={thumbnailSrc}
            alt={`${title} 웹툰 썸네일, ${artistNames} 작가, ${stateText}, ${freeEpisodeText}`}
            fill
            sizes="(max-width: 768px) 60px, 80px"
            style={{ objectFit: 'cover' }}
            className={getImageClassName()}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        {(!thumbnailSrc || imageError) && (
          <ThumbnailFallback aria-label="썸네일 로드 실패">
            준비중
          </ThumbnailFallback>
        )}
      </Thumbnail>
      
      <ContentArea>
        {/* 현재랭킹, 제목, 랭킹변동 */}
        <TopRow>
          <RankAndTitle>
            <RankNumber aria-label={`${currentRank}위`}>{currentRank}</RankNumber>
            <Title id={`title-${item.id}`}>{title}</Title>
          </RankAndTitle>
          <RankingStatus 
            currentRank={currentRank} 
            previousRank={previousRank}
          />
        </TopRow>
        
        {/* 작가명 */}
        {artistNames && (
          <Artists>{artistNames}</Artists>
        )}

        <MetaInfo>
          {/* 3화 무료, 연재중/완결 버튼 */}
          <InfoRow>
            <FreeEpisodes>{freeEpisodeText}</FreeEpisodes>
            <ContentState $isCompleted={isCompleted}>
              {stateText}
            </ContentState>
          </InfoRow>
          
          {/* 매주 월요일 연재 */}
          {!isCompleted && scheduleText && (
            <InfoRow>
              <span>{scheduleText}</span>
            </InfoRow>
          )}
        </MetaInfo>
      </ContentArea>
    </ItemContainer>
  );
});

export default RankingItem;
