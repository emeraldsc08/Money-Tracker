import type { H3Event } from 'h3'
import type { ApiResponse } from '../../shared/types/api'

export function apiSuccess<T>(data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    error: null,
  }
}

export function apiError(event: H3Event, message: string, statusCode = 400): ApiResponse<null> {
  setResponseStatus(event, statusCode)
  return {
    success: false,
    data: null,
    error: message,
  }
}
