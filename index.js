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

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor proxy corriendo en http://localhost:${PORT}`);
});
