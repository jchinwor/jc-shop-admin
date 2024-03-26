<script setup>
import { FilterMatchMode } from 'primevue/api';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onBeforeMount } from 'vue';
import { adminMainStore } from "@/store/mainStore"
// import ProductService from '@/service/ProductService';
import { useToast } from 'primevue/usetoast';
import axios from 'axios'


const toast = useToast();

const store = adminMainStore();
const { products, token, categories } = storeToRefs(store)
const { getProducts, updateProduct, deleteProductStore, deleteSelectedProductStore } = store


// const products = ref(null);
const productDialog = ref(false);
const deleteProductDialog = ref(false);
const deleteProductsDialog = ref(false);
const file = ref(null);
const product = ref({});
const selectedProducts = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);

//Product details

const productid = ref(null)
const productname = ref(null)
const productcategory = ref(null)
const productstock = ref(null)
const productoldprice = ref(null)
const productnewprice = ref(null)
const productdescription = ref(null)




onBeforeMount(() => {
    initFilters();
});
onMounted(() => {

   

   setTimeout(() => {

    getProducts()
    
   }, 3000);

});


const fileurl = ref(null)

const onUpload = async (event) => {
     file.value = event.files[0];
    fileurl.value = file.value.objectURL
   
};

const openNew = () => {
    product.value = {};
    submitted.value = false;
    productDialog.value = true;
};

const hideDialog = () => {
    productDialog.value = false;
    submitted.value = false;
};

const saveProduct = async() => {
    // submitted.value = true;

  
    
    if(file.value === null || product.value.name === undefined || product.value.countInStock === undefined || product.value.category === undefined || product.value.description === undefined || product.value.new_price === undefined || product.value.old_price === undefined){
       
        toast.add({ severity: 'error', summary: 'All Fields are required', detail: '', life: 3000 });
    }else{
        
         productid.value = product.value.id
         productname.value = product.value.name 
         productcategory.value = product.value.category
         productstock.value = product.value.countInStock
         productoldprice.value = product.value.old_price
         productnewprice.value = product.value.new_price
         productdescription.value = product.value.description

       

         if( productname.value === "" || productcategory.value === "" || productstock.value === "" || productoldprice.value === "" || productnewprice.value === ""){

              toast.add({ severity: 'error', summary: 'All Fields are required', detail: '', life: 3000 });
         }else{

            

            //Edit Product 
         if(productid.value){

            if(file.value.name){

                        // File/Product upload
            let formData = new FormData()
            formData.append('product', file.value)

            const mediaStoreRoute = '/api/upload'
            

            let result = await axios.post(mediaStoreRoute, formData)

                if(result.data.success !== undefined){

                        file.value = result.data.image_url

                        let productDetails = {
                            imageUrl: file.value,
                            name: productname.value,
                            category: productcategory.value,
                            description: productdescription.value,
                            old_price: productoldprice.value,
                            new_price: productnewprice.value,
                            countInStock: productstock.value,
                        }  
                
                    
                        let product = productDetails

                        updateProduct(productid.value,product).then((res) =>{

                             if(res.data.success){

                                product.value = {};
                                file.value = null
                                fileurl.value = null
                            
                                productDialog.value = false;

                                toast.add({ severity: 'success', summary: 'Success', detail: 'Category successfully Updated', life: 6000 });
                    
                                
                            }else{
                                    alert("No data inserted") 
                                }

                        })
                        

                    }else{
                    alert("error")
                    }


            }else{


                     let productDetails = {
                            imageUrl: file.value,
                            name: productname.value,
                            category: productcategory.value,
                            description: productdescription.value,
                            old_price: productoldprice.value,
                            new_price: productnewprice.value,
                            countInStock: productstock.value,
                        }  
                
                    
                        let product = productDetails

                        updateProduct(productid.value,product).then((res) =>{

                             if(res.data.success){

                              
                                productDialog.value = false;

                                toast.add({ severity: 'success', summary: 'Success', detail: 'Product successfully Updated', life: 3000 });
                    
                                
                            }else{
                                    alert("No data inserted") 
                                }

                        })

            }

                            



        }else{

                
            //Create New Products

                    // File/Category upload
            let formData = new FormData()
            formData.append('product', file.value)

            const mediaStoreRoute = '/api/upload'
            const addproductapi = '/api/products/addproduct'

            let result = await axios.post(mediaStoreRoute, formData)

                if(result.data.success !== undefined){

                        file.value = result.data.image_url

                          let productDetails = {
                            imageUrl: file.value,
                            name: productname.value,
                            category: productcategory.value,
                            description: productdescription.value,
                            old_price: productoldprice.value,
                            new_price: productnewprice.value,
                            countInStock: productstock.value,
                        }  
                
                    
                        let product = productDetails
                        

                        const config = {
                        headers: {
                            Authorization: `${token.value}`,
                            }
                        
                        }

                        let addresult = await axios.post(addproductapi, product,config)

                        if(addresult.data.success){

                                product.value = {};
                                productname.value = null
                                productcategory.value = null
                                productstock.value = null
                                productoldprice.value = null
                                productnewprice.value = null
                                productdescription.value = null
                                file.value = null
                                fileurl.value = null
                            
                                productDialog.value = false;

                                products.value = addresult.data.products

                                toast.add({ severity: 'success', summary: 'Success', detail: 'Product successfully created', life: 6000 });
                    
                                
                        }else{
                                alert("No data inserted") 
                            }




                    }else{
                    alert("error")
                    }

  
                }
        }

         }

       


   
};



