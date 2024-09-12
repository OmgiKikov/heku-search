'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg"
      className={cn('h-4 w-4', className)}
      {...props}
    >
      <path opacity="0.7" d="M36.2114 55.7955C38.4539 48.1249 47.0555 40.2401 55.4235 38.1845L107.593 25.3685C115.961 23.3129 120.927 27.8647 118.685 35.5354L104.704 83.3579C102.461 91.0286 93.8594 98.9133 85.4914 100.969L33.3215 113.785C24.9535 115.841 19.9878 111.289 22.2304 103.618L36.2114 55.7955Z" fill="#FBBC04"/>
      <path d="M15.2968 36.6234C17.5394 28.9527 26.1409 21.068 34.5089 19.0123L86.6789 6.19638C95.0469 4.14072 100.013 8.69259 97.77 16.3633L83.789 64.1857C81.5465 71.8564 72.9449 79.7412 64.5769 81.7968L12.407 94.6128C4.03896 96.6684 -0.926719 92.1166 1.31582 84.4459L15.2968 36.6234Z" fill="#FBBC04"/>
      <text x="130" y="60" fill="white" font-size="20" font-family="Arial" dominant-baseline="middle" text-anchor="start">Heku</text>  // Текст "Heku" добавлен справа от логотипа
    </svg>
  )
}

export { IconLogo }