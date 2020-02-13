import { NestFactory } from '@nestjs/core';
import { ConfigService } from './config/config.service';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LoggingInterceptor } from './support/logging.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { AnyExceptionFilter } from './support/any-exception.fiter';
import * as bodyParser from 'body-parser';

const config = new ConfigService('.env');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const options = new DocumentBuilder()
    .setTitle('MQTT IoT platform')
    .addBearerAuth()
    .setDescription('The MQTT IoT platform API description')
    .setVersion('1.0')
    .build();
  const port = config.option.base.PORT;
  const baseApiUrl = config.option.base.BASIC_API_PATH;
  app.enableCors();
  app.setGlobalPrefix(baseApiUrl);
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use(
    bodyParser.json({
      limit: '50mb',
    }),
  );
  app.useGlobalFilters(new AnyExceptionFilter());
  await app.listen(port);
  console.log(`Swagger API doc in http://localhost:${port}/api-docs`);
  console.log(`Server listen on http://0.0.0.0:${port}`);
}
bootstrap();
