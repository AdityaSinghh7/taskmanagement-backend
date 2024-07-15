import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as config from 'config';

interface ServerConfig{
  port: number; 
}

async function bootstrap() {
  const serverConfig: ServerConfig = config.get<ServerConfig>('server');
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule); 
  const port = serverConfig.port || process.env.PORT;
  await app.listen(port);

  logger.log(`Application listening on port: ${port}`);
}
bootstrap();
