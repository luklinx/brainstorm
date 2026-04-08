export type ApiResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export async function handleApiError(error: any): Promise<ApiResponse> {
  console.error('API Error:', error)
  return {
    success: false,
    error: error?.message || 'An unexpected error occurred',
  }
}

export function createSuccessResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function createErrorResponse(error: string): ApiResponse {
  return {
    success: false,
    error,
  }
}
