const mqtt = require('mqtt');

// Conectarse al Broker local (Mosquitto)
const client = mqtt.connect('mqtt://localhost:1883');

const TOPIC = 'semillero/clima/sensor1';

client.on('connect', () => {
    console.log('✅ Simulador conectado al Broker MQTT');
    
    // Enviar datos cada 3 segundos
    setInterval(() => {
        // Generar datos aleatorios
        const mockData = {
            temp: (20 + Math.random() * 10).toFixed(2), // Entre 20 y 30
            hum: (40 + Math.random() * 20).toFixed(2),  // Entre 40 y 60
            lat: 10.42,
            lon: -75.54,
            timestamp: new Date().toISOString()
        };

        const message = JSON.stringify(mockData);
        client.publish(TOPIC, message);
        console.log(`📤 Enviando dato: ${message}`);
    }, 3000);
});

client.on('error', (err) => {
    console.error('❌ Error:', err);
});