<script setup>
import Divider from 'primevue/divider';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { adminMainStore } from "@/store/mainStore"

import AppMenuItem from './AppMenuItem.vue';

const store = adminMainStore();
const { LogOut } = store

const LogoutFtn = () =>{

    LogOut()
}

const model = ref([
    {
        label: 'Home',
        items: [{ label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Manage Products',
        items: [{ label: 'Products', icon: 'pi pi-fw pi-box', to: '/manage/products' }]
    },
    {
        label: 'Manage Categories',
        items: [{ label: 'Categories', icon: 'pi pi-fw pi-box', to: '/manage/categories' }]
    },
    {
        label: 'Manage Orders',
        items: [{ label: 'Orders', icon: 'pi pi-fw pi-box', to: '/manage/orders' }]
    },

]);
</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
        <hr />
       <div>
         <Button type="button" label="Logout" icon="pi pi-sign-out" badgeSeverity="contrast" outlined @click="LogoutFtn" />
    
       </div>
       
    </ul>
</template>

<style lang="scss" scoped></style>
