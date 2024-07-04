import { createApp } from 'vue';
import './styles/reset.scss';
import App from './App.vue';
import router from './router';
import { vuetify } from '@/plugins/vuetify';
import '@/plugins/pwa';

import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
const app = createApp(App);
app.use(vuetify);
app.use(ArcoVue); // only use oreo-editor
app.use(router);

app.mount('#app');
