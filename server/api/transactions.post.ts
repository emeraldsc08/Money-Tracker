import { apiError, apiSuccess } from '../utils/api-response'
import { serializeTransaction } from '../utils/transaction-serializer'
import { validateTransactionBody } from '../utils/transaction-validation'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validation = validateTransactionBody(body)

    if (!validation.ok) {
      return apiError(event, validation.error, 400)
    }

    const transaction = await prisma.transaction.create({
      data: validation.value,
    })

    setResponseStatus(event, 201)
    return apiSuccess(serializeTransaction(transaction))
  }
  catch (error) {
    console.error('[POST /api/transactions]', error)
    return apiError(event, 'Failed to create transaction.', 500)
  }
})
