import { FastifyInstance } from 'fastify'
import { createTransaction } from './create'
import { findTransactionByNumber } from './get-by-number'
import { findTransactionsByStudent } from './get-by-student'

export async function transactionsRoutes(app: FastifyInstance) {
  app.post('/transactions', createTransaction)
  app.get('/transactions/:transactionNumber', findTransactionByNumber)
  app.get('/enrollments/:enrollmentId/transactions', findTransactionsByStudent)
}
