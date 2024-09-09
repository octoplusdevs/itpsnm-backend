import { app } from './app';
import { env } from './env';

app
  .listen({
    host: '0.0.0.0',
    port: env.PORT,
  })
  .then((address) => {
    console.log(`HTTP Server Running at ${address}`);
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });
