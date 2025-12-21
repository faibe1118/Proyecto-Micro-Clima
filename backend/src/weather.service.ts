import { Injectable } from '@nestjs/common';
import { InfluxDB, Point } from '@influxdata/influxdb-client';

@Injectable()
export class WeatherService {
    private writeApi;
    private client: InfluxDB;

    constructor() {
        // 1. Conexión usando las variables de entorno del .env
        const url = process.env.INFLUX_URL;
        const token = process.env.INFLUX_TOKEN;
        const org = process.env.INFLUX_ORG;
        const bucket = process.env.INFLUX_BUCKET;

        if(!url || !token || !org || !bucket) {
            throw new Error("Faltan variables de entorno para InfluxDB");
        }

        this.client = new InfluxDB({ url , token });
        this.writeApi = this.client.getWriteApi(org, bucket);
        console.log('💾 Servicio de InfluxDB inicializado');
    }

    async guardarDatos(data: any) {
        // Asegurarnos que data sea un objeto JSON
        let lectura = data;
        if (typeof data === 'string') {
            try {
                lectura = JSON.parse(data);
            } catch (e) {
                console.error("Error parseando JSON", e);
                return;
            }
        }

        // 2. Crear el "Punto" de datos
        // En InfluxDB: 
        // - TAGS: Son para buscar rápido (ej: ID del dispositivo, Ubicación)
        // - FIELDS: Son los números que vas a graficar (Temp, Humedad)
        const point = new Point('clima_sensor')
            .tag('device_id', 'esp32_01') // Etiqueta fija por ahora
            .floatField('temperature', parseFloat(lectura.temp))
            .floatField('humidity', parseFloat(lectura.hum))
            .floatField('lat', parseFloat(lectura.lat))
            .floatField('lon', parseFloat(lectura.lon));

        // 3. Escribir en la DB
        this.writeApi.writePoint(point);

        // Guardar cambios (flush)
        await this.writeApi.flush();
        console.log('✅ Dato guardado en InfluxDB');
    }
}