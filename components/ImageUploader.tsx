'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from './ui/card'
import { ImageIcon, Download, RefreshCw } from 'lucide-react'

interface Dish {
  name: string;
  price: string;
  description: string;
  mainIngredient?: string;
  cuisineType?: string;
  spicinessLevel?: string;
  isSignatureDish?: boolean;
  recommendedCombination?: string;
  isGeneratingImage?: boolean;
  generatedImageUrl?: string;
  isRegenerating?: boolean;
}

interface AnalysisResult {
  dishes: Dish[];
}

export function ImageUploader() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0]
      const imageUrl = URL.createObjectURL(file)
      setUploadedImage(imageUrl)
      setIsProcessing(true)
      setError(null)
      setAnalysisResult(null)
      
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/analyze-menu', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.error || '菜单分析失败');
        }

        if (!result.success || !result.data) {
          throw new Error('无效的响应格式');
        }

        setAnalysisResult(result.data);
      } catch (error) {
        console.error('分析菜单时出错:', error);
        setError(error instanceof Error ? error.message : '分析菜单时出错');
      } finally {
        setIsProcessing(false);
      }
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  })

  const handleGenerateImage = async (dish: Dish) => {
    try {
      setAnalysisResult(prev => ({
        ...prev!,
        dishes: prev!.dishes.map(d => 
          d === dish ? { ...d, isGeneratingImage: true, isRegenerating: !!d.generatedImageUrl } : d
        )
      }));

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dishName: dish.name,
          description: dish.description
        }),
      });

      const data = await response.json();
      console.log('Generate image response:', data);

      if (!response.ok) {
        throw new Error(data.error || '生成图片失败');
      }

      if (!data.success || !data.imageUrl) {
        throw new Error('Invalid response format');
      }

      console.log('Setting image URL:', data.imageUrl);

      setAnalysisResult(prev => {
        console.log('Previous state:', prev);
        const newDishes = prev!.dishes.map(d => 
          d.name === dish.name ? { 
            ...d, 
            isGeneratingImage: false,
            isRegenerating: false,
            generatedImageUrl: data.imageUrl 
          } : d
        );
        console.log('New dishes:', newDishes);
        return {
          ...prev!,
          dishes: newDishes
        };
      });

    } catch (error) {
      console.error('生成图片时出错:', error);
      setError(error instanceof Error ? error.message : '生成图片时出错');
      
      setAnalysisResult(prev => ({
        ...prev!,
        dishes: prev!.dishes.map(d => 
          d === dish ? { ...d, isGeneratingImage: false, isRegenerating: false } : d
        )
      }));
    }
  };

  // 添加一个下载图片的辅助函数
  const downloadImage = async (imageUrl: string, fileName: string) => {
    try {
      // 使用代理路由来下载图片
      const response = await fetch('/api/download-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('下载图片失败');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载图片时出错:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-8">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        {uploadedImage ? (
          <div className="relative aspect-video w-full max-w-2xl mx-auto">
            <Image
              src={uploadedImage}
              alt="上传的菜单图片"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="py-8">
            <ImageIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg mb-2">拖放菜单图片到这里，或点击选择图片</p>
            <p className="text-sm text-muted-foreground">支持 JPG, JPEG, PNG 格式</p>
          </div>
        )}
      </div>

      {isProcessing && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>正在分析菜单...</p>
        </div>
      )}

      {error && (
        <div className="text-red-600 mb-4 text-center">
          {error}
        </div>
      )}

      {analysisResult && (
        <div className="space-y-6">
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4">菜品列表</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analysisResult.dishes.map((dish, index) => (
                  <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-semibold">{dish.name}</h3>
                          {dish.isSignatureDish && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                              招牌菜
                            </span>
                          )}
                        </div>
                        <p className="text-lg font-medium text-primary mt-1">{dish.price}</p>
                      </div>
                      {dish.cuisineType && (
                        <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {dish.cuisineType}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3">{dish.description}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm">
                      {dish.mainIngredient && (
                        <span className="text-gray-600">
                          主料：{dish.mainIngredient}
                        </span>
                      )}
                      
                      {dish.spicinessLevel && (
                        <span className="text-orange-600">
                          辣度：{dish.spicinessLevel}
                        </span>
                      )}

                      {dish.recommendedCombination && dish.recommendedCombination !== '' && (
                        <span className="text-green-600">
                          推荐搭配：{dish.recommendedCombination}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-4">
                      {!dish.generatedImageUrl && (
                        <button
                          onClick={() => handleGenerateImage(dish)}
                          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors flex items-center gap-2"
                          disabled={dish.isGeneratingImage}
                        >
                          {dish.isGeneratingImage ? (
                            <>
                              <RefreshCw className="w-4 h-4 animate-spin" />
                              生成中...
                            </>
                          ) : (
                            <>
                              <ImageIcon className="w-4 h-4" />
                              生成菜品图片
                            </>
                          )}
                        </button>
                      )}
                      
                      {dish.generatedImageUrl && (
                        <div className="mt-4 space-y-4">
                          <div className="relative aspect-square w-full max-w-sm mx-auto group">
                            <Image
                              src={dish.generatedImageUrl}
                              alt={dish.name}
                              fill
                              className="object-cover rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-4">
                              <a
                                href={dish.generatedImageUrl}
                                download={`${dish.name}.jpg`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await downloadImage(dish.generatedImageUrl!, `${dish.name}.jpg`);
                                  } catch (error) {
                                    setError(error instanceof Error ? error.message : '下载图片失败');
                                  }
                                }}
                              >
                                <Download className="w-6 h-6" />
                              </a>
                              <button
                                onClick={() => handleGenerateImage(dish)}
                                disabled={dish.isRegenerating}
                                className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                              >
                                <RefreshCw className={`w-6 h-6 ${dish.isRegenerating ? 'animate-spin' : ''}`} />
                              </button>
                            </div>
                          </div>
                          <div className="flex justify-center gap-4">
                            <button
                              onClick={() => handleGenerateImage(dish)}
                              className="flex items-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-4 py-2 rounded-md transition-colors"
                              disabled={dish.isRegenerating}
                            >
                              <RefreshCw className={`w-4 h-4 ${dish.isRegenerating ? 'animate-spin' : ''}`} />
                              重新生成
                            </button>
                            <a
                              href={dish.generatedImageUrl}
                              download={`${dish.name}.jpg`}
                              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md transition-colors"
                              onClick={async (e) => {
                                e.preventDefault();
                                try {
                                  await downloadImage(dish.generatedImageUrl!, `${dish.name}.jpg`);
                                } catch (error) {
                                  setError(error instanceof Error ? error.message : '下载图片失败');
                                }
                              }}
                            >
                              <Download className="w-4 h-4" />
                              下载图片
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-center">
            <button
              onClick={() => {
                if (uploadedImage) {
                  setIsProcessing(true);
                  setError(null);
                  
                  // 重新创建 FormData
                  const formData = new FormData();
                  fetch(uploadedImage)
                    .then(res => res.blob())
                    .then(blob => {
                      formData.append('file', new File([blob], 'menu.jpg', { type: 'image/jpeg' }));
                      
                      // 重新调用分析 API
                      return fetch('/api/analyze-menu', {
                        method: 'POST',
                        body: formData,
                      });
                    })
                    .then(response => response.json())
                    .then(result => {
                      if (!result.success || !result.data) {
                        throw new Error('无效的响应格式');
                      }
                      setAnalysisResult(result.data);
                    })
                    .catch(error => {
                      console.error('重新分析菜单时出错:', error);
                      setError(error instanceof Error ? error.message : '重新分析菜单失败');
                    })
                    .finally(() => {
                      setIsProcessing(false);
                    });
                }
              }}
              className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-md transition-colors"
              disabled={isProcessing}
            >
              <RefreshCw className={`w-5 h-5 ${isProcessing ? 'animate-spin' : ''}`} />
              {isProcessing ? '重新分析中...' : '重新分析菜单'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
