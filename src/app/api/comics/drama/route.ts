import { NextRequest, NextResponse } from 'next/server';
import { ComicRankApiSuccessResponse, ComicRankApiFailResponse, ComicRankItem, RawComicItem } from '@/types/ranking';
import fs from 'fs';
import path from 'path';

// JSON 데이터를 API Interface 명세에 맞게 변환
function transformToApiInterface(item: RawComicItem): ComicRankItem {
  return {
    id: item.id,
    alias: item.alias,
    title: item.title,
    artists: item.artists.map((artist) => ({
      name: artist.name,
      role: artist.role,
      id: artist.id
    })),
    schedule: {
      periods: item.schedule.periods
    },
    genres: item.genres,
    freedEpisodeSize: item.freedEpisodeSize,
    contentsState: item.contentsState,
    currentRank: item.currentRank,
    previousRank: item.previousRank,
    updatedAt: item.updatedAt,
    print: item.isPrint, // isPrint → print 변환
    thumbnailSrc: item.thumbnailSrc
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    
    // 페이지 번호 검증 (1 이상의 자연수)
    const pageNumber = parseInt(page);
    if (isNaN(pageNumber) || pageNumber < 1) {
      const errorResponse: ComicRankApiFailResponse = {
        error: 'Invalid page number. Page must be a positive integer.'
      };
      return NextResponse.json(errorResponse, { status: 400 });
    }

    // 실제 데이터 파일 경로
    const dataPath = path.join(process.cwd(), 'data', 'drama', `page_${pageNumber}.json`);
    
    // 파일 존재 여부 확인
    if (!fs.existsSync(dataPath)) {
      const errorResponse: ComicRankApiFailResponse = {
        error: `Page ${pageNumber} not found`
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // 파일 읽기
    const fileContent = fs.readFileSync(dataPath, 'utf-8');
    const rawData = JSON.parse(fileContent);

    // JSON 데이터를 API Interface 명세에 맞게 변환
    const pageData: ComicRankApiSuccessResponse = {
      hasNext: rawData.hasNext,
      count: rawData.count,
      data: rawData.data.map(transformToApiInterface)
    };

    return NextResponse.json(pageData);
  } catch (error) {
    console.error('API Error:', error);
    const errorResponse: ComicRankApiFailResponse = {
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
