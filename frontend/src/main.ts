import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router';
import "bootstrap"
import 'bootstrap-icons/font/bootstrap-icons.css';
import { translations } from '@/i18n';

createApp(App).use(router).use(translations).mount('#app')
