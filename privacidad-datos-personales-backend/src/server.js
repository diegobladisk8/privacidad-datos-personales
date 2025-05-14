import express from 'express';
import personaRoutes from './routes/persona.routes.js';
import cors from 'cors';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/api', personaRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



