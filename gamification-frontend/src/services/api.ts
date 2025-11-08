import axios from 'axios'
import type {
  EventsResponse,
  EventResponse,
  ActionsResponse,
  RankingResponse,
  UserResponse,
  PerformActionResponse,
  RegisterUserData,
  CreateEventData,
  CreateActionData,
  UpdateEventData,
  UpdateActionData,
  ApiResponse
} from '../types'

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// ========================================
// EVENTOS
// ========================================

export const getEvents = async (): Promise<EventsResponse> => {
  const response = await api.get<EventsResponse>('/events')
  return response.data
}

export const getEvent = async (eventId: string): Promise<EventResponse> => {
  const response = await api.get<EventResponse>(`/events/${eventId}`)
  return response.data
}

export const createEvent = async (eventData: CreateEventData): Promise<EventResponse> => {
  const response = await api.post<EventResponse>('/events', eventData)
  return response.data
}

export const updateEvent = async (eventId: string, eventData: UpdateEventData): Promise<EventResponse> => {
  const response = await api.put<EventResponse>(`/events/${eventId}`, eventData)
  return response.data
}

export const getEventRanking = async (eventId: string): Promise<RankingResponse> => {
  const response = await api.get<RankingResponse>(`/events/${eventId}/ranking`)
  return response.data
}

// ========================================
// AÇÕES
// ========================================

export const getEventActions = async (eventId: string): Promise<ActionsResponse> => {
  const response = await api.get<ActionsResponse>(`/events/${eventId}/actions`)
  return response.data
}

export const createAction = async (eventId: string, actionData: CreateActionData): Promise<ApiResponse<any>> => {
  const response = await api.post<ApiResponse<any>>(`/events/${eventId}/actions`, actionData)
  return response.data
}

export const updateAction = async (actionId: string, actionData: UpdateActionData): Promise<ApiResponse<any>> => {
  const response = await api.put<ApiResponse<any>>(`/actions/${actionId}`, actionData)
  return response.data
}

export const deleteAction = async (actionId: string): Promise<ApiResponse<any>> => {
  const response = await api.delete<ApiResponse<any>>(`/actions/${actionId}`)
  return response.data
}

// ========================================
// USUÁRIOS
// ========================================

export const registerUser = async (eventId: string, userData: RegisterUserData): Promise<UserResponse> => {
  const response = await api.post<UserResponse>(`/events/${eventId}/users`, userData)
  return response.data
}

export const getUser = async (userId: string): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/users/${userId}`)
  return response.data
}

export const getUserHistory = async (userId: string): Promise<ApiResponse<any>> => {
  const response = await api.get<ApiResponse<any>>(`/users/${userId}/history`)
  return response.data
}

// ========================================
// PONTUAÇÃO
// ========================================

export const performAction = async (userId: string, actionId: string): Promise<PerformActionResponse> => {
  const response = await api.post<PerformActionResponse>(`/users/${userId}/actions/${actionId}`)
  return response.data
}

export default api
