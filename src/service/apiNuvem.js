const axios = require("axios");

const api = axios.create({
  baseURL: "https://us-central1-lms-nuvem-mestra.cloudfunctions.net/"
});

module.exports = api;
