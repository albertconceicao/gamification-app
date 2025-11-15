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

let API_URL: string;
if (import.meta.env.DEV) {
  // In development, use the full URL to the backend
  API_URL = 'http://localhost:3000/api';
} else {
  // In production, use relative URL (handled by Nginx)
  API_URL = '/api';
}

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
// ACTIONS
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
// USERS
// ========================================

export const registerUser = async (eventId: string, userData: RegisterUserData): Promise<UserResponse> => {
  const response = await api.post<UserResponse>(`/events/${eventId}/users`, userData)
  return response.data
}

export const getUser = async (userId: string): Promise<UserResponse> => {
  const response = await api.get<UserResponse>(`/attendees/${userId}`)
  return response.data
}

export const getUserHistory = async (userId: string): Promise<ApiResponse<any>> => {
  const response = await api.get<ApiResponse<any>>(`/attendees/${userId}/history`)
  return response.data
}

// ========================================
// SCORING
// ========================================

export const performAction = async (attendeeId: string, actionId: string): Promise<PerformActionResponse> => {
  const response = await api.post<PerformActionResponse>('/users/actions', {
    attendeeId,
    actionId
  })
  return response.data
}

export default api
