import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';
import DashboardPage from '../views/Dashboard.vue'
import { adminMainStore } from "@/store/mainStore"

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'DashboardPage',
                    component: DashboardPage,
                    meta:{
                    title:'Dashboard', 
                    requiresAuth:true,     
                    },
                },
                {
                    path: '/manage/products',
                    name: 'dashboard',
                    component: () => import('@/views/pages/Product.vue'),
                    meta:{
                        title:'Manage Products', 
                        requiresAuth:true,     
                        },
                },
                {
                    path: '/manage/categories',
                    name: 'Categories',
                    component: () => import('@/views/pages/Category.vue'),
                    meta:{
                        title:'Manage Categories', 
                        requiresAuth:true,     
                        },
                },
                {
                    path: '/manage/orders',
                    name: 'Orders',
                    component: () => import('@/views/pages/Orders.vue'),
                    meta:{
                        title:'Manage Orders', 
                        requiresAuth:true,     
                        },
                },
                {
                    path: '/orders/:id',
                    name: 'OrdersDetail',
                    component: () => import('@/views/pages/OrdersDetail.vue'),
                    meta:{
                        title:'Orders Details', 
                        requiresAuth:true,     
                        },
                },
             
               
               
            ]
        },
        {
            path: '/pages/notfound',
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta:{

                title: "Login",
                requiresGuest:true,
            }
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});

router.beforeEach(async (to, from, next) =>{

    document.title = `${to.meta.title} :: JSTORE ADMIN` ; 
  
    const store = adminMainStore();
    const { isLoggedIn } = store
  
    if(to.matched.some(record => record.meta.requiresAuth)){
  
      
  
       if(!isLoggedIn()){ 
  
         //Redirect to the login page
  
        
        //Check for redirect and redirect users to initial page after login
         next({
              path: "/auth/login",
              query: { redirect: to.fullPath }
          });
  
         
       }else{
          next()
       }
    }else if(to.matched.some(record => record.meta.requiresGuest)){
      if(isLoggedIn()){
        //Redirect to the login page
  
        next('/')
  
      }else{
         next()
      }
    }else{ 
       next()
    }
    
  
  })

export default router;
