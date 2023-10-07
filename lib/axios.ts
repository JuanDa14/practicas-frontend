import axios from 'axios';

export const axiosBaseUrl = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL,
});
