import { createApp } from 'vue'
import App from './App.vue';
import './assets/tailwind.css';
import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { GiTomato, GiCheeseWedge } from 'oh-vue-icons/icons'
import router from './router/index.js';

addIcons(GiTomato, GiCheeseWedge)

const app = createApp(App)
app.component('v-icon', OhVueIcon)
app.use(router);
app.mount('#app');