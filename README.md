# 🌦️ Estación Meteorológica IoT con ESP32

Este proyecto consiste en el desarrollo de una **estación meteorológica IoT** basada en **ESP32**, capaz de medir variables ambientales y climáticas, enviar los datos a un servidor y visualizarlos en tiempo real e históricamente mediante dashboards web.

El enfoque del proyecto combina **hardware, IoT y software**, permitiendo aplicar conceptos de redes, bases de datos, backend y visualización de datos.

---

## 🎯 Objetivo del Proyecto

Diseñar e implementar un sistema que permita:

- Medir variables climáticas y ambientales usando sensores.
- Transmitir los datos de forma inalámbrica mediante WiFi.
- Almacenar lecturas históricas en una base de datos especializada.
- Visualizar la información en tiempo real e históricamente desde una plataforma web.
- (Opcional) Consumir los datos desde una aplicación móvil.

---

## 🛒 1. Hardware

### 🔧 El cerebro del sistema
- **ESP32 DevKit V1 (1x)**  
  > Se utiliza ESP32 en lugar de Arduino Uno/Mega debido a que ya integra WiFi y Bluetooth, es más potente y trabaja a 3.3V, siendo el estándar actual para proyectos IoT.

---

### 🌡️ Sensores (Los sentidos)

- **BME280 (1x)**  
  Mide:
  - Temperatura  
  - Humedad  
  - Presión atmosférica  

  > ⚠️ Importante:  
  > - No confundir con BMP280 (no mide humedad).  
  > - Evitar DHT11 por su baja precisión.  
  > - El BME280 se comunica vía **I2C** (solo 4 cables).

- **MQ-135 (1x – Opcional pero recomendado)**  
  Sensor de calidad del aire (CO₂, humo, alcohol, gases).  
  Aporta un enfoque ambiental adicional al proyecto.

- **LDR – Fotorresistencia (1x)**  
  Permite medir la intensidad de luz ambiental, útil para detectar condiciones de día/noche.

---

### 🔌 Conexiones y energía

- Protoboard (400 u 830 puntos)
- Cables Dupont (Macho-Macho, Macho-Hembra, Hembra-Hembra)
- Cable Micro-USB **con soporte de datos**
- Fuente de poder 5V (puede ser un cargador de celular)

---

## 🖨️ 2. Impresión 3D (Carcasa)

Para proteger los sensores y mejorar la calidad de las mediciones:

- **Material recomendado**:
  - PETG o ASA → uso exterior (resistencia al sol y humedad)
  - PLA → pruebas en interiores

- **Diseño**:
  - Se recomienda el modelo tipo **"Stevenson Screen"**, el cual:
    - Permite circulación de aire
    - Evita la incidencia directa del sol
    - Reduce errores en la medición de temperatura

- **Recursos**:
  - Thingiverse
  - Printables

- **Tornillería**:
  - Tornillos y tuercas M3 para el ensamblaje

---

## 💻 3. Stack Tecnológico (Servidor)

Este componente diferencia el proyecto a nivel de **ingeniería de sistemas**, integrando servicios de backend y visualización.

> Todos los servicios pueden desplegarse usando **Docker**, facilitando la instalación y replicabilidad del sistema.

---

### 📡 Broker de Mensajes
- **Mosquitto (MQTT)**  
  Recibe los mensajes enviados por la ESP32 de forma eficiente y ligera.

---

### 🗄️ Base de Datos
- **InfluxDB**  
  Base de datos orientada a **series de tiempo**, ideal para:
  - Lecturas periódicas
  - Datos con marca temporal
  - Consultas históricas de sensores

---

### 📊 Visualización
- **Grafana**  
  Permite:
  - Crear dashboards en tiempo real
  - Visualizar gráficas históricas
  - Mostrar medidores y alertas

---

## 🧱 Arquitectura General del Sistema

