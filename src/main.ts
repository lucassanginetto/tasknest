import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

interface PackageInfo {
  name: string;
  description: string;
  version: string;
}

function isPackageInfo(value: unknown): value is PackageInfo {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const obj = value as Record<string, unknown>;
  return (
    typeof obj.name === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.version === 'string'
  );
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const packageJsonContent = fs.readFileSync('package.json', 'utf8');
  const packageInfo = JSON.parse(packageJsonContent) as PackageInfo;
  if (!isPackageInfo(packageInfo)) throw new Error('Invalid `package.json`');

  const config = new DocumentBuilder()
    .setTitle(packageInfo.name)
    .setVersion(packageInfo.version)
    .setDescription(packageInfo.description)
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
