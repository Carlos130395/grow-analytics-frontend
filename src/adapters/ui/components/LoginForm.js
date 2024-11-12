import React from "react";
import { Form, Input, Button, Checkbox, message } from "antd";
import { FaFacebook, FaTwitter, FaGoogle } from "react-icons/fa";
import { handleLogin } from "../../../core/usecases/handleLogin";

const LoginForm = () => {
  const onFinish = async (values) => {
    try {
      // Asegúrate de enviar los campos correctos
      const response = await handleLogin(values.username, values.password);
      // Manejo de respuesta exitosa
      message.success("Login successful");

      if (response.token && response.data) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("data", JSON.stringify(response.data)); // Convierte el objeto a una cadena
        window.location.href = "/usuario";
      }
    } catch (error) {
      message.error(`Login failed: ${error.message}`);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign Up</h2>
      <Form name="login_form" onFinish={onFinish} layout="vertical">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your email!" }]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Log in
          </Button>
        </Form.Item>
      </Form>

      <div className="social-login">
        <p>Or login with</p>
        <Button type="link" icon={<FaTwitter />} />
        <Button type="link" icon={<FaFacebook />} />
        <Button type="link" icon={<FaGoogle />} />
      </div>
      <p>
        <a href="#">Create an account</a>
      </p>
    </div>
  );
};

export default LoginForm;
