// src/api/auth.js
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export const login = async (email, password) => {
    try {
        const response = await axios.post(`http://54.206.84.11/login`, { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};
