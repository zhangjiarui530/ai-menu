'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addDish } from '../actions/menuActions'

export default function AddDishForm() {
  const [dishName, setDishName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await addDish(dishName)
      setDishName('')
      router.refresh()
    } catch (error) {
      console.error('Error adding dish:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
        placeholder="输入菜品名称"
        required
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? '正在生成...' : '添加菜品'}
      </Button>
    </form>
  )
}

