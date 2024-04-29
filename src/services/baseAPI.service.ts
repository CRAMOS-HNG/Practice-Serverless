import dotenv from 'dotenv';
dotenv.config(); 

import axios from 'axios';

const SWAPI_API = process.env.SWAPI_BASE_URL;

export const instanceSWAPI = axios.create({
  baseURL: SWAPI_API,
});
