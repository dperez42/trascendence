import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { TokenErrorFilter } from './filters/token-error';



// Función bootstrap que inicia la aplicación NestJS.
async function bootstrap() {
  // Crea una instancia de la aplicación utilizando el módulo principal (AppModule).
  const app = await NestFactory.create(AppModule);
  //
  // Agrega un filtro global para manejar las excepciones.
  // app.useGlobalFilters(new CustomExceptionFilter());
  app.useGlobalFilters(new CustomExceptionFilter(), new TokenErrorFilter());
  // Establece un prefijo global para todas las rutas de la aplicación.
  app.setGlobalPrefix('api');

  //app.use('/', express.static('../avatars'));

  // Agrega un ValidationPipe global para validar automáticamente los datos de entrada.
  // La opción 'whitelist' elimina las propiedades no permitidas en los DTOs.
  // La opción 'forbidNonWhitelisted' lanza una excepción si se envían propiedades no permitidas.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Transcendence API')
    .setDescription('Procject for Transcendence API documentation 42 network Madrid')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  document.components.securitySchemes = {
    ...document.components.securitySchemes,
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
    },
  };
  document.security = [{ bearerAuth: [] }];
  SwaggerModule.setup('api', app, document);

  // Inicia la aplicación en el puerto 3000.
  app.enableCors({
    origin: '*',
  });
  
  await app.listen(3000);
}

// Llama a la función bootstrap para iniciar la aplicación.
bootstrap();