import { createApp } from 'vue';
import './styles/reset.scss';
import App from './App.vue';
import router from './router';
import { vuetify, arcoVue } from '@/plugins';
const app = createApp(App);
app.use(vuetify);
app.use(arcoVue); // only use oreo-editor
app.use(router);

app.mount('#app');
