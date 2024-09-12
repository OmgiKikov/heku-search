'use client'

import { cn } from '@/lib/utils'

function IconLogo({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      width="480" height="480" // Увеличенные размеры
      viewBox="0 0 160 160" // Вьюпорт остается прежним для сохранения пропорций
      fill="none" xmlns="http://www.w3.org/2000/svg"
      className={cn('h-12 w-12', className)} // Увеличенные размеры классов для Tailwind CSS
      {...props}
    >
      <rect width="160" height="160" fill="#101828"/>
      <path d="M56.8632 24L29 44.7123V135.616H103.824L132 116.055V24H56.8632Z" fill="url(#paint0_linear_109_6010)" stroke="white" stroke-width="0.5"/>
      <path d="M103.51 44.7124H56.8632V116.055H103.51V44.7124Z" fill="url(#paint1_linear_109_6010)"/>
      <path d="M29 44.7124H103.51M103.51 44.7124V136M103.51 44.7124L131.687 24.3836M56.8632 24.3836V116.055M56.8632 116.055L29.3131 135.233M56.8632 116.055H131.687" stroke="white" stroke-width="0.5"/>
      <defs>
        <linearGradient id="paint0_linear_109_6010" x1="29" y1="24" x2="131.314" y2="119.485" gradientUnits="userSpaceOnUse">
          <stop stop-color="white"/>
          <stop offset="0.0001" stop-color="#FFE3E3"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="paint1_linear_109_6010" x1="56.8632" y1="47.0137" x2="96.7339" y2="88.5787" gradientUnits="userSpaceOnUse">
          <stop stop-color="#FFF7F7"/>
          <stop offset="1" stop-color="white" stop-opacity="0"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

export { IconLogo }
