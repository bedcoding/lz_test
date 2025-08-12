import { NextRequest, NextResponse } from 'next/server';
import { ComicRankApiSuccessResponse, ComicRankApiFailResponse } from '@/types/ranking';
import fs from 'fs';
import path from 'path';

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
    const pageData: ComicRankApiSuccessResponse = JSON.parse(fileContent);

    return NextResponse.json(pageData);
  } catch (error) {
    console.error('API Error:', error);
    const errorResponse: ComicRankApiFailResponse = {
      error: 'Internal server error'
    };
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
