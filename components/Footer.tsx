import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-muted py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-bold mb-4">AI美食菜单生成器</h3>
            <p className="text-sm text-muted-foreground">让您的菜单更具吸引力</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">快速链接</h4>
            <ul className="space-y-2">
              <li><Link href="#features" className="text-sm text-muted-foreground hover:text-foreground">特性</Link></li>
              <li><Link href="#examples" className="text-sm text-muted-foreground hover:text-foreground">案例展示</Link></li>
              <li><Link href="#pricing" className="text-sm text-muted-foreground hover:text-foreground">定价方案</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">联系我们</h4>
            <ul className="space-y-2">
              <li><a href="mailto:support@aimenu.com" className="text-sm text-muted-foreground hover:text-foreground">support@aimenu.com</a></li>
              <li><p className="text-sm text-muted-foreground">电话：400-123-4567</p></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">关注我们</h4>
            <div className="flex space-x-4">
              {/* Add social media icons here */}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-muted-foreground/10 text-center">
          <p className="text-sm text-muted-foreground">&copy; 2024 AI美食菜单生成器. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  )
}

