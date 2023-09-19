import Axios from 'axios'

 const API_DOMAIN = 'https://api-warehouse.vps.vn/api' // db chính

//const API_DOMAIN = 'http://localhost:62648//api'// test local

export const APIKey = 'netcoApikey2025';
export const API_END_POINT = API_DOMAIN;
export const API_END_POINT_UPLOAD = 'https://api-v4-erp.vps.vn/api/ApiMain'
export const LINKErp = 'https://erp.vps.vn/';

export const api = Axios.create({
    baseURL: API_END_POINT,
    headers: {
        'Content-Type': 'application/json',
    },
})
export const setToken = (token) => {
    // api.defaults.headers.common.Authorization = `Bearer ${token}`
    api.defaults.headers.common.Authorization = token
}


