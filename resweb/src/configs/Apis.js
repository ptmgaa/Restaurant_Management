import axios from 'axios';
import cookies from 'react-cookies';
const API_URL = "http://localhost:8080"

export const endpoints = {
  'users': '/api/users',   
  'login': '/api/login',
  'profile': '/api/secure/profile',
  'update-profile': '/api/secure/profile/update',
  'approve-chef': (id) => `/api/admin/approve-chef/${id}`,
  'categories': '/api/categories',
  'dishes': '/api/dishes',
  'menus': '/api/menus',
  'secure-dishes': '/api/secure/dishes',
  'delete-dish': (dishId) => `/api/secure/dishes/${dishId}`,
  'dish-details': (dishId) => `/api/dishes/${dishId}`,
  'reviews': (dishId) => `/api/dishes/${dishId}/reviews`,
  'add-review': (dishId) => `/api/secure/dishes/${dishId}/reviews`,
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
<<<<<<< HEAD
});
=======
});
>>>>>>> 86e8e36df4763f6991a047555adfc41009bcb0f7
