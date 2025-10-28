// Legacy model types for backward compatibility

export interface User {
  id: string
  email: string
  name?: string
}

export interface Company {
  id: string
  name: string
  display_name: string
  industry?: string
}

export interface Session {
  user: User
  company?: Company
}

export interface BaseResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Enum types for validation
export enum Industry {
  Technology = 'technology',
  Finance = 'finance',
  Healthcare = 'healthcare',
  Manufacturing = 'manufacturing',
  Retail = 'retail',
  Other = 'other'
}

export enum OrganizationSize {
  Small = '1-50',
  Medium = '51-500',
  Large = '501-5000',
  Enterprise = '5000+'
}

export enum FilterOperator {
  Equal = 'eq',
  NotEqual = 'ne',
  GreaterThan = 'gt',
  LessThan = 'lt',
  In = 'in'
}

export enum Priority {
  Low = 'low',
  Medium = 'medium',
  High = 'high',
  Critical = 'critical'
}

export enum ImpactLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum EffortLevel {
  Low = 'low',
  Medium = 'medium',
  High = 'high'
}

export enum UserRole {
  Admin = 'admin',
  User = 'user',
  Viewer = 'viewer'
}

export type SentimentLevel = number
export type AssessmentType = 'sentiment' | 'capability'
export type UploadStatus = 'pending' | 'uploading' | 'processing' | 'complete' | 'error'

