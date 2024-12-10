'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useDropzone } from 'react-dropzone'
import { Upload, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { uploadAndProcessImage } from '@/app/actions/menuActions'

export function Uploader() {
  const [isUploading, setIsUploading] = useState(false)
  const router = useRouter()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setIsUploading(true)
    try {
      for (const file of acceptedFiles) {
        await uploadAndProcessImage(file)
      }
      router.refresh()
    } catch (error) {
      console.error('Error processing image:', error)
    } finally {
      setIsUploading(false)
    }
  }, [router])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardContent>
        <div
          {...getRootProps()}
          className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
            isDragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          }`}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
          )}
          <p className="mt-4 text-sm text-muted-foreground">
            {isUploading ? '正在生成精美菜单...' : '拖拽您的菜品照片到这里，或点击上传'}
          </p>
          <p className="mt-2 text-xs text-muted-foreground">支持 JPG、PNG 格式，最大 5MB</p>
          <Button disabled={isUploading} className="mt-4">
            {isUploading ? '处理中...' : '开始创作菜单'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

