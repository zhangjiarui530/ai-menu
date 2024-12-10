'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Dish {
  name: string;
  price: string;
  description: string;
  category?: string;
  ingredients?: string[];
  spicyLevel?: string;
  isRecommended?: boolean;
}

interface RestaurantInfo {
  name: string;
  type: string;
  priceRange?: string;
  specialties?: string[];
  businessHours?: string;
}

interface AnalysisResult {
  dishes: Dish[];
  restaurantInfo: RestaurantInfo;
}

export default function MenuAnalyzer() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Analyze the menu
    setAnalyzing(true);
    setError(null);
    setResults(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/analyze-menu', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to analyze menu');
      }

      const data = await response.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '分析菜单时出错');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          上传菜单图片进行分析
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      {selectedImage && (
        <div className="mb-6 relative h-64 w-full">
          <Image
            src={selectedImage}
            alt="上传的菜单"
            fill
            className="object-contain"
          />
        </div>
      )}

      {analyzing && (
        <div className="text-center text-gray-600 my-4">
          正在分析菜单...
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-4">
          错误: {error}
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* 餐厅信息 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">餐厅信息</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">名称：</p>
                <p>{results.restaurantInfo.name}</p>
              </div>
              <div>
                <p className="font-semibold">类型：</p>
                <p>{results.restaurantInfo.type}</p>
              </div>
              {results.restaurantInfo.priceRange && (
                <div>
                  <p className="font-semibold">价格档次：</p>
                  <p>{results.restaurantInfo.priceRange}</p>
                </div>
              )}
              {results.restaurantInfo.businessHours && (
                <div>
                  <p className="font-semibold">营业时间：</p>
                  <p>{results.restaurantInfo.businessHours}</p>
                </div>
              )}
            </div>
            {results.restaurantInfo.specialties && (
              <div className="mt-4">
                <p className="font-semibold">特色菜品：</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {results.restaurantInfo.specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="bg-yellow-100 px-3 py-1 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 菜品列表 */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">菜品列表</h2>
            <div className="grid gap-6">
              {results.dishes.map((dish, index) => (
                <div
                  key={index}
                  className="border-b pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">
                      {dish.name}
                      {dish.isRecommended && (
                        <span className="ml-2 text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                          推荐
                        </span>
                      )}
                    </h3>
                    <span className="text-lg font-bold text-green-600">
                      {dish.price}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{dish.description}</p>
                  <div className="flex flex-wrap gap-2 text-sm">
                    {dish.category && (
                      <span className="bg-blue-100 px-2 py-1 rounded">
                        {dish.category}
                      </span>
                    )}
                    {dish.spicyLevel && (
                      <span className="bg-red-100 px-2 py-1 rounded">
                        辣度：{dish.spicyLevel}
                      </span>
                    )}
                  </div>
                  {dish.ingredients && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        主要食材：{dish.ingredients.join('、')}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
