import Image from 'next/image'

const testimonials = [
  {
    quote: "AI美食菜单生成器彻底改变了我们的菜单设计方式，节省了大量时间和成本。",
    author: "张明",
    role: "米其林星级餐厅主厨",
    avatar: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "生成的菜品图片质量超乎想象，我们的顾客反响非常积极。",
    author: "李娜",
    role: "新锐餐厅老板",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80"
  },
  {
    quote: "这个工具让我们的菜单更具创意和吸引力，强烈推荐给所有餐饮业者。",
    author: "王强",
    role: "连锁餐厅经理",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80"
  }
]

export function Testimonials() {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center">客户反馈</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-background p-6 rounded-lg shadow-md">
              <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
              <div className="flex items-center">
                <Image
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  width={50}
                  height={50}
                  className="rounded-full mr-4"
                />
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

