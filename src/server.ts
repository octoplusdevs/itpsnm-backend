import { app } from './app';
import { env } from './env';

const port = env.PORT || 3333;
// const host = ("RENDER" in env) ? `0.0.0.0` : `localhost`;
app
  .listen({
    host: '0.0.0.0',
    port: Number(port),
  })
  .then((address) => {
    console.log(`HTTP Server Running at ${address}`);
  })
  .catch((error) => {
    console.error('Error starting server:', error);
  });
