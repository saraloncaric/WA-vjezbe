import { createRouter, createWebHistory } from "vue-router";
import PizzaList from "@/components/PizzaList.vue";
import PizzaDetail from "@/components/PizzaDetail.vue";

const routes = [
    {
        path:'/',
        redirect: '/pizze'
    },
    {
        path:'/pizze',
        component: PizzaList
    },
    {
        path:'/pizze/:naziv',
        component: PizzaDetail
    }
]
const router = createRouter({
    history: createWebHistory(),
    routes
});
export default router;