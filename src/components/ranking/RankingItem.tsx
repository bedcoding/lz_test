'use client';

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

const ItemContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
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

const Thumbnail = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 100px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  position: relative;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 60px;
    height: 75px;
  }
`;

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

const ContentArea = styled.div`
  flex: 1;
  min-width: 0;
`;

const TopRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const RankAndTitle = styled.div`
  flex: 1;
  min-width: 0;
`;

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

const Title = styled.h3`
  display: inline;
  font-size: ${({ theme }) => theme.fonts.size.lg};
  font-weight: ${({ theme }) => theme.fonts.weight.semibold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
  line-height: 1.4;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    font-size: ${({ theme }) => theme.fonts.size.base};
  }
`;

const Artists = styled.p`
  font-size: ${({ theme }) => theme.fonts.size.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: ${({ theme }) => theme.spacing.xs} 0;
  line-height: 1.4;
`;

const MetaInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

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

const FreeEpisodes = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: ${({ theme }) => theme.fonts.weight.medium};
`;

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
        
        {artistNames && (
          <Artists>{artistNames}</Artists>
        )}
        
        <MetaInfo>
          <InfoRow>
            <FreeEpisodes>{freeEpisodeText}</FreeEpisodes>
            <ContentState $isCompleted={isCompleted}>
              {stateText}
            </ContentState>
          </InfoRow>
          
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
