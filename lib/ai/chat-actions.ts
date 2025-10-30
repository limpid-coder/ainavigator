/**
 * Chat Action Handler System
 * Executes actions suggested by the AI chat
 */

import { ChatAction } from './chat-service'

export type ActionHandler = (payload: any) => Promise<boolean | void>

export interface ActionExecutor {
  navigate: ActionHandler
  filter: ActionHandler
  query: ActionHandler
  generate: ActionHandler
  visualize: ActionHandler
}

/**
 * Execute a chat action
 */
export async function executeAction(
  action: ChatAction,
  handlers: Partial<ActionExecutor>
): Promise<{ success: boolean; message?: string }> {
  try {
    const handler = handlers[action.type]
    
    if (!handler) {
      console.warn(`No handler registered for action type: ${action.type}`)
      return {
        success: false,
        message: `Action "${action.type}" not supported yet`
      }
    }
    
    await handler(action.payload)
    
    return {
      success: true,
      message: action.description
    }
  } catch (error) {
    console.error('Action execution error:', error)
    return {
      success: false,
      message: `Failed to execute: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

/**
 * Execute multiple actions in sequence
 */
export async function executeActions(
  actions: ChatAction[],
  handlers: Partial<ActionExecutor>
): Promise<{ success: boolean; results: Array<{ action: ChatAction; success: boolean; message?: string }> }> {
  const results = []
  let allSuccessful = true
  
  for (const action of actions) {
    const result = await executeAction(action, handlers)
    results.push({ action, ...result })
    
    if (!result.success) {
      allSuccessful = false
      // Continue executing other actions even if one fails
    }
  }
  
  return {
    success: allSuccessful,
    results
  }
}

/**
 * Create default action handlers using Next.js router and state
 */
export function createDefaultHandlers(
  router: any, // Next.js router
  setFilters?: (filters: any) => void,
  queryData?: (query: string, filters?: any) => Promise<any>
): ActionExecutor {
  return {
    navigate: async (payload) => {
      const { page } = payload
      const routes: Record<string, string> = {
        dashboard: '/dashboard',
        assessment: '/assessment',
        demo: '/demo',
        upload: '/upload'
      }
      
      const route = routes[page]
      if (route) {
        router.push(route)
        return true
      }
      
      console.warn(`Unknown page: ${page}`)
      return false
    },
    
    filter: async (payload) => {
      if (!setFilters) {
        console.warn('Filter handler not available')
        return false
      }
      
      const { type, value } = payload
      setFilters({ [type]: value })
      return true
    },
    
    query: async (payload) => {
      if (!queryData) {
        console.warn('Query handler not available')
        return false
      }
      
      const { query, filters } = payload
      await queryData(query, filters)
      return true
    },
    
    generate: async (payload) => {
      const { type, focus } = payload
      console.log(`Generating ${type} report${focus ? ` focused on ${focus}` : ''}`)
      // This would integrate with your report generation system
      return true
    },
    
    visualize: async (payload) => {
      console.log('Visualize action:', payload)
      // This would create visualizations
      return true
    }
  }
}

/**
 * Parse action from AI response text (backup method)
 */
export function parseActionFromText(text: string): ChatAction[] {
  const actions: ChatAction[] = []
  const actionPattern = /\[ACTION:([^:]+):([^\]]+)\]/g
  let match
  
  while ((match = actionPattern.exec(text)) !== null) {
    const [_, type, data] = match
    
    if (type === 'navigate') {
      actions.push({
        type: 'navigate',
        payload: { page: data },
        description: `Navigate to ${data}`
      })
    } else if (type === 'filter') {
      const [filterType, filterValue] = data.split('=')
      actions.push({
        type: 'filter',
        payload: { type: filterType, value: filterValue },
        description: `Filter by ${filterType}: ${filterValue}`
      })
    } else if (type === 'generate') {
      actions.push({
        type: 'generate',
        payload: { type: data },
        description: `Generate ${data}`
      })
    }
  }
  
  return actions
}

