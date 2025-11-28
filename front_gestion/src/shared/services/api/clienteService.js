import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import { Cliente } from '../../models/Cliente';
import { Pedido } from '../../models/Pedido';
import { Carrito } from '../../models/Carrito';

export class ClienteService {
  constructor(client = apiClient) {
    this.client = client;
  }

  /**
   * Crear un nuevo cliente
   * @param {Object} clienteData
   * @returns {Promise<Cliente>}
   */
  async crearCliente(clienteData) {
    const data = await this.client.post(API_ENDPOINTS.CLIENTES, clienteData);
    return new Cliente(data);
  }

  /**
   * Obtener todos los clientes (Solo Admin/Super Admin)
   * @param {Object} params
   * @returns {Promise<Cliente[]>}
   */
  async obtenerClientes(params = {}) {
    const { skip = 0, limit = 100 } = params;
    const data = await this.client.get(API_ENDPOINTS.CLIENTES, {
      params: { skip, limit }
    });
    return Array.isArray(data) ? data.map(c => new Cliente(c)) : [];
  }

  /**
   * Obtener cliente por ID de usuario
   * @param {number|string} usuarioId
   * @returns {Promise<Cliente>}
   */
  async obtenerClientePorUsuario(usuarioId) {
    const data = await this.client.get(API_ENDPOINTS.CLIENTE_BY_USUARIO(usuarioId));
    return new Cliente(data);
  }

  /**
   * Obtener cliente por ID
   * @param {number|string} clienteId
   * @returns {Promise<Cliente>}
   */
  async obtenerClientePorId(clienteId) {
    const data = await this.client.get(API_ENDPOINTS.CLIENTE_BY_ID(clienteId));
    return new Cliente(data);
  }

  /**
   * Actualizar un cliente
   * @param {number|string} clienteId
   * @param {Object} clienteData
   * @returns {Promise<Cliente>}
   */
  async actualizarCliente(clienteId, clienteData) {
    const data = await this.client.put(API_ENDPOINTS.CLIENTE_BY_ID(clienteId), clienteData);
    return new Cliente(data);
  }

  /**
   * Eliminar un cliente (Solo Admin/Super Admin)
   * @param {number|string} clienteId
   */
  async eliminarCliente(clienteId) {
    return await this.client.delete(API_ENDPOINTS.CLIENTE_BY_ID(clienteId));
  }

  /**
   * Obtener pedidos de un cliente
   * @param {number|string} clienteId
   * @returns {Promise<Pedido[]>}
   */
  async obtenerPedidosCliente(clienteId) {
    const data = await this.client.get(API_ENDPOINTS.PEDIDOS_BY_CLIENTE(clienteId));
    return Array.isArray(data) ? data.map(p => new Pedido(p)) : [];
  }

  /**
   * Obtener carritos de un cliente
   * @param {number|string} clienteId
   * @returns {Promise<Carrito[]>}
   */
  async obtenerCarritosCliente(clienteId) {
    const data = await this.client.get(API_ENDPOINTS.CARRITOS_BY_CLIENTE(clienteId));
    return Array.isArray(data) ? data.map(c => new Carrito(c)) : [];
  }
}

export const clienteService = new ClienteService();
export default clienteService;
