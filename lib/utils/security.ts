// Security utilities

export function sanitizeInput(input: string): string {
  return input.replace(/<script>/gi, '').replace(/<\/script>/gi, '')
}

export function validateApiKey(key: string): boolean {
  return key.startsWith('sk-') && key.length > 20
}

// Security utilities for CSP generation
const SecurityUtils = {
  generateCSP(options: { allowInlineStyles?: boolean; trustedDomains?: string[] }): string {
    const { allowInlineStyles = false, trustedDomains = [] } = options
    const parts = [
      "default-src 'self'",
      allowInlineStyles ? "style-src 'self' 'unsafe-inline'" : "style-src 'self'",
      "script-src 'self' 'unsafe-eval'",
      `connect-src 'self' ${trustedDomains.join(' ')}`
    ]
    return parts.join('; ')
  }
}

export default SecurityUtils

