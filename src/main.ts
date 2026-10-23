import 'dotenv/config'
import 'dotenv-expand/config'
import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ZodSerializerInterceptor, ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.setGlobalPrefix('api')

  app.useGlobalPipes(
    new ZodValidationPipe()
  )

  const reflector = app.get(Reflector)
  app.useGlobalInterceptors(
    new ZodSerializerInterceptor(reflector)
  )

  const config = new DocumentBuilder()
    .setTitle('tasknest')
    .setVersion('0.0.1')
    .setDescription('Task Tracking API')
    .addBearerAuth()
    .build()
  const documentFactory = () => SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('swagger', app, documentFactory)

  app.enableCors()

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
void bootstrap();
