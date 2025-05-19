import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Persona from "./pages/Persona";
import Canal from "./pages/Canal"
import EstadoConsentimiento from "./pages/EstadoConsentimiento"
import Producto from "./pages/Producto"
import Flujo from "./pages/Flujo"
import Finalidad from "./pages/Finalidad"
import ClaveProducto from "./pages/ClaveProducto";
import Configuracion from "./pages/Configuracion";
import BitacoraConfiguracion from "./pages/BitacoraConfiguracion";
import Consentimiento from "./pages/Consentimiento";
import Revocacion from "./pages/Revocacion";

function App() {
  const [menuOpen, setMenuOpen] = useState(true);

  return (
    <Router>
      <div className="flex flex-col h-screen">
        <Header onToggleMenu={() => setMenuOpen(!menuOpen)} />
        <div className="flex flex-1 overflow-hidden">
          {menuOpen && <Sidebar />}
          <main className="flex-1 overflow-auto bg-gray-100 p-4">
            <Routes>
              <Route path="/persona" element={<Persona />} />
              <Route path="/canales" element={<Canal />} />
              <Route path="/estadoConsentimiento" element={<EstadoConsentimiento />} />
              <Route path="/producto" element={<Producto />} />
              <Route path="/flujo" element={<Flujo />} />
              <Route path="/finalidad" element={<Finalidad />} />
              <Route path="/claves-producto" element={<ClaveProducto />} />
              <Route path="/configuracion" element={<Configuracion />} />
              <Route path="/bitacoras-configuracion" element={<BitacoraConfiguracion />} />
              <Route path="/consentimientos" element={<Consentimiento />} />
              <Route path="/revocaciones" element={<Revocacion />} />


            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
