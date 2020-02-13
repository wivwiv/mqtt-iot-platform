import Vue from 'vue';
import ElementUI from 'element-ui';
import './assets/style/element-variables.scss';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(ElementUI, {
  size: 'small',
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
