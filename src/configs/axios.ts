import axios from 'axios';
import Cookies from 'js-cookie';

// let baseURL =
//   process.env.REACT_APP_ENV === 'development'
//     ? 'http://localhost:5000/api'
//     : 'https://api-ds.onrender.com/api';

let instance = axios.create({
    baseURL: 'http://localhost:5000/api',
});
// `${process.env.NEXT_PUBLIC_API_URL}/api`
// 'http://localhost:5000/api'
// Set the AUTH token for any request
instance.interceptors.request.use(function (config) {
    const token: any = Cookies.get('token') ? Cookies.get('token') : '';
    config.headers!.Authorization = `Bearer ${atob(token)}`;
    return config;
});

export default instance;
