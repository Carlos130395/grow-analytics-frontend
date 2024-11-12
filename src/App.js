import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import LoginPage from "./adapters/routes/LoginPage";
import UsuarioPage from "./adapters/routes/UsuarioPage";
import "./adapters/ui/components/LoginForm.css"; // Para agregar estilos básicos

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />{" "}
        {/* Redirige la raíz */}
        <Route path="/login" element={<LoginPage />} />{" "}
        {/* Ruta para el login */}
        <Route path="/usuario" element={<UsuarioPage />} />{" "}
        {/* Ruta para el Usuario */}
      </Routes>
    </Router>
  );
};

export default App;
