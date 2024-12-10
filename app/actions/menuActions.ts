'use server'

import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'
import { revalidatePath } from 'next/cache'

type Dish = {
  id: string
  name: string
  imageUrl: string
}

let dishes: Dish[] = []

export async function uploadAndProcessImage(file: File) {
  // 这里应该实现图片上传到服务器的逻辑
  // 然后使用 AI 识别图片中的菜品
  // 为了演示，我们假设 AI 识别出了菜品名称
  const dishName = `AI识别的菜品 ${Date.now()}`
  
  // 生成图片
  await generateDishImage(dishName)
}

async function generateDishImage(name: string) {
  try {
    const prompt = `Generate a realistic image of the dish: ${name}`
    const { text: imageUrl } = await generateText({
      model: openai('dall-e-3'),
      prompt: prompt,
    })

    const newDish: Dish = {
      id: Date.now().toString(),
      name,
      imageUrl,
    }

    dishes.push(newDish)
    revalidatePath('/')
  } catch (error) {
    console.error('Error generating image:', error)
    throw new Error('Failed to generate dish image')
  }
}

export async function getDishes(): Promise<Dish[]> {
  return dishes
}

export async function regenerateDishImage(formData: FormData) {
  const dishId = formData.get('dishId') as string
  const dish = dishes.find(d => d.id === dishId)
  if (dish) {
    await generateDishImage(dish.name)
  }
  revalidatePath('/')
}

