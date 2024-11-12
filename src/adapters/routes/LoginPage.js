import React from "react";
import LoginForm from "../ui/components/LoginForm";
import "./LoginPage.css"; // Archivo de estilos que crearemos a continuación

const LoginPage = () => {
  return (
    <div className="login-page">
      <div className="login-illustration">
        {/* Agrega tu ilustración aquí */}
        <img src={`${process.env.PUBLIC_URL}/rb_2750.png`} alt="Illustration" />
      </div>
      <div className="login-form-container">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
