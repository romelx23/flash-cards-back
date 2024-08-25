const axios = require("axios");

class AIAPIClient {
  constructor(baseURL = "", apiKey = "") {
    this.axiosInstance = axios.create({
      baseURL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    });
  }

  // Ejemplo de una llamada GET
  get(url = "", config = {}) {
    return this.axiosInstance.get(url, config);
  }

  // Ejemplo de una llamada POST
  post(url = "", data = {}, config = {}) {
    return this.axiosInstance.post(url, data, config);
  }
}

// Instancia del cliente API
const geminiAPI = new AIAPIClient("https://api.gemini.com", "TU_API_KEY_AQUI");

module.exports = geminiAPI;
