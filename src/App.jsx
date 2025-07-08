import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import Dashboard from './pages/Dashboard';
import Veiculos from './pages/Veiculos';
import Vagas from './pages/Vagas';
import RegistroEntrada from './pages/RegistroEntrada';
import RegistroSaida from './pages/RegistroSaida';
import AdminPanel from './pages/AdminPanel';
import PrivateRouteAdmin from './components/PrivateRouteAdmin'; // novo

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/veiculos" element={<Veiculos />} />
        <Route path="/vagas" element={<Vagas />} />
        <Route path="/entrada" element={<RegistroEntrada />} />
        <Route path="/saida" element={<RegistroSaida />} />

        <Route
          path="/admin"
          element={
            <PrivateRouteAdmin>
              <AdminPanel />
            </PrivateRouteAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
