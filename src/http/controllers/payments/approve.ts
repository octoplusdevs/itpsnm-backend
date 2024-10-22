import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'
import { PaymentNotFoundError } from '@/use-cases/errors/payment-not-found'
import { PaymentIsNotPendingError } from '@/use-cases/errors/payment-is-not-pending'
import { EmployeeNotFoundError } from '@/use-cases/errors/employee-not-found'
import { makeApprovePaymentUseCase } from '@/use-cases/factories/make-approve-payment-use-case'
import { PAY_STATUS } from '@prisma/client'

export async function approvePayment(request: FastifyRequest, reply: FastifyReply) {
  const approvePaymentSchema = z.object({
    paymentId: z.number().int(),
    employeeId: z.number().int(),
    status: z.nativeEnum(PAY_STATUS).default("PAID"),
  })

  const { paymentId, employeeId, status } = approvePaymentSchema.parse(request.body)

  try {
    const approvePaymentUseCase = makeApprovePaymentUseCase()

    const approvedPayment = await approvePaymentUseCase.execute({
      paymentId,
      employeeId,
      status
    })

    return reply.status(200).send(approvedPayment)
  } catch (err) {
    if (err instanceof PaymentNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof EmployeeNotFoundError) {
      return reply.status(404).send({ message: err.message })
    }

    if (err instanceof PaymentIsNotPendingError) {
      return reply.status(409).send({ message: err.message })
    }

    console.error(err)
    return reply.status(500).send({ message: 'Internal Server Error' })
  }
}
