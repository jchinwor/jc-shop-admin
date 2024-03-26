<script setup>
import { useLayout } from '@/layout/composables/layout';
import { ref, computed } from 'vue';
import AppConfig from '@/layout/AppConfig.vue';
import { useToast } from 'primevue/usetoast';
import { storeToRefs } from 'pinia';
import { adminMainStore } from "@/store/mainStore"
import { useRouter } from 'vue-router'


const store = adminMainStore();
const { token,adminData } = storeToRefs(store)
const { authAdmin, isLoggedIn } = store

const router = useRouter()
const toast = useToast();

const { layoutConfig } = useLayout();
const email = ref('');
const password = ref('');
const checked = ref(false);

const Login = () => {

    if(email.value === "" || password.value ==""){

        toast.add({ severity: 'error', summary: 'All Fields are required', detail: '', life: 3000 });
    }else{

         authAdmin(email.value,password.value).then(result=>{

        if(result.data.success){

          if(adminData.value && adminData.value.isAdmin){

             //Search for redirect path
                                let searchParams = new URLSearchParams(window.location.search);
                                setTimeout(() => {


                                    if (searchParams.has("redirect")) {

                                         router.push({ path: `${searchParams.get("redirect")}` });

                                    } else {
                                        
                                        router.push({ name: "DashboardPage" });
                                        
                                        }

                                

                                }, 2000) 

           


          }else{

             toast.add({ severity: 'error', summary: 'User is not an Admin', detail: '', life: 3000 });
             
          }
  


        }else{

          toast.add({ severity: 'error', summary: 'Invalid login credentials!', detail: '', life: 3000 });
        }
  })




    }

}

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});
</script>

<template>
    <div class="surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
        <div class="flex flex-column align-items-center justify-content-center">
            <img src="/src/assets/dark.png" alt="Sakai logo" class="mb-5 w-6rem flex-shrink-0" />
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full surface-card py-8 px-5 sm:px-8" style="border-radius: 53px">
                    <div class="text-center mb-5">
                        <img src="/src/assets/usericon.png" alt="Image" height="50" class="mb-3" />
                        <div class="text-900 text-3xl font-medium mb-3">Welcome Back!</div>
                        <span class="text-600 font-medium">Admin Login</span>
                    </div> 

                    <div>
                        <label for="email1" class="block text-900 text-xl font-medium mb-2">Email</label>
                        <InputText id="email1" type="email" placeholder="Email address" class="w-full md:w-30rem mb-5" style="padding: 1rem" v-model="email" />

                        <label for="password1" class="block text-900 font-medium text-xl mb-2">Password</label>
                        <Password id="password1" v-model="password" placeholder="Password" :toggleMask="true" class="w-full mb-3" inputClass="w-full" :inputStyle="{ padding: '1rem' }"></Password>

                        <div class="flex align-items-center justify-content-between mb-5 gap-5">
                            <div class="flex align-items-center">
                                <Checkbox v-model="checked" id="rememberme1" binary class="mr-2"></Checkbox>
                                <label for="rememberme1">Remember me</label>
                            </div>
                            <a class="font-medium no-underline ml-2 text-right cursor-pointer" style="color: var(--primary-color)">Forgot password?</a>
                        </div>
                        <Button label="Sign In" class="w-full p-3 text-xl" @click="Login"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <AppConfig simple />
    <Toast />
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
