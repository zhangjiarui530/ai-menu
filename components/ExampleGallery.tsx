import Image from 'next/image'
import { Card, CardContent } from "@/components/ui/card"

const exampleDishes = [
  { 
    name: "香煎三文鱼", 
    description: "完美煎制，搭配时令蔬菜", 
    imageUrl: "https://images.unsplash.com/photo-1485921325833-c519f76c4927?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "意大利面", 
    description: "al dente 口感，浓郁番茄酱汁", 
    imageUrl: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "巧克力熔岩蛋糕", 
    description: "浓郁巧克力，口感丝滑", 
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "缤纷水果沙拉", 
    description: "新鲜时令水果，营养美味", 
    imageUrl: "https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "香草烤鸡", 
    description: "外酥里嫩，香草飘香", 
    imageUrl: "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=800&q=80" 
  },
  { 
    name: "精致寿司拼盘", 
    description: "新鲜海鲜，精心摆盘", 
    imageUrl: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80" 
  },
]

const exampleTransformations = [
  {
    menuText: "蒜香黄油大虾\n新鲜大虾，搭配蒜香黄油酱汁，配以香草装饰",
    beforeImage: "/menu-text-1.png",
    afterImage: "https://images.unsplash.com/photo-1623595119708-26b1f7300075?auto=format&fit=crop&w=800&q=80",
    name: "蒜香黄油大虾",
    description: "鲜嫩多汁，蒜香四溢"
  },
  {
    menuText: "和牛牛排配松露酱\n顶级和牛，搭配黑松露酱汁，配以时令蔬菜",
    beforeImage: "/menu-text-2.png",
    afterImage: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    name: "和牛牛排配松露酱",
    description: "入口即化，香味浓郁"
  },
  {
    menuText: "抹茶提拉米苏\n抹茶与马斯卡彭奶酪的完美融合，层次丰富",
    beforeImage: "/menu-text-3.png",
    afterImage: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80",
    name: "抹茶提拉米苏",
    description: "层次分明，口感绝佳"
  }
]

export function ExampleGallery() {
  return (
    <div className="space-y-16">
      {/* 原有的菜单展示 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {exampleDishes.map((dish, index) => (
          <Card key={index} className="overflow-hidden transition-transform duration-300 hover:scale-105">
            <CardContent className="p-0">
              <div className="relative aspect-video">
                <Image
                  src={dish.imageUrl}
                  alt={dish.name}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{dish.name}</h3>
                <p className="text-sm text-muted-foreground">{dish.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 菜单转换案例 */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-8 text-center">菜单转换案例</h2>
        <div className="space-y-8">
          {exampleTransformations.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium mb-2">菜单文本</h4>
                    <p className="text-sm text-muted-foreground whitespace-pre-line">{item.menuText}</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <Image
                      src={item.afterImage}
                      alt={item.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-105"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h3 className="text-white font-semibold">{item.name}</h3>
                      <p className="text-white/80 text-sm">{item.description}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
