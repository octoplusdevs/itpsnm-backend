import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import { ZodError } from 'zod'
import { env } from './env'
// import fastifyJwt from '@fastify/jwt'
import { coursesRoutes } from './http/controllers/courses/routes'
import { studentsRoutes } from './http/controllers/students/routes'
import { enrollmentsRoutes } from './http/controllers/enrollments/routes'
import { documentsRoutes } from './http/controllers/documents/routes'
import { photosRoutes } from './http/controllers/photos/routes'
import { paymentsRoutes } from './http/controllers/payments/routes'
import { notesRoutes } from './http/controllers/notes/routes'
import { authRoutes } from './http/controllers/auth/routes'
import { provincesRoutes } from './http/controllers/provinces/routes'
import fastifyMultipart from '@fastify/multipart';



export const app = fastify()





// app.register(fastifyJwt, {
//   secret: env.JWT_SECRET,
//   cookie: {
//     cookieName: 'refreshToken',
//     signed: false,
//   },
//   sign: {
//     expiresIn: '10m',
//   },
// })

app.register(require('@fastify/cors'), (instance) => {
  return (req: any, callback: any) => {
    const corsOptions = {
      // This is NOT recommended for production as it enables reflection exploits
      origin: true
    };

    // do not include CORS headers for requests from localhost
    if (/^localhost$/m.test(req.headers.origin)) {
      corsOptions.origin = false
    }

    // callback expects two parameters: error and options
    callback(null, corsOptions)
  }
})
app.register(fastifyMultipart, {
  limits: {
    fileSize: 5 * 1024 * 1024, // 2MB
  },
});
app.register(fastifyCookie)
app.register(provincesRoutes, { prefix: '/api/v1' })
app.register(coursesRoutes, { prefix: '/api/v1' })
app.register(studentsRoutes, { prefix: '/api/v1' })
app.register(enrollmentsRoutes, { prefix: '/api/v1' })
app.register(documentsRoutes, { prefix: '/api/v1' })
app.register(photosRoutes, { prefix: '/api/v1' })
app.register(paymentsRoutes, { prefix: '/api/v1' })
app.register(notesRoutes, { prefix: '/api/v1' })
app.register(authRoutes, { prefix: '/api/v1' })

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  }
  // console.log(error)
  return reply.status(500).send({ message: 'Internal server error.' })
})
