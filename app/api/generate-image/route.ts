import { NextRequest, NextResponse } from 'next/server';
import { setTimeout } from 'timers/promises';

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/images/generations';

// 添加重试函数
async function fetchWithRetry(url: string, options: RequestInit, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
      }
      return response;
    } catch (error) {
      console.error(`Attempt ${i + 1} failed:`, error);
      if (i === retries - 1) throw error;
      await setTimeout(delay * (i + 1)); // 递增延迟
    }
  }
}

// 生成 JWT token 的函数
async function generateToken(apiKey: string) {
  const [id, secret] = apiKey.split('.');
  
  if (!id || !secret) {
    throw new Error('Invalid API key format');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    api_key: id,
    exp: timestamp + 3600,  // 1小时后过期
    timestamp,
  };

  const header = {
    alg: 'HS256',
    sign_type: 'SIGN'
  };

  return new Promise<string>((resolve, reject) => {
    const jwt = require('jsonwebtoken');
    jwt.sign(
      payload,
      secret,  // 使用原始 secret
      { 
        algorithm: 'HS256',
        header
      },
      (err: any, token: string) => {
        if (err) reject(err);
        else resolve(token);
      }
    );
  });
}

export async function POST(req: NextRequest) {
  try {
    const { dishName, description } = await req.json();

    if (!dishName) {
      return NextResponse.json(
        { error: '菜品名称不能为空' },
        { status: 400 }
      );
    }

    if (!ZHIPU_API_KEY) {
      throw new Error('API key not configured');
    }

    const token = await generateToken(ZHIPU_API_KEY);

    // 构建提示词
    const prompt = `一道精美的${dishName}，${description || ''}, 
      专业美食摄影，高分辨率，餐厅菜单风格，白色背景，俯视角度，
      诱人可口，专业打光，4K，细节丰富`;

    const response = await fetchWithRetry(
      API_URL,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          model: 'cogview-3',
          prompt: prompt,
          n: 1,
          size: '1024x1024',
          quality: 'standard',
          style: 'natural',
          response_format: 'url'
        }),
      },
      3,
      1000
    );

    const data = await response.json();
    console.log('Image generation response:', data);

    // 从响应中提取图片 URL
    const imageUrl = data.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error('未能获取到生成的图片 URL');
    }

    return NextResponse.json({
      success: true,
      imageUrl: imageUrl
    });

  } catch (error) {
    console.error('生成图片时出错:', error);
    let errorMessage = '生成图片失败';
    
    if (error instanceof Error) {
      if (error.message.includes('ECONNRESET')) {
        errorMessage = '网络连接被重置，请重试';
      } else if (error.message.includes('timeout')) {
        errorMessage = '请求超时，请重试';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
