import axios from 'axios';
import cookies from 'react-cookies';
const API_URL = "http://localhost:8080/"

export const endpoints = {
  'users': 'api/users',   
  'login': 'api/login',
  'profile': 'api/secure/profile',
  'updateProfile': 'api/secure/profile/update',
  'approveChef': (id) => `api/admin/approve-chef/${id}`,
  'categories': '/api/categories', 
  'dishes': '/api/dishes',
  'dish-details': (dishId) => `/api/dishes/${dishId}`,
};

export const authApis = () => {
    console.info(cookies.load('token'))
    return axios.create({
        baseURL: API_URL,
        headers: {
            'Authorization': `Bearer ${cookies.load('token')}`
        },
        withCredentials: true
    })
}

export default axios.create({
  baseURL: API_URL,
  withCredentials: true
});