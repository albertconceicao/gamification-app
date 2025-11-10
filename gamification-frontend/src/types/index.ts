// ========================================
// TIPOS DA API
// ========================================

export interface Event {
  _id: string
  name: string
  description?: string
  startDate: string
  endDate?: string
  isActive: boolean
  swoogoEventId?: string
  createdAt: string
  updatedAt: string
  stats?: {
    totalActions: number
    totalUsers: number
  }
}

export interface Action {
  _id: string
  eventId: string
  name: string
  description?: string
  points: number
  allowMultiple: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface User {
  _id: string
  eventId: string
  name: string
  email: string
  points: number
  registeredAt: string
  lastAction?: string
}

export interface UserAction {
  _id: string
  userId: string
  eventId: string
  actionId: string | Action
  pointsEarned: number
  performedAt: string
}

// ========================================
// TIPOS DE RESPOSTA DA API
// ========================================

export interface ApiResponse<T> {
  success: boolean
  message?: string
  data?: T
  count?: number
}

export interface EventsResponse extends ApiResponse<Event[]> {
  count: number
  data: Event[]
}

export interface EventResponse extends ApiResponse<Event> {
  data: Event
}

export interface ActionsResponse extends ApiResponse<Action[]> {
  event: {
    id: string
    name: string
  }
  count: number
  data: Action[]
}

export interface RankingResponse extends ApiResponse<User[]> {
  event: {
    id: string
    name: string
  }
  count: number
  data: User[]
}

export interface UserResponse extends ApiResponse<User> {
  data: User & {
    recentActions?: UserAction[]
  }
}

export interface PerformActionResponse extends ApiResponse<any> {
  message: string
  data: {
    userId: string
    name: string
    action: {
      id: string
      name: string
      points: number
    }
    totalPoints: number
    pointsAdded: number
  }
}

// ========================================
// TIPOS DE FORMULÁRIOS
// ========================================

export interface RegisterUserData {
  name: string
  email: string
}

export interface CreateEventData {
  name: string
  description?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  swoogoEventId?: string
}

export interface CreateActionData {
  name: string
  description?: string
  handle: string
  points: number
  allowMultiple?: boolean
  isActive?: boolean
}

export interface UpdateEventData {
  name?: string
  description?: string
  startDate?: string
  endDate?: string
  isActive?: boolean
  swoogoEventId?: string
}

export interface UpdateActionData {
  name?: string
  description?: string
  handle?: string
  points?: number
  allowMultiple?: boolean
  isActive?: boolean
}
