'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { AI, UIState } from '@/app/actions'
import { useUIState, useActions, useAIState } from 'ai/rsc'
import { cn } from '@/lib/utils'
import { UserMessage } from './user-message'
import { Button } from './ui/button'
import { ArrowRight, Plus } from 'lucide-react'
import { EmptyScreen } from './empty-screen'
import Textarea from 'react-textarea-autosize'
import { generateId } from 'ai'
import { useAppState } from '@/lib/utils/app-state'
import { Label } from './ui/label' // Импортируем компонент Label
import { Popover, PopoverContent, PopoverTrigger } from './popover'
import { ChevronDown } from 'lucide-react'

const exampleMessages = [
  {
    heading: 'Поиск информации',
    message: 'Расскажи о последних достижениях в области квантовых вычислений'
  },
  {
    heading: 'Саммари страницы',
    message: 'Сделай краткое содержание статьи: https://ru.wikipedia.org/wiki/Черкесия'
  },
  {
    heading: 'Поиск видео',
    message: 'Найди видео о том, как приготовить итальянскую пасту карбонара'
  },
  {
    heading: 'Анализ текста',
    message: 'Проанализируй основные темы  книге "1984" Джорджа Оруэлла'
  }
]

interface ChatPanelProps {
  messages: UIState
  query?: string
}

