import { Chat } from '@/components/chat'
import { generateId } from 'ai'
import { AI } from './actions'
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

export const maxDuration = 60

export default function Page() {
  const id = generateId()
  return (
    <>
      <Analytics />  
      <SpeedInsights />  
      <AI initialAIState={{ chatId: id, messages: [] }}>
        <Chat id={id} />
      </AI>
    </>
  )
}
