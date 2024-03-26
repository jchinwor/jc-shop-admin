<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue';
import ProductService from '@/service/ProductService';
import { useLayout } from '@/layout/composables/layout';
import { storeToRefs } from 'pinia';
import { adminMainStore } from "@/store/mainStore"
import moment from 'moment';
import router from "@/router";

const store = adminMainStore();
const { orders,users, products } = storeToRefs(store) 
const { getOrders,getUsers,getProducts } = store

const { isDarkTheme } = useLayout();

// const products = ref(null);



const editOrder = (id) =>{

     router.push({

                  path: `/orders/${id}/`

                })
}

const lineData = reactive({
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
});
const items = ref([
    { label: 'Add New', icon: 'pi pi-fw pi-plus' },
    { label: 'Remove', icon: 'pi pi-fw pi-minus' }
]);
const lineOptions = ref(null);
const productService = new ProductService();

onMounted(() => {
    getOrders() 
    getUsers()
    getProducts()
    // productService.getProductsSmall().then((data) => (products.value = data));
});


//Calculate TotalSale

let totalsale = 0;
if(orders.value){
    orders.value.map((order) =>( 
        
        order.isPaid === true  ?   (totalsale = totalsale + order.totalPrice) : null

    ));
}

const totalRevenue = computed(() => {
              
                    let totalsale = 0;

                if(orders.value){
                      orders.value.map((order) => {

                        if(order.isPaid === true){

                            return (totalsale = totalsale + order.totalPrice)
                        }

                     
                    })
                }

                    
             
  })

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};
const applyLightTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#495057'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            },
            y: {
                ticks: {
                    color: '#495057'
                },
                grid: {
                    color: '#ebedef'
                }
            }
        }
    };
};

const applyDarkTheme = () => {
    lineOptions.value = {
        plugins: {
            legend: {
                labels: {
                    color: '#ebedef'
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            },
            y: {
                ticks: {
                    color: '#ebedef'
                },
                grid: {
                    color: 'rgba(160, 167, 181, .3)'
                }
            }
        }
    };
};

watch(
    isDarkTheme,
    (val) => {
        if (val) {
            applyDarkTheme();
        } else {
            applyLightTheme();
        }
    },
    { immediate: true }
);
</script>

<template>
    <div class="grid">
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Orders</span>
                        <div class="text-900 font-medium text-xl">
                           {{orders.length}}
                        </div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-blue-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-shopping-cart text-blue-500 text-xl"></i>
                    </div>
                </div>
             
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>  
                        <span class="block text-500 font-medium mb-3">Revenue</span>
                        <div class="text-900 font-medium text-xl">${{ totalsale }}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-orange-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-chart-bar text-orange-500 text-xl"></i>
                    </div>
                </div>
             
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Customers</span>
                        <div class="text-900 font-medium text-xl">{{users.length}}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-cyan-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-users text-cyan-500 text-xl"></i>
                    </div>
                </div>
            
            </div>
        </div>
        <div class="col-12 lg:col-6 xl:col-3">
            <div class="card mb-0">
                <div class="flex justify-content-between mb-3">
                    <div>
                        <span class="block text-500 font-medium mb-3">Total Products</span>
                        <div class="text-900 font-medium text-xl">{{products.length}}</div>
                    </div>
                    <div class="flex align-items-center justify-content-center bg-purple-100 border-round" style="width: 2.5rem; height: 2.5rem">
                        <i class="pi pi-box text-purple-500 text-xl"></i>
                    </div>
                </div>
            
            </div>
        </div>

        <div class="col-12 xl:col-12">
             <DataTable :value="orders.slice(0).slice(-8)" :rows="5" :paginator="true" responsiveLayout="scroll">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Latest Orders</span>
                    <Button icon="pi pi-refresh" rounded raised />
                </div>
            </template>
            <Column field="shippingAddress.firstname" header="Name"></Column>
            <Column field="shippingAddress.email" header="Email"></Column>
            <Column field="totalPrice" header="Total">
                <template #body="slotProps">
                    {{ formatCurrency(slotProps.data.totalPrice) }}
                </template>
            </Column>
             <Column header="Payment Status">
                <template #body="slotProps">
                   <div v-if="slotProps.data.isPaid">
                      <Tag  severity="success" rounded >
                        Paid On  {{moment(slotProps.data.paidAt).format('LLL') }}
                      </Tag>
                       
                   </div>
                   <div v-else>
                      <Tag severity="danger" value="Not Paid" rounded></Tag>
                   </div>
                </template>
            </Column>
            <Column  header="Date">
             <template #body="slotProps">
               {{moment(slotProps.data.createdAt).format('LLL')}}
             </template>
            </Column>
              <Column header="Delivery Status">
                <template #body="slotProps">
                   <div v-if="slotProps.data.isDelivered">
                      <Tag  severity="success" rounded >
                        Delivered 
                      </Tag>
                       
                   </div>
                   <div v-else>
                      <Tag severity="contrast" value="Not Delivered" rounded></Tag>
                   </div>
                </template>
            </Column>
            <Column width="100">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editOrder(slotProps.data._id)" />
                   
                </template>
            </Column>
      
           
          
        </DataTable>
        </div>

        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Sales Overview</h5>
                
                <div>
                    <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="100%" height="480" src="https://charts.mongodb.com/charts-project-0-kuylv/embed/charts?id=6601741b-9b0e-44f8-880b-3b43227139ab&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"></iframe>
                </div>
           
            </div>
            
        </div>
        <div class="col-12 xl:col-6">
            <div class="card">
                <h5>Products Satatistics</h5>
                <!-- <Chart type="line" :data="lineData" :options="lineOptions" /> -->
                <div>
                       <iframe style="background: #FFFFFF;border: none;border-radius: 2px;box-shadow: 0 2px 10px 0 rgba(70, 76, 79, .2);" width="100%" height="480" src="https://charts.mongodb.com/charts-project-0-kuylv/embed/charts?id=660176df-05a9-4eee-811c-03ec2b9f50ce&maxDataAge=3600&theme=light&autoRefresh=true&attribution=false"></iframe>
                    </div>
            </div>
           
          
        </div>
    </div>
</template>
