import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: '图片URL不能为空' },
        { status: 400 }
      );
    }

    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error('获取图片失败');
    }

    const blob = await response.blob();
    const headers = new Headers();
    headers.set('Content-Type', blob.type);
    headers.set('Content-Disposition', `attachment; filename="image.jpg"`);

    return new NextResponse(blob, {
      status: 200,
      headers,
    });

  } catch (error) {
    console.error('下载图片时出错:', error);
    return NextResponse.json(
      { error: '下载图片失败' },
      { status: 500 }
    );
  }
} 