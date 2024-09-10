import { FastifyInstance } from 'fastify';
import { loginController } from './login';

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth', loginController);
}
