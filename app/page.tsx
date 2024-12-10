import { Header } from '@/components/Header'
import { ImageUploader } from '@/components/ImageUploader'
import { ExampleGallery } from '@/components/ExampleGallery'
import { Features } from '@/components/Features'
import { Testimonials } from '@/components/Testimonials'
import { Footer } from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <section className="hero-pattern py-20 md:py-32">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">AI美食菜单生成器</h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground max-w-3xl mx-auto">
              将您的美食创意转化为视觉盛宴，提升餐厅形象，吸引更多顾客
            </p>
            <ImageUploader />
          </div>
        </section>
        
        <Features />
        
        <section className="py-20 bg-muted" id="examples">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-12 text-center">精美菜单案例</h2>
            <ExampleGallery />
          </div>
        </section>
        
        <Testimonials />
      </main>
      <Footer />
    </div>
  )
}
