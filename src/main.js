import Vue from 'vue'
import router from './router';
import App from './App.vue'
import vuetify from './plugins/vuetify';
import axios from 'axios';
//TODO: Check all console logs
Vue.config.productionTip = false

const baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://ira-dev.herokuapp.com'
const axiosInstance = axios.create({
  baseURL: baseURL,
});

axiosInstance.interceptors.request.use(
  config => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user ? user.token : null;
    if(token){
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config;
  },
  error => {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    if(error.response.status === 401){
      localStorage.removeItem('user');
      return error;
    }
    return Promise.reject(error);
  }
)

Vue.prototype.$http = axiosInstance
new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
