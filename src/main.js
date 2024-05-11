import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'

import App from './App.vue'
import LandingView from './components/views/LandingView.vue';
import CallView from './components/views/CallView.vue';
import UnitView from './components/views/UnitView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes:[
        { path: '/', component: LandingView },
        { path: '/calls', component: CallView },
        { path: '/units', component: UnitView }
    ]
});

const app= createApp(App)

app.use(router)

app.mount('#app')