import Axios from 'axios';

const axios = Axios.create({
    baseURL: 'http://localhost:3000',
});

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default axios;