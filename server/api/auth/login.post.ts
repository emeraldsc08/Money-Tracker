import { apiError, apiSuccess } from '../../utils/api-response'
import { validateLoginBody } from '../../utils/auth-validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validation = validateLoginBody(body)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const { email, password } = validation.value

    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user || !(await verifyPassword(user.passwordHash, password))) {
      return apiError(event, 'Email atau password salah.', 401)
    }

    await setUserSession(event, {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      loggedInAt: Date.now(),
    })

    return apiSuccess({
      id: user.id,
      email: user.email,
      name: user.name,
    })
  }
  catch (error) {
    console.error('[POST /api/auth/login]', error)
    return apiError(event, 'Gagal login.', 500)
  }
})
