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
  Minimize2
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
      content: "👋 Hi! I'm your AI Navigator assistant. I can help you:\n\n• Analyze your sentiment and capability data\n• Navigate to specific views and insights\n• Generate custom reports and recommendations\n• Answer questions about your AI readiness\n\nWhat would you like to explore?",
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
    { icon: TrendingUp, text: "Show me my biggest AI adoption challenges", prompt: "What are the top 3 problems we're facing with AI adoption based on our sentiment data?" },
    { icon: Sparkles, text: "Generate executive summary", prompt: "Can you generate an executive summary of our current AI readiness?" },
    { icon: AlertCircle, text: "What should I focus on first?", prompt: "Based on our data, what's the single most important thing we should address first?" },
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
          'w-14 h-14 rounded-full',
          'bg-gradient-to-br from-teal-500 to-blue-600',
          'shadow-2xl shadow-teal-500/50',
          'flex items-center justify-center',
          'hover:scale-110 active:scale-95',
          'transition-all duration-200',
          className
        )}
        onClick={() => setIsOpen(true)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <MessageSquare className="w-6 h-6 text-white" />
        <motion.div
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className="w-3 h-3 text-white absolute top-0.5 left-0.5" />
        </motion.div>
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
          'bg-black/90 backdrop-blur-2xl',
          'border-l border-white/[0.08]',
          'shadow-2xl',
          isExpanded 
            ? 'inset-0 lg:left-auto lg:w-[800px]'
            : 'bottom-0 right-0 top-0 lg:top-20 lg:bottom-4 lg:right-4 lg:rounded-2xl w-full lg:w-[420px]',
          className
        )}
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <motion.div
                className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h3 className="font-semibold text-white">AI Navigator</h3>
              <p className="text-xs text-white/60">Always here to help</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-white/70" />
              ) : (
                <Maximize2 className="w-4 h-4 text-white/70" />
              )}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(
                'flex gap-3',
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              )}
            >
              {/* Avatar */}
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                message.role === 'user'
                  ? 'bg-teal-500/20'
                  : 'bg-gradient-to-br from-teal-500 to-blue-600'
              )}>
                {message.role === 'user' ? (
                  <User className="w-4 h-4 text-teal-400" />
                ) : (
                  <Bot className="w-4 h-4 text-white" />
                )}
              </div>

              {/* Message Content */}
              <div className={cn(
                'flex-1 max-w-[85%]',
                message.role === 'user' ? 'flex justify-end' : 'flex justify-start'
              )}>
                <div className={cn(
                  'rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'bg-teal-500/20 text-white'
                    : 'bg-white/5 text-white/90'
                )}>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p className="text-xs text-white/40 mt-2">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-blue-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-white/5 rounded-2xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 text-teal-400 animate-spin" />
                  <span className="text-sm text-white/70">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts (show when no user messages yet) */}
        {messages.length === 1 && (
          <div className="px-4 pb-4 space-y-2">
            <p className="text-xs text-white/50 font-medium mb-2">Quick Actions</p>
            {quickPrompts.map((prompt, idx) => (
              <motion.button
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                onClick={() => {
                  setInputValue(prompt.prompt)
                  inputRef.current?.focus()
                }}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/[0.05] hover:border-white/10 transition-all text-left group"
              >
                <prompt.icon className="w-4 h-4 text-teal-400 flex-shrink-0" />
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {prompt.text}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-white/[0.08]">
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about your AI readiness..."
              className={cn(
                'w-full px-4 py-3 pr-12',
                'bg-white/5 border border-white/10',
                'rounded-xl text-white placeholder:text-white/40',
                'focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500/50',
                'transition-all'
              )}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'absolute right-2 top-1/2 -translate-y-1/2',
                'w-8 h-8 rounded-lg',
                'flex items-center justify-center',
                'transition-all',
                inputValue.trim() && !isLoading
                  ? 'bg-gradient-to-br from-teal-500 to-blue-600 hover:scale-105 active:scale-95'
                  : 'bg-white/5 opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Send className="w-4 h-4 text-white" />
              )}
            </button>
          </div>
          <p className="text-xs text-white/40 mt-2 text-center">
            AI Assistant
          </p>
        </div>
      </motion.div>
    </>
  )
}

// Memoize the component to prevent unnecessary re-renders
export const AIChat = memo(AIChatComponent)
export default AIChat

