'use client'

import { useState, useRef, useEffect, memo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  MessageSquare, 
  X, 
  Send, 
  Sparkles, 
  Loader2,
  User,
  Bot,
  TrendingUp,
  AlertCircle,
  ChevronDown,
  Maximize2,
  Minimize2,
  BarChart3,
  FileText,
  Lightbulb
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useStore } from '@/lib/store'
import { usePathname, useRouter } from 'next/navigation'
import { executeActions, createDefaultHandlers } from '@/lib/ai/chat-actions'
import { prepareEnhancedContext } from '@/lib/ai/chat-data-fetcher'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    action?: string
    data?: any
  }
}

interface AIChatProps {
  className?: string
}

const AIChatComponent = ({ className }: AIChatProps) => {
  const pathname = usePathname()
  const activeView = useStore((state) => state.activeView)
  
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 I can help you:\n\n• Analyze your biggest challenges and opportunities\n• Generate executive summaries and recommendations\n• Compare departments, regions, and time periods\n• Design specific interventions with ROI estimates\n• Navigate to detailed views and apply filters\n\nWhat would you like to explore?",
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const router = useRouter()
  
  // Use individual selectors to prevent re-renders
  const sentimentData = useStore((state) => state.sentimentData)
  const capabilityData = useStore((state) => state.capabilityData)
  const organization = useStore((state) => state.organization)
  const filters = useStore((state) => state.filters)
  const setFilters = useStore((state) => state.setFilters)
  const user = useStore((state) => state.user)
  const addNotification = useStore((state) => state.addNotification)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Prepare enhanced context with data summaries
      const baseContext = {
        current_page: pathname,
        user_info: {
          name: user?.email || 'User',
          organization: organization?.name || 'Demo Organization'
        },
        data_state: {
          has_sentiment_data: sentimentData.length > 0,
          has_capability_data: capabilityData.length > 0,
          sentiment_count: sentimentData.length,
          capability_count: capabilityData.length
        },
        active_filters: filters,
        timestamp: new Date().toISOString()
      }

      const enhancedContext = await prepareEnhancedContext(
        baseContext,
        sentimentData,
        capabilityData
      )

      // Send message to AI with full context
      const response = await fetch('/api/gpt/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage.content,
          conversation_history: messages.slice(-15), // Last 15 messages for context
          context: enhancedContext
        })
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.response,
          timestamp: new Date(),
          metadata: data.metadata
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Execute any actions suggested by the AI
        if (data.metadata?.actions && data.metadata.actions.length > 0) {
          await handleAIActions(data.metadata.actions)
        }
      } else {
        throw new Error(data.error || 'Failed to get response')
      }
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: "I apologize, but I encountered an error processing your request. Please try again or rephrase your question.",
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleAIActions = useCallback(async (actions: any[]) => {
    try {
      // Create action handlers
      const handlers = createDefaultHandlers(router, setFilters)
      
      // Execute all actions
      const result = await executeActions(actions, handlers)
      
      // Show notifications for executed actions
      result.results.forEach(({ action, success, message }) => {
        if (success && addNotification) {
          addNotification({
            id: `action-${Date.now()}-${Math.random()}`,
            type: 'success',
            message: message || action.description,
            timestamp: new Date(),
            duration: 3000
          })
        }
      })
    } catch (error) {
      console.error('Error executing AI actions:', error)
    }
  }, [router, setFilters, addNotification])

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const quickPrompts = [
    { icon: TrendingUp, text: "Top 3 AI adoption challenges", prompt: "What are our top 3 AI adoption challenges?" },
    { icon: BarChart3, text: "Capability maturity analysis", prompt: "Analyze our capability maturity across all dimensions" },
    { icon: FileText, text: "Executive summary for the board", prompt: "Generate an executive summary for the board" },
    { icon: Lightbulb, text: "Intervention recommendations", prompt: "Design specific interventions with ROI estimates" },
  ]
  
  // Determine if we should hide the chat
  const hideOnPages = ['/', '/login']
  const shouldHide = hideOnPages.includes(pathname) || (pathname === '/assessment' && activeView === 'ai-agent')
  
  // Don't render anything if should be hidden
  if (shouldHide) {
    return null
  }

  // Floating Chat Button (when closed)
  if (!isOpen) {
    return (
      <motion.button
        className={cn(
          'fixed bottom-6 right-6 z-50',
          'w-12 h-12 rounded-xl',
          'bg-gradient-to-br from-teal-500 to-purple-500',
          'shadow-lg hover:shadow-xl',
          'flex items-center justify-center',
          'transition-shadow duration-300',
          className
        )}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        <Bot className="w-5 h-5 text-white" />
        <motion.div
          className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.button>
    )
  }

  // Chat Sidebar (when open)
  return (
    <>
      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <motion.div
        className={cn(
          'fixed z-50 flex flex-col',
          'bg-white dark:bg-gray-900 border border-slate-200/60 dark:border-white/[0.08]',
          'shadow-lg',
          'bottom-4 right-4 rounded-2xl w-[360px] max-h-[600px]',
          className
        )}
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-slate-200/60 dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-purple-500 flex items-center justify-center">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">AI Agent</h3>
              <p className="text-[10px] text-slate-600 dark:text-gray-400">Ask me anything</p>
            </div>
          </div>
          
          <motion.button
            onClick={() => setIsOpen(false)}
            className="p-1.5 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-4 h-4 text-slate-600 dark:text-gray-400" />
          </motion.button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-2',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              {/* Message Content */}
              <div className={cn(
                'max-w-[85%]',
                message.role === 'user' ? 'order-2' : 'order-1'
              )}>
                <div className={cn(
                  'rounded-2xl px-3 py-2',
                  message.role === 'user'
                    ? 'bg-teal-50 dark:bg-teal-500/10 text-slate-900 dark:text-white'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white'
                )}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                </div>
                <p className={cn(
                  "text-[10px] text-slate-500 dark:text-gray-500 mt-1 px-1",
                  message.role === 'user' ? 'text-right' : 'text-left'
                )}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </p>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-slate-100 dark:bg-white/5 rounded-2xl px-3 py-2">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 animate-spin" />
                  <span className="text-sm text-slate-700 dark:text-white/70">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts (show when no user messages yet) */}
        {messages.length === 1 && (
          <div className="px-3 pb-3 space-y-1.5">
            <p className="text-[10px] text-slate-500 dark:text-gray-500 font-semibold uppercase tracking-wider mb-2">Suggestions</p>
            {quickPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                onClick={() => {
                  setInputValue(prompt.prompt)
                  inputRef.current?.focus()
                }}
                className="w-full flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all text-left group"
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
              >
                <prompt.icon className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 flex-shrink-0" />
                <span className="text-xs text-slate-700 dark:text-gray-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                  {prompt.text}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-3 border-t border-slate-200/60 dark:border-white/[0.08]">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything..."
              className={cn(
                'w-full px-3 py-2.5 pr-10',
                'bg-slate-50 dark:bg-white/5',
                'rounded-lg text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-gray-500',
                'focus:outline-none focus:ring-1 focus:ring-teal-500',
                'transition-all',
                'text-sm'
              )}
              disabled={isLoading}
            />
            <motion.button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'absolute right-1.5 top-1/2 -translate-y-1/2',
                'w-7 h-7 rounded-lg',
                'flex items-center justify-center',
                'transition-all',
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-br from-teal-500 to-purple-500'
                  : 'bg-slate-200 dark:bg-white/10 opacity-40 cursor-not-allowed'
              )}
              whileHover={inputValue.trim() && !isLoading ? { scale: 1.05 } : {}}
              whileTap={inputValue.trim() && !isLoading ? { scale: 0.95 } : {}}
            >
              {isLoading ? (
                <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5 text-white" />
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AIChat = memo(AIChatComponent)
export default AIChat

