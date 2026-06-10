import type { H3Event } from 'h3'
import type { AuthUser } from '../../shared/types/auth'

export async function requireUser(event: H3Event): Promise<AuthUser> {
  const session = await getUserSession(event)
  const user = session.user

  if (!user?.id || !user.email || !user.name) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
  }
}
