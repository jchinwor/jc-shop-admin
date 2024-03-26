
<template>
     <div class="card">
       
        <DataTable :value="orders" tableStyle="min-width: 50rem" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
            <template #header>
                <div class="flex flex-wrap align-items-center justify-content-between gap-2">
                    <span class="text-xl text-900 font-bold">Orders</span>
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
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { adminMainStore } from "@/store/mainStore"
import { ref, onMounted } from 'vue';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import moment from 'moment';
import router from "@/router";

const store = adminMainStore();
const { orders } = storeToRefs(store)
const { getOrders } = store

const formatCurrency = (value) => {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
};

onMounted(() => {

   getOrders()

});


const editOrder = (id) =>{

     router.push({

                  path: `/orders/${id}/`

                })
}

</script>