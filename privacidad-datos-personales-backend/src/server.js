import express from 'express';
import personaRoutes from './routes/persona.routes.js';
import cors from 'cors';
import canalRoutes from './routes/canal.route.js';
import estadoConsentimientoRoutes from './routes/estadoCosentimiento.route.js';
import productoRoutes from './routes/producto.route.js';
import flujosRoutes from './routes/flujo.route.js';
import finalidadesRoutes from './routes/finalidad.route.js';
import clavesProductoRoutes from './routes/claveProducto.route.js';
import configuracionesRoutes from './routes/configuracion.route.js';
import bitacorasConfiguracionRoutes from './routes/bitacoraConfiguracion.route.js';
import consentimientosRoutes from './routes/consentimiento.route.js';
import revocacionesRoutes from './routes/revocaciones.route.js';

const app = express();
app.use(express.json());

app.use(cors({
    origin: 'http://localhost:3000'
}));

app.use('/api/personas', personaRoutes);
app.use('/api/canales', canalRoutes);
app.use('/api/estado-consentimientos', estadoConsentimientoRoutes);
app.use('/api/productos', productoRoutes);
app.use('/api/flujos', flujosRoutes);
app.use('/api/finalidades', finalidadesRoutes);
app.use('/api/claves-producto', clavesProductoRoutes);
app.use('/api/configuraciones', configuracionesRoutes);
app.use('/api/bitacoras-configuracion', bitacorasConfiguracionRoutes);
app.use('/api/consentimientos', consentimientosRoutes);
app.use('/api/revocaciones', revocacionesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});



