import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';

declare const module: any;
const Swagger = 'swagger';

async function bootstrap() {
  const logger = new Logger();

  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(helmet());
  app.use(compression());
  //app.setGlobalPrefix('/api/v1');

  const config = app.get(ConfigService);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('Report Management System API')
    .setDescription('Report Management Service API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(Swagger, app, document);

  const port = config.get<number>('PORT');

  await app.listen(port);
  logger.log(
    `For API documentation visit here: ${await app.getUrl()}/${Swagger}`,
  );
  logger.log(`Application is running on : ${await app.getUrl()}`);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
