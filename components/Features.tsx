import { Lightbulb, Image, Zap } from 'lucide-react'

const features = [
  {
    icon: <Lightbulb className="h-8 w-8 text-yellow-500" />,
    title: "AI驱动创意",
    description: "我们的AI能理解您的菜品特色，生成独特而吸引人的菜单描述。"
  },
  {
    icon: <Image className="h-8 w-8 text-blue-500" />,
    title: "高质量图像",
    description: "利用先进的图像生成技术，为每道菜品创造精美的视觉呈现。"
  },
  {
    icon: <Zap className="h-8 w-8 text-green-500" />,
    title: "快速高效",
    description: "只需几秒钟，即可生成专业水准的菜单，节省您的时间和精力。"
  }
]

export function Features() {
  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">为什么选择我们</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-6 bg-muted rounded-lg">
              {feature.icon}
              <h3 className="text-xl font-semibold mt-4 mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

