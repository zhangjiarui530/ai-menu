'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Menu } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="border-b sticky top-0 bg-background/80 backdrop-blur-sm z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold gradient-text">
          AI美食菜单生成器
        </Link>
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li><Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">特性</Link></li>
            <li><Link href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">案例展示</Link></li>
            <li><Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">定价方案</Link></li>
          </ul>
        </nav>
        <div className="hidden md:flex space-x-4">
          <Button variant="outline">登录</Button>
          <Button>免费试用</Button>
        </div>
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu />
        </button>
      </div>
      {isMenuOpen && (
        <div className="md:hidden p-4 bg-background border-t">
          <nav className="flex flex-col space-y-4">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">特性</Link>
            <Link href="#examples" className="text-muted-foreground hover:text-foreground transition-colors">案例展示</Link>
            <Link href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">定价方案</Link>
            <Button variant="outline" className="w-full">登录</Button>
            <Button className="w-full">免费试用</Button>
          </nav>
        </div>
      )}
    </header>
  )
}

