import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import './assets/theme/index.css';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(ElementUI, {
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
