const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 4000; // Cambia el puerto si es necesario

// Middleware para habilitar CORS
app.use(cors());

// Endpoint para proxy de "medicamentos/todos"
app.get('/api/medicamentos/todos', async (req, res) => {
    const { pagina, limite } = req.query; // Extrae parámetros de consulta
    try {
        // Redirige la solicitud al servidor remoto
        const response = await axios.get(
            `https://istp1service.azurewebsites.net/api/servicio-salud/medicamentos/todos`,
            { params: { pagina, limite } }
        );
        res.json(response.data); // Retorna la respuesta al frontend
    } catch (error) {
        console.error('Error al obtener medicamentos:', error.message);
        res.status(500).send('Error en el servidor proxy.');
    }
});

// Endpoint para proxy de búsqueda por nombre
app.get('/api/servicio-salud/medicamentos', async (req, res) => {
    const { descripcion } = req.query; // Extrae el parámetro "descripcion" de la query
    try {
        // Redirige la solicitud al servidor remoto
        const response = await axios.get(
            `https://istp1service.azurewebsites.net/api/servicio-salud/medicamentos`,
            { params: { descripcion } } // Pasa el parámetro como query
        );
        res.json(response.data); // Envía la respuesta del servidor remoto al cliente
    } catch (error) {
        console.error('Error al buscar medicamentos:', error.message);
        res.status(500).send('Error en el servidor proxy.');
    }
});

// Endpoint para buscar obras sociales (con o sin descripción en la URL)
app.get('/api/servicio-salud/obras-sociales/:descripcion?', async (req, res) => {
    const { descripcion } = req.params; // Extrae el parámetro "descripcion" de la ruta
    try {
        // Define la URL base
        const url = descripcion
            ? `https://istp1service.azurewebsites.net/api/servicio-salud/obras-sociales/${descripcion}`
            : `https://istp1service.azurewebsites.net/api/servicio-salud/obras-sociales`;
        // Realiza la solicitud al servidor remoto
        const response = await axios.get(url);

        // Envía la respuesta al cliente
        res.json(response.data);
    } catch (error) {
        console.error('Error al buscar obras sociales:', error.message);
        res.status(500).send('Error en el servidor proxy.');
    }
});
// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
