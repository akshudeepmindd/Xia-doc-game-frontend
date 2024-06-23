import axios from "axios";

const ConfigBase = axios.create({
  baseURL: "https://xoc-dia-backend.onrender.com",
  headers: {
    "Content-type": "application/json",
  },
});

export default ConfigBase;
