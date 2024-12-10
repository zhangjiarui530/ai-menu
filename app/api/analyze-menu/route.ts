import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const ZHIPU_API_KEY = process.env.ZHIPU_API_KEY;
const API_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

// 定义菜品schema
const menuAnalysisSchema = z.object({
  dishes: z.array(z.object({
    name: z.string(),
    price: z.string(),
    description: z.string(),
    mainIngredient: z.string().optional(),
    cuisineType: z.string().optional(),
    spicinessLevel: z.string().optional(),
    isSignatureDish: z.union([z.boolean(), z.string()]).transform(val => 
      typeof val === 'string' ? val === '是' : val
    ),
    recommendedCombination: z.string().optional(),
  })).transform(dishes => 
    dishes.filter(dish => typeof dish === 'object')  // 过滤掉非对象项
  )
});

// 生成 JWT token 的函数
async function generateToken(apiKey: string) {
  const [id, secret] = apiKey.split('.');
  
  if (!id || !secret) {
    throw new Error('Invalid API key format');
  }

  const timestamp = Math.floor(Date.now() / 1000);
  const payload = {
    api_key: id,
    exp: timestamp + 3600,
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
      secret,
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
    if (!ZHIPU_API_KEY) {
      throw new Error('API key not configured');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: '请上传菜单图片' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // 生成token
    const token = await generateToken(ZHIPU_API_KEY);
    console.log('Token generated:', token.substring(0, 20) + '...');

    // 调用智谱AI API
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        model: 'glm-4v',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `请仔细分析这张菜单图片，选取最多8个主要菜品进行分析，对每个菜品提取以下信息：

- 菜品名称 (name)：原始菜名
- 价格 (price)：保持原始价格格式
- 描述 (description)：用20-40字简要描述菜品的特点、口感和烹饪方法
- 主要食材 (mainIngredient)：列出2-3种主要食材
- 菜系类型 (cuisineType)：如川菜、粤菜等
- 辣度等级 (spicinessLevel)：分为不辣、微辣、中辣、特辣
- 是否为招牌菜 (isSignatureDish)：根据菜单标注或菜品特点，用"是"或"否"表示
- 推荐搭配 (recommendedCombination)：建议搭配的其他菜品或饮品，如果没有明显搭配则返回空字符串

请以JSON格式返回，确保每个菜品的信息完整，格式如下：
{
  "dishes": [
    {
      "name": "菜品名称",
      "price": "价格",
      "description": "精炖文火慢煨，肉质鲜嫩，汤汁浓郁，配以特制酱料，口感层次丰富。",
      "mainIngredient": "猪肉、竹笋、香菇",
      "cuisineType": "川菜",
      "spicinessLevel": "中辣",
      "isSignatureDish": "是",
      "recommendedCombination": "配以米饭或馒头"
    }
  ]
}

注意：
1. 描��要具体且生动，突出菜品特色
2. 每个字段都必须填写，没有相关信息时使用合理的推测
3. 确保返回的是标准JSON格式
4. 所有文本使用中文`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:${file.type};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        temperature: 0.7,
        top_p: 0.7,
        response_format: { type: "json_object" }
      })
    });

    console.log('Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`API request failed: ${response.status} - ${errorText}`);
    }

    const responseText = await response.text();
    console.log('Raw API Response:', responseText);

    if (!responseText) {
      throw new Error('Empty response from API');
    }

    const result = JSON.parse(responseText);
    let content = result.choices?.[0]?.message?.content;
    
    // 处理被截断的 JSON
    if (content) {
      try {
        // 尝试修复被截断的 JSON
        if (!content.endsWith('}]}')) {
          // 找到最后一个完整的菜品对象
          const lastValidBrace = content.lastIndexOf('},');
          if (lastValidBrace !== -1) {
            content = content.substring(0, lastValidBrace + 1) + ']}';
          }
        }
        
        const contentData = typeof content === 'string' ? JSON.parse(content) : content;
        
        // 只保留前8个菜品
        if (contentData.dishes && Array.isArray(contentData.dishes)) {
          contentData.dishes = contentData.dishes
            .filter(dish => typeof dish === 'object' && dish !== null)
            .slice(0, 8);
        }
        
        console.log('Processed content data:', contentData);
        const parsedContent = menuAnalysisSchema.parse(contentData);
        
        return NextResponse.json({
          success: true,
          data: parsedContent
        });
      } catch (parseError) {
        console.error('Parse error:', parseError);
        console.error('Content that failed to parse:', content);
        throw new Error('解析返回数据失败');
      }
    } else {
      throw new Error('未能获取到分析结果');
    }

  } catch (error) {
    console.error('分析菜单时出错:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : '菜单分析失败'
      },
      { status: 500 }
    );
  }
}
