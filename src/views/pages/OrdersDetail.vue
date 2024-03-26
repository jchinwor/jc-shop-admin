<template>
<div className="card">
    <div class="">
        <h2>Customer Order</h2> 
        <p class="mb-3"><b>ORDERID:</b> {{orderid}}</p>
    </div>
  <div class="flex flex-column lg:flex-row" >
    
       <div class="flex-1">

        <div class="card flex justify-content-start  gap-3">
        <Button type="button" label="Order" icon="pi pi-box" class="text-color " style="backgroundColor: var(--highlight-bg)"  />
        <Button type="button" label="Payment" icon="pi pi-wallet" class="text-color " style="backgroundColor: var(--highlight-bg)"  />
      
      </div>
       <div class="card mt-4">
        
        <Panel header="Customer Order Details" toggleable> 
             <div >

                     <p class="uppercase">
                      <span class="mr-2 ">
                        {{Customer_shippingAddress.firstname}}
                      </span>
                      <span>
                        {{Customer_shippingAddress.lastname}}
                      </span>
                    </p>
                    <p>
                       {{Customer_shippingAddress.email}}
                    </p>
                    <Divider />
                    <b>
                      Shipping:
                    </b>
                    <p class="text-500">
                        {{Customer_shippingAddress.address}}  / {{Customer_shippingAddress.city}} / {{Customer_shippingAddress.country}} / {{Customer_shippingAddress.phonenumber}}
                    </p>

                    
                      <div v-if="Customer_order.isPaid">
                            <Button label="" severity="primary" raised  outlined >
                                Paid on {{moment(Customer_order.paidAt).calendar() }}
                            </Button>
                      </div>
                      <div v-else>
                          <Button label="" severity="warning" raised  outlined >
                                Not Paid
                            </Button>
                      </div>
                  
                    <Divider />
                       <b >
                        Delivery Status:
                      </b>
                     <div v-if="Customer_order.isDelivered">
                            <Button label="" severity="primary" raised  outlined >
                                Delivered on {{moment(Customer_order.deliveredAt).calendar() }}
                            </Button>
                      </div>
                      <div v-else class="mt-3">
                          
                            <Button label="" severity="danger"  raised>
                              Not Delivered
                            </Button>
                      </div>

                     <p>
                       
                     </p>

            </div>
          
                
        </Panel>
    </div>

        <div class="card mt-4">
        <Panel header="Customer Order(s)" toggleable>
            <div class="grid " >
                <div class="col-12 border-50 md:col-6 lg:col-6 border-1 border-round " v-for="product in Customer_order.cartItems" :key="product.id">

                        <div class="flex  align-items-start justify-content-start  font-bold   border-round" >     
                        <router-link :to="'/products/'+product.id">
                            <div class="flex ">
                                <div>
                                    <Avatar :image="product.imageUrl" class="flex bg-contain align-items-center justify-content-center mr-2" size="xlarge" />
                                    
                                </div>
                            </div>
                        </router-link>
                        <div>
                            <p class="text-xs">
                                {{product.name.substring(0,120)}}
                            </p>
                            <p class="text-xs">
                               <span> QTY: {{product.quantity}}</span> <span class="text-500">Unit Price :  ${{ product.new_price.toFixed(2)}}</span>
                            </p>
                            <p class="text-sm">
                                
                            </p>
                        
                        </div>
                        </div>

                </div>

            </div>

        </Panel>
    </div>
</div>

<div class="my-5 ">
     <div class="surface-0 border-round px-3 lg:mx-3 py-3 my-3">
          <b class="">
            Payment Method
          </b>
          <div class="card flex justify-content-start mt-3">
            <div class="flex flex-column gap-2">
                <div class="flex align-items-center">
                    <RadioButton v-model="Customer_order.paymentMethod"  name="dynamic" :value="Customer_order.paymentMethod" />
                    <label  class="ml-2">{{ Customer_order.paymentMethod }}</label>
                </div>
            </div>
         </div>
      </div>
      
       <div class="surface-0 border-round px-3 py-3 lg:mx-3 " >
             <b class="">
               ORDER SUMMARY
            </b>
           <div class="flex-column mx-2 ">
              <div class="flex align-items-between justify-content-between gap-4  font-bold  border-round">
                <p class="text-500">
                  SubTotal
                </p>
                <p class="" v-if="SubtotalPrice">
                  
                  ${{ SubtotalPrice.toFixed(2) }}
                </p>
              </div>
              <div class="flex align-items-between justify-content-between  font-bold  border-round">
                <p class="text-500">
                  Tax
                </p>
                <p class="">
                  ${{Customer_order.taxPrice}}
                </p>
              </div>
              <div class="flex align-items-between justify-content-between  font-bold  border-round">
                <p class="text-500">
                  Shipping
                </p>
                <p class="">
                  ${{Customer_order.shippingPrice}}
                </p>
              </div>
              <Divider />
              <div class="flex align-items-between justify-content-between  font-bold  border-round">
                <p class="">
                  Total
                </p>
                <p class="" v-if="Customer_order.totalPrice">
                  ${{ Customer_order.totalPrice.toFixed(2) }}
                </p>
              </div>
              <div class="flex flex-wrap justify-content-start  gap-3 " >
                <div v-if="Customer_order.paymentMethod === 'Paypal' && !Customer_order.isPaid">
                  <div id="paypal-button-container"></div>
                </div>
                <div v-else-if="Customer_order.paymentMethod === 'Paystack' && !Customer_order.isPaid">
                    
                      <div class="flex flex-column">
                              <paystack
                            buttonClass="button-class"
                            buttonText="Make Payment"
                            :publicKey="`${publicKeyPaystack}`"
                            :email="Customer_order.shippingAddress.email"
                            :amount="Customer_order.totalPrice *100"
                            :currency="GHS"
                            :reference="reference"
                            :onSuccess="onSuccessfulPayment"
                            :onCanel="onCancelledPayment"
                          ></paystack>

                          <img :src="secured_paystack" alt="">
                      </div>
                    
                </div>
                <div v-else-if="Customer_order.paymentMethod === 'Flutterwave' && !Customer_order.isPaid">
                     
                         <p>
                            Flutterwave button goes here
                         </p>
                     
                </div>
                <div v-else class="flex flex-column gap-3">
                     <Button class="p-button-label px-7" label="Order Complete" icon="pi pi-check-circle" disabled />
                     <div v-if="Customer_order.isPaid && !Customer_order.isDelivered">
                        <Button severity="contrast" class="p-button-label px-7" @click="deliveredFtn(Customer_order._id)" label="MARK AS DELIVERED" icon="pi pi-check-circle"  />
                     
                     </div>
                </div> 

                <!-- <PaypalButtons :reference="reference" /> -->
              </div>
             
          </div>
       </div>
       
    </div>
     
     
  </div>
</div>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { ref, onMounted, onBeforeMount, computed } from 'vue';
import { adminMainStore } from "@/store/mainStore"
import { useRoute } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import moment from 'moment';

const store = adminMainStore();
const { token,Customer_shippingAddress, Customer_order } = storeToRefs(store)
const { getCustomerOrder,DeliveredOrder } = store

const route = useRoute();  
const orderid = route.params.id
const toast = useToast()


getCustomerOrder(token.value,orderid)

const SubtotalPrice = computed(() => {
              if(Customer_order.value.cartItems){

                    return Customer_order.value.cartItems.reduce(
                      (sum, item) => sum + (Number(item.new_price) * Number(item.quantity)),
                      0,
                    );
              }
  })


const deliveredFtn = (orderid) =>{

    DeliveredOrder(token.value,orderid)
}
</script>

<style>

</style>