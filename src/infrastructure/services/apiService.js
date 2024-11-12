import axios from "axios";

const apiService = axios.create({
  baseURL: "http://localhost:3001/api", // Cambia esto a la URL base de tu API si es diferente
  headers: {
    "Content-Type": "application/json",
  },
});

export const loginUser = async (correo, contraseña) => {
  try {
    const response = await apiService.post("/usuarios/login", {
      correo,
      contrasena: contraseña,
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Interceptor para agregar el token a cada solicitud
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Recupera el token del localStorage
    console.log("Token: ", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Obtener todos los usuarios
export const getUsuarios = async () => {
  try {
    const response = await apiService.get("/usuarios");
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Crear un nuevo usuario
export const createUsuario = async (usuarioData) => {
  try {
    // Formatea y valida los datos según sea necesario antes de la solicitud
    const formattedData = {
      ...usuarioData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const response = await apiService.post("/usuarios", formattedData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Obtener un usuario por ID
export const getUsuarioById = async (id) => {
  try {
    const response = await apiService.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Actualizar un usuario por ID
export const updateUsuario = async (id, usuarioData) => {
  try {
    const response = await apiService.put(`/usuarios/${id}`, usuarioData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Eliminar un usuario por ID
export const deleteUsuario = async (id) => {
  try {
    const response = await apiService.delete(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export default apiService;
