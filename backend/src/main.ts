import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // 1. Crear la aplicación base (HTTP)
  const app = await NestFactory.create(AppModule);

  // 2. Conectar el Microservicio MQTT
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL || 'mqtt://localhost:1883', // Lee del .env o usa default
    },
  });

  // 3. Iniciar ambos servicios
  await app.startAllMicroservices();
  await app.listen(3000);
  console.log('🚀 Backend corriendo: HTTP en puerto 3000 y escuchando MQTT');
}
bootstrap();