export function ChatPanel({ messages, query }: ChatPanelProps) {
  const [input, setInput] = useState('')
  const [showEmptyScreen, setShowEmptyScreen] = useState(false)
  const [, setMessages] = useUIState<typeof AI>()
  const [aiMessage, setAIMessage] = useAIState<typeof AI>()
  const { isGenerating, setIsGenerating } = useAppState()
  const { submit } = useActions()
  const router = useRouter()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const isFirstRender = useRef(true) // For development environment

  const [selectedCategory, setSelectedCategory] = useState('')
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const categories = [
    { name: 'All', value: '' },
    { name: 'Company', value: 'Company' },
    { name: 'Research Paper', value: 'Research Paper' },
    { name: 'News Article', value: 'News Article' },
    { name: 'PDF', value: 'PDF' },
    { name: 'Github', value: 'Github' },
    { name: 'Tweet', value: 'Tweet' },
    { name: 'Movie', value: 'Movie' },
    { name: 'Song', value: 'Song' },
    { name: 'Personal Site', value: 'Personal Site' }
  ]

  async function handleQuerySubmit(query: string, formData?: FormData) {
    setInput(query)
    setIsGenerating(true)

    // Add user message to UI state
    setMessages(currentMessages => [
      ...currentMessages,
      {
        id: generateId(),
        component: <UserMessage message={query} />
      }
    ])

    // Submit and get response message
    const data = formData || new FormData()
    if (!formData) {
      data.append('input', query)
    }
    // Убедитесь, что категория добавлена в data
    if (!data.has('category')) {
      data.append('category', selectedCategory)
    }
    console.log("Category being sent:", data.get('category'))
    console.log("All form data:", Object.fromEntries(data.entries()))
    const responseMessage = await submit(data)
    setMessages(currentMessages => [...currentMessages, responseMessage])
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    formData.append('category', selectedCategory)
    console.log("Submitting with category:", selectedCategory)
    console.log("FormData before submit:", Object.fromEntries(formData.entries()))
    const responseMessage = await submit(formData)
    console.log("Response received")
    setMessages(currentMessages => [...currentMessages, responseMessage])
  }

  // if query is not empty, submit the query
  useEffect(() => {
    if (isFirstRender.current && query && query.trim().length > 0) {
      handleQuerySubmit(query)
      isFirstRender.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  useEffect(() => {
    const lastMessage = aiMessage.messages.slice(-1)[0]
    if (lastMessage?.type === 'followup' || lastMessage?.type === 'inquiry') {
      setIsGenerating(false)
    }
  }, [aiMessage, setIsGenerating])

  // Clear messages
  const handleClear = () => {
    setIsGenerating(false)
    setMessages([])
    setAIMessage({ messages: [], chatId: '' })
    setInput('')
    router.push('/')
  }

  useEffect(() => {
    // focus on input when the page loads
    inputRef.current?.focus()
  }, [])

  // If there are messages and the new button has not been pressed, display the new Button
  if (messages.length > 0) {
    return (
      <div className="fixed bottom-2 md:bottom-8 left-0 right-0 flex justify-center items-center mx-auto pointer-events-none">
        <Button
          type="button"
          variant={'secondary'}
          className="rounded-full bg-secondary/80 group transition-all hover:scale-105 pointer-events-auto"
          onClick={() => handleClear()}
          disabled={isGenerating}
        >
          <span className="text-sm mr-2 group-hover:block hidden animate-in fade-in duration-300">
            New
          </span>
          <Plus size={18} className="group-hover:rotate-90 transition-all" />
        </Button>
      </div>
    )
  }

  if (query && query.trim().length > 0) {
    return null
  }

  return (
    <div className={'fixed bottom-8 left-0 right-0 top-10 mx-auto h-screen flex flex-col items-center justify-center'}>
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Поиск, который понимает вас.</h1>
        <p className="text-xl text-muted-foreground">Задайте вопрос или выберите пример ниже</p>
      </div>
      <div className="max-w-3xl w-full px-6">
        <div className="grid grid-cols-2 gap-4 mb-4">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 text-left flex flex-col items-start space-y-2 bg-background hover:bg-secondary/80"
              onClick={() => setInput(message.message)}
            >
              <div className="flex items-center">
                <ArrowRight className="mr-2 h-4 w-4" />
                <span className="font-medium">{message.heading}</span>
              </div>
              <p className="text-sm text-muted-foreground w-full break-words overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {message.message}
              </p>
            </Button>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="relative flex items-center w-full">
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={isPopoverOpen}
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 h-8 w-auto px-2 text-xs"
                >
                  {selectedCategory || 'All'}
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <div className="flex flex-col">
                  {categories.map((category) => (
                    <Button
                      key={category.value}
                      variant="ghost"
                      onClick={() => {
                        setSelectedCategory(category.value)
                        setIsPopoverOpen(false)
                      }}
                      className="justify-start"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            <Textarea
              ref={inputRef}
              name="input"
              rows={1}
              maxRows={5}
              tabIndex={0}
              placeholder="Задайте вопрос..."
              spellCheck={false}
              value={input}
              className="resize-none w-full min-h-12 rounded-full bg-muted border border-input pl-24 pr-10 pt-3 pb-1 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              onChange={e => {
                setInput(e.target.value)
                setShowEmptyScreen(e.target.value.length === 0)
              }}
              onKeyDown={e => {
                // Enter should submit the form
                if (
                  e.key === 'Enter' &&
                  !e.shiftKey &&
                  !e.nativeEvent.isComposing
                ) {
                  // Prevent the default action to avoid adding a new line
                  if (input.trim().length === 0) {
                    e.preventDefault()
                    return
                  }
                  e.preventDefault()
                  const textarea = e.target as HTMLTextAreaElement
                  textarea.form?.requestSubmit()
                }
              }}
              onHeightChange={height => {
                // Ensure inputRef.current is defined
                if (!inputRef.current) return

                // The initial height and left padding is 70px and 2rem
                const initialHeight = 70
                // The initial border radius is 32px
                const initialBorder = 32
                // The height is incremented by multiples of 20px
                const multiple = (height - initialHeight) / 20

                // Decrease the border radius by 4px for each 20px height increase
                const newBorder = initialBorder - 4 * multiple
                // The lowest border radius will be 8px
                inputRef.current.style.borderRadius =
                  Math.max(8, newBorder) + 'px'
              }}
              onFocus={() => setShowEmptyScreen(true)}
              onBlur={() => setShowEmptyScreen(false)}
            />
            <Button
              type="submit"
              size={'icon'}
              variant={'ghost'}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              disabled={input.length === 0}
            >
              <ArrowRight size={20} />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