const editProduct = (editProduct) => {
    product.value = { ...editProduct };
    productDialog.value = true;
     file.value = product.value.imageUrl

     
};

const confirmDeleteProduct = (editProduct) => {
    product.value = editProduct;
    deleteProductDialog.value = true;
};

const deleteProduct = (productid) => {

 deleteProductStore(productid).then((res)=>{
        if(res.data.success){ 

             products.value = products.value.filter((val) => val._id !== product.value._id);
            deleteProductDialog.value = false;
            product.value = {};

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
        }
    })


};

const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.value.length; i++) {
        if (products.value[i].id === id) {
            index = i;
            break;
        }
    }
    return index;
};

const confirmDeleteSelected = () => {
    deleteProductsDialog.value = true;
};
const deleteSelectedProducts = () => {
    

    deleteSelectedProductStore(selectedProducts.value).then(res=>{

        if(res.data.success){

            products.value = products.value.filter((val) => !selectedProducts.value.includes(val));
            deleteProductsDialog.value = false;
            selectedProducts.value = null;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Selected Category Deleted', life: 3000 });

        }

    })
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };
  
};
</script>

<template>
    <div class="grid">
        <div class="col-12" v-if="products.length">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Add Product" icon="pi pi-plus" class="mr-2" severity="" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedProducts || !selectedProducts.length" />
                        </div>
                    </template>

                  
                </Toolbar>
 
                <DataTable
                    ref="dt"
                    :value="products"
                    v-model:selection="selectedProducts"
                    dataKey="id"
                    :paginator="true"
                    :rows="5"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Products</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column field="code" header="Stock" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Stock</span>
                            {{ slotProps.data.countInStock }}
                        </template>
                    </Column>
                    <Column field="name" header="Name" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.name }}
                        </template>
                    </Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="slotProps.data.imageUrl" :alt="slotProps.data.name" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="price" header="Price" :sortable="true" headerStyle="width:14%; min-width:8rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Price</span>
                            {{ slotProps.data.new_price }}
                        </template>
                    </Column> 
                    <Column field="category" header="Category" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Category</span>
                            {{ slotProps.data.category }}
                        </template>
                    </Column>
                    <Column field="rating" header="Reviews" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Rating</span>
                            <Rating :modelValue="slotProps.data.averageRating" :readonly="true" :cancel="false" />
                        </template>
                    </Column>
                    <!-- <Column field="inventoryStatus" header="Status" :sortable="true" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Status</span>
                            <Tag :severity="getBadgeSeverity(slotProps.data.inventoryStatus)">{{ slotProps.data.inventoryStatus }}</Tag>
                        </template>
                    </Column> -->
                    <Column headerStyle="min-width:10rem;">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editProduct(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteProduct(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="productDialog" maximizable  :style="{ width: '600px' }" header="Product Details" :modal="true" class="p-fluid">
                    <div v-if="product.imageUrl">
                         <img :src="product.imageUrl" alt=""  width="150" class="mt-0 mx-auto mb-5 block shadow-2" />    
                   </div>
                   <div v-if="fileurl">
                        {{product.imageUrl = null}}
                        
                        <img :src="fileurl" alt=""  width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                        <b class="text-center mb-2 block" >Selected Image</b>
                   </div>
                    <div class="field">
                        <label for="name">Product Image</label>
                          <FileUpload mode="basic" name="demo[]" :auto="true" customUpload  accept="image/*" required="true"   :maxFileSize="1000000" @uploader="onUpload"  />                       
                    </div>
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="product.name" required="true" autofocus :invalid="submitted && !product.name" />
                        <small class="p-invalid" v-if="submitted && !product.name">Name is required.</small>
                    </div>
                    <div class="field">
                        <label for="name">Quantity in Stock</label>
                        <InputNumber id="quantity" v-model="product.countInStock" integeronly />
                      
                    </div>
                      <div class="formgrid grid">
                        <div class="field col">
                            <label for="price">Price</label>
                            <InputNumber id="price" v-model="product.old_price" mode="currency" currency="USD" locale="en-US" :invalid="submitted && !product.price" :required="true" />
                           
                        </div>
                        <div class="field col">
                            <label for="sale">Discounted Price</label>
                            <InputNumber id="saleprice" v-model="product.new_price" mode="currency" currency="USD" integeronly />
                        </div>
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                       
                         <Editor id="description" v-model="product.description" editorStyle="height: 320px" />
   
                         </div>
                   

                  

                    <div class="field">
                        <label class="mb-3">Category</label>
                       
                        <div class="formgrid grid">
                            <div v-for="category in categories" :key="category._id" class="field-radiobutton col-6">
                                
                                <RadioButton v-model="product.category" :inputId="category._id" name="dynamic" :value="category.categoryName" />
                                <label :for="category._id" class="ml-2">{{ category.categoryName }}</label>
                            </div>
                           
                           
                        </div>
                    </div>

                  
                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" text="" @click="saveProduct" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product"
                            >Are you sure you want to delete <b>{{ product.name }}</b
                            >?</span
                        >
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteProduct(product._id)" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteProductsDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="product">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteProductsDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteSelectedProducts" />
                    </template>
                </Dialog>
            </div>
        </div>
        <div v-else class="flex  justify-content-center  col-12">
             <ProgressSpinner />
        </div>
    </div>
</template>
