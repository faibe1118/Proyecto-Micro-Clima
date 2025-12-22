import { Controller, Get } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { WeatherService } from './weather.service'; // Importar

@Controller()
export class AppController {
  
  // Inyectar el servicio en el constructor
  constructor(private readonly weatherService: WeatherService) {}

  @Get()
  getHello(): string {
    return '¡Backend Funcionando!';
  }

  @MessagePattern('semillero/clima/#')
  async recibirDatosSensor(@Payload() data: any, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    
    // Limpieza de datos (Buffer a String a JSON)
    let mensajeObj = data;
    if (Buffer.isBuffer(data)) {
        mensajeObj = JSON.parse(data.toString());
    }

    console.log(`🔔 Recibido de ${topic}:`, mensajeObj);

    // LLAMADA AL SERVICIO PARA GUARDAR
    await this.weatherService.guardarDatos(mensajeObj);
  }

  @Get('/api/clima/actual')
  async obtenerClima() {
    const datos = await this.weatherService.obtenerUltimoDato();

    //si el objeto está vacío, devolvemos un mensaje indicando que no hay datos
    if (Object.keys( datos ).length === 0) {
      return { message: 'No hay datos disponibles' };
    }

    return datos;
  }
}