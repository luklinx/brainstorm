export type UserRole = 'public' | 'student' | 'instructor' | 'staff' | 'admin'

export const roleHierarchy: Record<UserRole, number> = {
  public: 0,
  student: 1,
  instructor: 2,
  staff: 3,
  admin: 4,
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export function isAdmin(role: UserRole): boolean {
  return role === 'admin'
}

export function isStaff(role: UserRole): boolean {
  return role === 'staff' || role === 'admin'
}

export function isInstructor(role: UserRole): boolean {
  return role === 'instructor' || role === 'admin'
}

export function isStudent(role: UserRole): boolean {
  return role === 'student'
}
