import { Injectable } from '@nestjs/common';
import { InfluxDB, Point, QueryApi } from '@influxdata/influxdb-client';

@Injectable()
export class WeatherService {
    private writeApi;
    private queryApi: QueryApi;
    private client: InfluxDB;

    constructor() {
        // 1. Conexión usando las variables de entorno del .env
        const url = process.env.INFLUX_URL;
        const token = process.env.INFLUX_TOKEN;
        const org = process.env.INFLUX_ORG;
        const bucket = process.env.INFLUX_BUCKET;

        if (!url || !token || !org || !bucket) {
            throw new Error("Faltan variables de entorno para InfluxDB");
        }

        this.client = new InfluxDB({ url, token });
        this.writeApi = this.client.getWriteApi(org, bucket);
        this.queryApi = this.client.getQueryApi(org);
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

    // async obtenerUltimoDato(): Promise<any> {
    //     const bucket = process.env.INFLUX_BUCKET;

    //     //Consulta FLUX: "Dame el ultimo dato de la tabla 'clima_sensor' que no sea mas viejo de 1 hora"
    //     const query = `
    //         from(bucket: "${bucket}")
    //             |> range(start: -1h)
    //             |> filter(fn: (r) => r["_measurement] == "clima_sensor")
    //             |> last()
    //     `;

    //     //Influx devuelve las cosas en filas raras, aqui las convertimos a JSON bonito
    //     return new Promise((resolve, reject) => {
    //         const resultado = {};

    //         this.queryApi.queryRows(query, {
    //             next(row, tableMeta) {
    //                 const o = tableMeta.toObject(row);
    //                 //el campo "_field" tiene el nombre del dato (temp, hum, etc)
    //                 //el campo "_value" tiene el valor (23.4, 56.7, etc)
    //                 resultado[o._field] = o._value;

    //                 //tambien agregamos la fecha/hora del dato
    //                 resultado['timestamp'] = o._time; 
    //             },
    //             error(err) {
    //                 console.error('Error consultando InfluxDB', err);
    //                 reject(err);
    //             },
    //             complete() {
    //                 resolve(resultado);
    //             },
    //         });
    //     });
    // }
    async obtenerUltimoDato(): Promise<any> {
        const bucket = process.env.INFLUX_BUCKET;

        // VALIDACIÓN DE SEGURIDAD
        if (!bucket) {
            console.error("❌ ERROR: La variable INFLUX_BUCKET no está definida en el .env");
            return {};
        }

        // CONSULTA EN UNA SOLA LÍNEA (Más seguro para evitar errores de sintaxis)
        const query = `from(bucket: "${bucket}") |> range(start: -5h) |> filter(fn: (r) => r["_measurement"] == "clima_sensor") |> last()`;

        console.log(`🔍 Enviando Query a Influx: ${query}`); // <-- ESTO NOS AYUDARÁ A VER EL ERROR

        return new Promise((resolve, reject) => {
            const resultado = {};

            this.queryApi.queryRows(query, {
                next(row, tableMeta) {
                    const o = tableMeta.toObject(row);
                    resultado[o._field] = o._value;
                    resultado['timestamp'] = o._time;
                },
                error(error) {
                    console.error("❌ Error en InfluxDB:", error);
                    reject(error);
                },
                complete() {
                    resolve(resultado);
                },
            });
        });
    }
}