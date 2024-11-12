import React, { useEffect, useState } from "react";
import { Table, message, Modal, Input, Button, Form } from "antd";
import {
  getUsuarios,
  createUsuario,
  deleteUsuario,
  updateUsuario, // Importa la función de actualización
} from "../../../infrastructure/services/apiService";
import "./UsuarioForm.css";
import { Select } from "antd";
import {
  SearchOutlined,
  LogoutOutlined,
  BulbOutlined,
  BulbFilled,
} from "@ant-design/icons";

const { Option } = Select;
const { Search } = Input;

const UsuarioForm = ({ userType }) => {
  const [usuarios, setUsuarios] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRecord, setEditingRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newUser, setNewUser] = useState({
    usuario: "",
    correo: "",
    nombre: "",
    apell_paterno: "",
    apell_materno: "",
    contrasena: "",
    tipo_usuario: "",
  });
  const [darkMode, setDarkMode] = useState(false);

  // Mueve la función fetchUsuarios aquí, fuera del useEffect
  const fetchUsuarios = async () => {
    try {
      const data = await getUsuarios();
      if (Array.isArray(data.data)) {
        setUsuarios(data.data);
        setFilteredData(data.data);
      } else {
        console.error("Los datos no son un array:", data);
        setUsuarios([]);
        setFilteredData([]);
      }
    } catch (error) {
      message.error(`Error al cargar usuarios: ${error}`);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);
  const handleSearch = (value) => {
    const lowerCaseValue = value.toLowerCase();
    const filtered = usuarios.filter((usuario) => {
      return (
        usuario.id.toString().includes(lowerCaseValue) ||
        usuario.usuario?.toLowerCase().includes(lowerCaseValue) ||
        usuario.correo?.toLowerCase().includes(lowerCaseValue) ||
        `${usuario.nombre || ""} ${usuario.apell_paterno || ""} ${
          usuario.apell_materno || ""
        }`
          .toLowerCase()
          .includes(lowerCaseValue)
      );
    });
    setFilteredData(filtered);
  };

  const handleCreateUser = async () => {
    try {
      const response = await createUsuario(newUser);
      setUsuarios((prev) => [...prev, response]);
      setFilteredData((prev) => [...prev, response]);
      message.success("Usuario creado exitosamente");
      setShowCreateModal(false);
      setNewUser({
        usuario: "",
        correo: "",
        nombre: "",
        apell_paterno: "",
        apell_materno: "",
        contrasena: "",
        tipo_usuario: "",
      });
    } catch (error) {
      message.error(`Error al crear usuario: ${error}`);
    }
  };

  const handleEdit = (record) => {
    if (record.tipo_usuario === "admin") {
      setEditingRecord(record);
      setShowModal(true);
    } else {
      setUsuarios((prev) =>
        prev.map((usuario) =>
          usuario.id === record.id ? { ...usuario, editable: true } : usuario
        )
      );
    }
  };

  const handleSave = async (id, updatedValues) => {
    try {
      await updateUsuario(id, updatedValues);
      message.success("Usuario actualizado");
      // Refresca la lista de usuarios
      fetchUsuarios(); // Agrega esta línea para refrescar la lista
    } catch (error) {
      message.error(`Error al actualizar usuario: ${error}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUsuario(id);
      setUsuarios((prev) => prev.filter((usuario) => usuario.id !== id));
      setFilteredData((prev) => prev.filter((usuario) => usuario.id !== id));
      message.success("Usuario eliminado exitosamente");
    } catch (error) {
      message.error(`Error al eliminar usuario: ${error}`);
    }
  };

  const handleModalSave = async () => {
    try {
      if (editingRecord) {
        await updateUsuario(editingRecord.id, editingRecord);
        message.success("Usuario actualizado");
        setShowModal(false);
        // Refresca la lista de usuarios
        fetchUsuarios(); // Agrega esta línea para refrescar la lista
      }
    } catch (error) {
      message.error(`Error al actualizar usuario: ${error}`);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    message.info("Sesión cerrada");
    window.location.href = "/login";
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Usuario",
      dataIndex: "usuario",
      key: "usuario",
      render: (text, record) =>
        record.editable ? (
          <Input
            defaultValue={text}
            onChange={(e) =>
              setUsuarios((prev) =>
                prev.map((usuario) =>
                  usuario.id === record.id
                    ? { ...usuario, usuario: e.target.value }
                    : usuario
                )
              )
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Correo",
      dataIndex: "correo",
      key: "correo",
      render: (text, record) =>
        record.editable ? (
          <Input
            defaultValue={text}
            onChange={(e) =>
              setUsuarios((prev) =>
                prev.map((usuario) =>
                  usuario.id === record.id
                    ? { ...usuario, correo: e.target.value }
                    : usuario
                )
              )
            }
          />
        ) : (
          text
        ),
    },
    {
      title: "Nombre Completo",
      key: "nombreCompleto",
      render: (text, record) =>
        record.editable ? (
          <>
            <Input
              defaultValue={record.nombre}
              onChange={(e) =>
                setUsuarios((prev) =>
                  prev.map((usuario) =>
                    usuario.id === record.id
                      ? { ...usuario, nombre: e.target.value }
                      : usuario
                  )
                )
              }
              style={{ marginBottom: 8 }}
            />
            <Input
              defaultValue={record.apell_paterno}
              onChange={(e) =>
                setUsuarios((prev) =>
                  prev.map((usuario) =>
                    usuario.id === record.id
                      ? { ...usuario, apell_paterno: e.target.value }
                      : usuario
                  )
                )
              }
              style={{ marginBottom: 8 }}
            />
            <Input
              defaultValue={record.apell_materno}
              onChange={(e) =>
                setUsuarios((prev) =>
                  prev.map((usuario) =>
                    usuario.id === record.id
                      ? { ...usuario, apell_materno: e.target.value }
                      : usuario
                  )
                )
              }
            />
          </>
        ) : (
          `${record.nombre || ""} ${record.apell_paterno || ""} ${
            record.apell_materno || ""
          }`.trim()
        ),
    },
    {
      title: "Acciones",
      key: "acciones",
      render: (text, record) => (
        <>
          <a onClick={() => handleEdit(record)}>Editar</a>
          &nbsp;|&nbsp;
          <a onClick={() => handleDelete(record.id)}>Eliminar</a>
        </>
      ),
    },
  ];

  return (
    <div className={`usuario-table-container ${darkMode ? "dark-mode" : ""}`}>
      <div className="usuario-form-actions">
        <Button
          onClick={() => setDarkMode(!darkMode)}
          icon={darkMode ? <BulbFilled /> : <BulbOutlined />}
        />
        <Button onClick={handleLogout} icon={<LogoutOutlined />}>
          Cerrar Sesión
        </Button>
      </div>
      <h1>Lista de Usuarios</h1>
      <div className="usuario-form-actions">
        <Button type="primary" onClick={() => setShowCreateModal(true)}>
          Crear Usuario
        </Button>
        <Search
          placeholder="Buscar por ID, Usuario, Correo o Nombre Completo"
          onSearch={handleSearch}
          enterButton={<SearchOutlined />}
          style={{ width: 300, marginLeft: "auto" }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowKey={(record) => record.id}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title="Editar Usuario"
        visible={showModal}
        onCancel={() => setShowModal(false)}
        onOk={handleModalSave}
      >
        <Input
          value={editingRecord?.usuario}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, usuario: e.target.value })
          }
          placeholder="Usuario"
        />
        <Input
          value={editingRecord?.correo}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, correo: e.target.value })
          }
          placeholder="Correo"
          style={{ marginTop: 8 }}
        />
        <Input
          value={editingRecord?.nombre}
          onChange={(e) =>
            setEditingRecord({ ...editingRecord, nombre: e.target.value })
          }
          placeholder="Nombre"
          style={{ marginTop: 8 }}
        />
        <Input
          value={editingRecord?.apell_paterno}
          onChange={(e) =>
            setEditingRecord({
              ...editingRecord,
              apell_paterno: e.target.value,
            })
          }
          placeholder="Apellido Paterno"
          style={{ marginTop: 8 }}
        />
        <Input
          value={editingRecord?.apell_materno}
          onChange={(e) =>
            setEditingRecord({
              ...editingRecord,
              apell_materno: e.target.value,
            })
          }
          placeholder="Apellido Materno"
          style={{ marginTop: 8 }}
        />
      </Modal>
      <Modal
        title="Crear Usuario"
        visible={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        onOk={handleCreateUser}
      >
        <Form layout="vertical">
          <Form.Item label="Usuario">
            <Input
              value={newUser.usuario}
              onChange={(e) =>
                setNewUser({ ...newUser, usuario: e.target.value })
              }
              placeholder="Usuario"
            />
          </Form.Item>
          <Form.Item label="Correo">
            <Input
              value={newUser.correo}
              onChange={(e) =>
                setNewUser({ ...newUser, correo: e.target.value })
              }
              placeholder="Correo"
            />
          </Form.Item>
          <Form.Item label="Nombre">
            <Input
              value={newUser.nombre}
              onChange={(e) =>
                setNewUser({ ...newUser, nombre: e.target.value })
              }
              placeholder="Nombre"
            />
          </Form.Item>
          <Form.Item label="Apellido Paterno">
            <Input
              value={newUser.apell_paterno}
              onChange={(e) =>
                setNewUser({ ...newUser, apell_paterno: e.target.value })
              }
              placeholder="Apellido Paterno"
            />
          </Form.Item>
          <Form.Item label="Apellido Materno">
            <Input
              value={newUser.apell_materno}
              onChange={(e) =>
                setNewUser({ ...newUser, apell_materno: e.target.value })
              }
              placeholder="Apellido Materno"
            />
          </Form.Item>
          <Form.Item label="Contraseña">
            <Input.Password
              value={newUser.contrasena}
              onChange={(e) =>
                setNewUser({ ...newUser, contrasena: e.target.value })
              }
              placeholder="Contraseña"
            />
          </Form.Item>
          <Form.Item label="Tipo de Usuario">
            <Select
              value={newUser.tipo_usuario}
              onChange={(value) =>
                setNewUser({ ...newUser, tipo_usuario: value })
              }
              placeholder="Selecciona un tipo de usuario"
            >
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UsuarioForm;
