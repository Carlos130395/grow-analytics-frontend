import { loginUser } from '../../infrastructure/services/apiService';

export const handleLogin = async (correo, contraseña) => {
  try {
    // Aquí debe coincidir con los nombres esperados por la API
    const userData = await loginUser(correo, contraseña);
    return userData;
  } catch (error) {
    throw new Error(`Login failed: ${error}`);
  }
};
