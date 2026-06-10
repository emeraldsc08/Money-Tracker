import type { LoginInput, RegisterInput } from '../../shared/types/auth'

type ValidationResult<T> =
  | { ok: true, value: T }
  | { ok: false, error: string }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function validateRegisterBody(body: unknown): ValidationResult<RegisterInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const input = body as Record<string, unknown>

  if (!isNonEmptyString(input.name)) {
    return { ok: false, error: 'Name is required.' }
  }

  if (!isNonEmptyString(input.email) || !EMAIL_PATTERN.test(input.email.trim())) {
    return { ok: false, error: 'Email is invalid.' }
  }

  if (!isNonEmptyString(input.password) || input.password.length < 6) {
    return { ok: false, error: 'Password must be at least 6 characters.' }
  }

  return {
    ok: true,
    value: {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  }
}

export function validateLoginBody(body: unknown): ValidationResult<LoginInput> {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Request body must be a JSON object.' }
  }

  const input = body as Record<string, unknown>

  if (!isNonEmptyString(input.email)) {
    return { ok: false, error: 'Email is required.' }
  }

  if (!isNonEmptyString(input.password)) {
    return { ok: false, error: 'Password is required.' }
  }

  return {
    ok: true,
    value: {
      email: input.email.trim().toLowerCase(),
      password: input.password,
    },
  }
}
