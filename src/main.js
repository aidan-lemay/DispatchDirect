import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'

import App from './App.vue'
import CallView from './components/views/CallView.vue';
import DispatchView from './components/views/DispatchView.vue';
import DashboardView from './components/views/DashboardView.vue';
import UnitView from './components/views/UnitView.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', component: CallView },
        { path: '/calls', component: CallView },
        { path: '/dispatch', component: DispatchView },
        { path: '/dashboard', component: DashboardView },
        { path: '/unit', component: UnitView }
    ]
});

document.title = 'DispatchDirect'

const app = createApp(App)

app.use(router)

app.mount('#app')