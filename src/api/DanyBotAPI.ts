import axios, { type AxiosResponse } from 'axios'

// Configura la URL base de la API
const apiClient = axios.create({
  baseURL: 'http://192.168.100.118:5000', // Reemplaza <IP_RASPBERRY_PI> con la IP de tu Raspberry Pi
  headers: {
    'Content-Type': 'application/json'
  }
})

// Definimos las funciones para interactuar con la API
export const DanyBotAPI = {
  // Obtener todos los datos
  getAll: async () => {
    const response: AxiosResponse = await apiClient.get('/all')
    return response.data
  },

  // Agregar o actualizar todos los datos
  addAll: async (data: object) => {
    const response: AxiosResponse = await apiClient.post('/all', data)
    return response.data
  },

  // Crear GCode
  createGCode: async (data: object) => {
    const response: AxiosResponse = await apiClient.post('/gcode', data)
    return response.data
  },

  // Obtener todos los racks
  getRacks: async () => {
    const response: AxiosResponse = await apiClient.get('/rack')
    return response.data
  },

  // Obtener un rack por ID
  getRackById: async (rackId: string) => {
    const response: AxiosResponse = await apiClient.get(`/rack/${rackId}`)
    return response.data
  },

  // Obtener todas las plataformas
  getDecks: async () => {
    const response: AxiosResponse = await apiClient.get('/deck')
    return response.data
  },

  // Obtener una plataforma por número
  getDeckByNumber: async (standNumber: string) => {
    const response: AxiosResponse = await apiClient.get(`/deck/${standNumber}`)
    return response.data
  },

  // Obtener preferencias
  getPreferences: async () => {
    const response: AxiosResponse = await apiClient.get('/preferences')
    return response.data
  },

  // Actualizar preferencias
  updatePreferences: async (data: object) => {
    const response: AxiosResponse = await apiClient.post('/preferences', data)
    return response.data
  },

  // Agregar un rack
  addRack: async (data: object) => {
    const response: AxiosResponse = await apiClient.post('/rack', data)
    return response.data
  },

  // Agregar una plataforma
  addDeck: async (data: object) => {
    const response: AxiosResponse = await apiClient.post('/deck', data)
    return response.data
  },

  // Actualizar un rack
  updateRack: async (rackId: string, data: object) => {
    const response: AxiosResponse = await apiClient.put(`/rack/${rackId}`, data)
    return response.data
  },

  // Actualizar una plataforma
  updateDeck: async (standNumber: string, data: object) => {
    const response: AxiosResponse = await apiClient.put(`/deck/${standNumber}`, data)
    return response.data
  }
}
