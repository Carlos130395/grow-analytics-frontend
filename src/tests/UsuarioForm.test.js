import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import UsuarioForm from "./UsuarioForm"; // Ajusta la ruta según sea necesario
import { getUsuarios } from "../../../infrastructure/services/apiService"; // Importa tu mock de servicios

// Mock del servicio
jest.mock("../../../infrastructure/services/apiService", () => ({
  getUsuarios: jest.fn(),
}));

describe("UsuarioForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpia cualquier mock previo
  });

  test("should render loading state initially", () => {
    getUsuarios.mockResolvedValueOnce({ data: [] });
    render(<UsuarioForm userType="admin" />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  test("should render list of usuarios after fetching", async () => {
    const mockUsuarios = [
      {
        id: 1,
        usuario: "usuario1",
        correo: "user1@example.com",
        nombre: "Juan",
        apell_paterno: "Perez",
        apell_materno: "Gomez",
        tipo_usuario: "admin",
      },
      {
        id: 2,
        usuario: "usuario2",
        correo: "user2@example.com",
        nombre: "Maria",
        apell_paterno: "Lopez",
        apell_materno: "Rodriguez",
        tipo_usuario: "user",
      },
    ];
    getUsuarios.mockResolvedValueOnce({ data: mockUsuarios });

    render(<UsuarioForm userType="admin" />);

    await waitFor(() => {
      expect(screen.getByText(/Lista de Usuarios/i)).toBeInTheDocument();
    });

    mockUsuarios.forEach((user) => {
      expect(screen.getByText(user.usuario)).toBeInTheDocument();
      expect(screen.getByText(user.correo)).toBeInTheDocument();
    });
  });

  test("should toggle dark mode when button is clicked", () => {
    getUsuarios.mockResolvedValueOnce({ data: [] });
    const { container } = render(<UsuarioForm userType="admin" />);

    const darkModeButton = screen.getByRole("button", {
      name: /Cerrar Sesión/i,
    }).previousSibling;
    fireEvent.click(darkModeButton);
    expect(container.firstChild).toHaveClass("dark-mode");
  });
});
