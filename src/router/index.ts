import { createRouter, createWebHashHistory } from 'vue-router';
import { checkVersion } from '@/plugins/pwa';

const router = createRouter({
    history: createWebHashHistory(),
    scrollBehavior() {
        return { top: 0 };
    },
    routes: [
        {
            path: '/',
            name: 'oreo',
            meta: {
                title: 'Oreo Editor',
                icon: 'mdi-alpha-o',
                keepAlive: false,
                visible: true,
            },
            component: () => import('@/views/oreo-editor/index.vue'),
            children: [],
        },
    ],
});

router.beforeEach((to, _from, next) => {
    next();
});

router.afterEach(() => {
    checkVersion();
});
export default router;
