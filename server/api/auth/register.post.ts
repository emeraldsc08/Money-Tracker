import { apiError, apiSuccess } from '../../utils/api-response'
import { validateRegisterBody } from '../../utils/auth-validation'
import { seedDefaultMastersForUser } from '../../utils/user-defaults'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validation = validateRegisterBody(body)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const { name, email, password } = validation.value

    const existing = await prisma.user.findUnique({
      where: { email },
    })

    if (existing) {
      return apiError(event, 'Email is already registered.', 409)
    }

    const passwordHash = await hashPassword(password)

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    })

    await seedDefaultMastersForUser(user.id)

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      loggedInAt: Date.now(),
    })

    setResponseStatus(event, 201)
    return apiSuccess({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  }
  catch (error) {
    console.error('[POST /api/auth/register]', error)
    return apiError(event, 'Failed to register.', 500)
  }
})
