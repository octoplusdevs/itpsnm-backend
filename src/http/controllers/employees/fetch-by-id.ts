import { makeFetchEmployeeByIdUseCase } from '@/use-cases/factories/make-fetch-employee-by-id-use-case';
import { FastifyReply, FastifyRequest } from 'fastify';

export async function fetchById(request: FastifyRequest, reply: FastifyReply) {
  const { id } = request.params as { id: number };

  try {
    const fetchEmployeeByIdUseCase = makeFetchEmployeeByIdUseCase();
    const employee = await fetchEmployeeByIdUseCase.execute(id);

    if (!employee) {
      return reply.status(404).send({ message: 'Employee not found' });
    }

    return reply.status(200).send(employee);
  } catch (err) {
    return reply.status(500).send({ error: err });
  }
}
