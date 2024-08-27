import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT;

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    async function createSwaggerDocument() {
        const config = new DocumentBuilder()
            .setTitle('beta API')
            .setDescription('API that manage beta sass')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(app, config);
        return document;
    }

    async function setupSwagger(app) {
        const document = await createSwaggerDocument();
        SwaggerModule.setup('api', app, document);
    }

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
        })
    );
    app.enableCors({
        origin: '*',
    });
    await setupSwagger(app);
    await app.listen(PORT);
}
bootstrap();
