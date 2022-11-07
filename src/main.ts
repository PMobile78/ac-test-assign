import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(process.env.NODE_PORT || 3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
}

bootstrap();
