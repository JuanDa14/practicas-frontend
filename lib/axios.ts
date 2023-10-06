import axios from 'axios';

export const axiosBaseUrl = axios.create({
	baseURL: process.env.API_URL,
});
