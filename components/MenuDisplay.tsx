import Image from 'next/image'
import { getDishes, regenerateDishImage } from '@/app/actions/menuActions'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download, RefreshCw } from 'lucide-react'

export async function MenuDisplay() {
  const dishes = await getDishes()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {dishes.map((dish) => (
        <Card key={dish.id} className="overflow-hidden transition-transform duration-300 hover:scale-105">
          <CardHeader>
            <CardTitle>{dish.name}</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative aspect-video">
              <Image
                src={dish.imageUrl}
                alt={dish.name}
                layout="fill"
                objectFit="cover"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between mt-4">
            <form action={regenerateDishImage}>
              <input type="hidden" name="dishId" value={dish.id} />
              <Button type="submit" variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                重新生成
              </Button>
            </form>
            <Button variant="outline" size="sm" asChild>
              <a href={dish.imageUrl} download={`${dish.name}.jpg`}>
                <Download className="h-4 w-4 mr-2" />
                下载
              </a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}

