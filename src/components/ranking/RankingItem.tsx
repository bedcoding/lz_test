'use client';

import React from 'react';
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
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    background: linear-gradient(
      135deg,
      transparent 40%,
      ${({ theme }) => theme.colors.text.light} 40%,
      ${({ theme }) => theme.colors.text.light} 60%,
      transparent 60%
    ),
    linear-gradient(
      45deg,
      transparent 40%,
      ${({ theme }) => theme.colors.text.light} 40%,
      ${({ theme }) => theme.colors.text.light} 60%,
      transparent 60%
    );
  }
  
  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    width: 60px;
    height: 75px;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.md};
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

export default function RankingItem({ item, className }: RankingItemProps) {
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

  return (
    <ItemContainer className={className}>
      <Thumbnail>
        {thumbnailSrc ? (
          <ThumbnailImage 
            src={thumbnailSrc} 
            alt={`${title} 썸네일`}
            onError={(e) => {
              // 이미지 로드 실패 시 기본 placeholder 표시
              e.currentTarget.style.display = 'none';
            }}
          />
        ) : null}
      </Thumbnail>
      
      <ContentArea>
        <TopRow>
          <RankAndTitle>
            <RankNumber>{currentRank}</RankNumber>
            <Title>{title}</Title>
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
}
