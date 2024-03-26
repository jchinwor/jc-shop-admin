<script setup>
import { FilterMatchMode } from 'primevue/api';
import { storeToRefs } from 'pinia';
import { ref, onMounted, onBeforeMount } from 'vue';
import { adminMainStore } from "@/store/mainStore"
import axios from 'axios'
import { useToast } from 'primevue/usetoast';


const toast = useToast();

const store = adminMainStore();
const { token, categories } = storeToRefs(store)
const { getCategory, updateCategory, deleteCategoryStore, deleteSelectedCategoryStore } = store



const categoryDialog = ref(false);
const categoryName =ref(null)
const categoryid =ref(null)
const categoryDescription = ref(null)
const file = ref(null);
const deleteCategoryDialog = ref(false);
const deleteCategoriesDialog = ref(false);
const category = ref({});
const selectedCategories = ref(null);
const dt = ref(null);
const filters = ref({});
const submitted = ref(false);






onBeforeMount(() => {
    initFilters();
});
onMounted(() => {

   getCategory()

});
// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

const fileurl = ref(null)

const onUpload = async (event) => {
     file.value = event.files[0];
    fileurl.value = file.value.objectURL
   
};


const openNew = () => {
    category.value = {};
    submitted.value = false;
    categoryDialog.value = true;
};

const hideDialog = () => {
    categoryDialog.value = false;
    submitted.value = false;
};

const saveCategory = async() => {
    // submitted.value = true;
    
  

    if(file.value === null || category.value.categoryName === undefined || category.value.categoryDescription === undefined){
       
        toast.add({ severity: 'error', summary: 'All Fields are required', detail: '', life: 3000 });
    }else{
        
         categoryid.value = category.value._id
         categoryName.value = category.value.categoryName 
         categoryDescription.value = category.value.categoryDescription

         

         if( categoryName.value === "" || categoryDescription.value === ""){

              toast.add({ severity: 'error', summary: 'All Fields are required', detail: '', life: 3000 });
         }else{


             if(category.value._id){

            if(file.value.name){

                        // File/Product upload
            let formData = new FormData()
            formData.append('product', file.value)

            const mediaStoreRoute = '/api/upload'
            const updatecategoryapi = '/api/categories/addCategories'

            let result = await axios.post(mediaStoreRoute, formData)

                if(result.data.success !== undefined){

                        file.value = result.data.image_url

                        let categoryDetails = {
                            imageUrl: file.value,
                            categoryName: categoryName.value,
                            categoryDescription: categoryDescription.value,
                        }  
                
                    
                        let category = categoryDetails

                        updateCategory(categoryid.value,category).then((res) =>{

                             if(res.data.success){

                                categoryDescription.value = null
                                categoryName.value = null
                                category.value = {};
                                file.value = null
                                fileurl.value = null
                            
                                categoryDialog.value = false;

                                toast.add({ severity: 'success', summary: 'Success', detail: 'Category successfully Updated', life: 6000 });
                    
                                
                            }else{
                                    alert("No data inserted") 
                                }

                        })
                        

                    }else{
                    alert("error")
                    }


            }else{


                    let categoryDetails = {
                            imageUrl: file.value,
                            categoryName: categoryName.value,
                            categoryDescription: categoryDescription.value,
                        }  
                  
                    
                        let category = categoryDetails

                        updateCategory(categoryid.value,category).then((res) =>{

                             if(res.data.success){

                                // categoryDescription.value = null
                                // categoryName.value = null
                                // category.value = {};
                                // file.value = null
                                // fileurl.value = null
                            
                                categoryDialog.value = false;

                                toast.add({ severity: 'success', summary: 'Success', detail: 'Category successfully Updated', life: 6000 });
                    
                                
                            }else{
                                    alert("No data inserted") 
                                }

                        })

            }

                            



        }else{


                    // File/Category upload
            let formData = new FormData()
            formData.append('product', file.value)

            const mediaStoreRoute = '/api/upload'
            const addcategoryapi = '/api/categories/addCategories'

            let result = await axios.post(mediaStoreRoute, formData)

                if(result.data.success !== undefined){

                        file.value = result.data.image_url

                        let categoryDetails = {
                            imageUrl: file.value,
                            categoryName: categoryName.value,
                            categoryDescription: categoryDescription.value,
                        }  
                
                    
                        let category = categoryDetails
                        

                        const config = {
                        headers: {
                            Authorization: `${token.value}`,
                            }
                        
                        }

                        let addresult = await axios.post(addcategoryapi, category,config)

                        if(addresult.data.success){

                                categoryDescription.value = null
                                categoryName.value = null
                                category.value = {};
                                file.value = null
                                fileurl.value = null
                            
                                categoryDialog.value = false;

                                categories.value = addresult.data.categories

                                toast.add({ severity: 'success', summary: 'Success', detail: 'Category successfully created', life: 6000 });
                    
                                
                        }else{
                                alert("No data inserted") 
                            }




                    }else{
                    alert("error")
                    }

  
                }
        }

         }

       


    
    // if (product.value.name && product.value.name.trim() && product.value.price) {
    //     if (product.value.id) {
    //         product.value.inventoryStatus = product.value.inventoryStatus.value ? product.value.inventoryStatus.value : product.value.inventoryStatus;
    //         products.value[findIndexById(product.value.id)] = product.value;
    //         toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Updated', life: 3000 });
    //     } else {
    //         product.value.id = createId();
    //         product.value.code = createId();
    //         product.value.image = 'product-placeholder.svg';
    //         product.value.inventoryStatus = product.value.inventoryStatus ? product.value.inventoryStatus.value : 'INSTOCK';
    //         products.value.push(product.value);
    //         toast.add({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
    //     }
    //     categoryDialog.value = false;
    //     product.value = {};
    // }
};

const editCategory = (editCategory) => {
    category.value = { ...editCategory };
    categoryDialog.value = true;

    file.value = category.value.categoryImage

    
};

const confirmDeleteCategory = (editProduct) => {
    category.value = editProduct;
    deleteCategoryDialog.value = true;
};

const deleteCategory = (categoryid) => {
   
// categoryid.value = category.value._id

    deleteCategoryStore(categoryid).then((res)=>{
        if(res.data.success){ 

             categories.value = categories.value.filter((val) => val._id !== category.value._id);
            deleteCategoryDialog.value = false;
            category.value = {};

            toast.add({ severity: 'success', summary: 'Successful', detail: 'Category Deleted', life: 3000 });
        }
    })

    
};

const findIndexById = (_id) => {
    let index = -1;
    for (let i = 0; i < categories.value.length; i++) {
        if (categories.value[i]._id === _id) {
            index = i;
            break;
        }
    }
    return index;
};

const createId = () => {
    let id = '';
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
};

const confirmDeleteSelected = () => {
    deleteCategoriesDialog.value = true;

    
};
const deleteselectedCategories = () => {

    deleteSelectedCategoryStore(selectedCategories.value).then(res=>{

        if(res.data.success){

            categories.value = categories.value.filter((val) => !selectedCategories.value.includes(val));
            deleteCategoriesDialog.value = false;
            selectedCategories.value = null;
            toast.add({ severity: 'success', summary: 'Successful', detail: 'Selected Category Deleted', life: 3000 });

        }

    })
    
};

const initFilters = () => {
    filters.value = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    };

    console.log(filters.value)
};
</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card">
                <Toolbar class="mb-4">
                    <template v-slot:start>
                        <div class="my-2">
                            <Button label="Add Category" icon="pi pi-plus" class="mr-2" severity="" @click="openNew" />
                            <Button label="Delete" icon="pi pi-trash" severity="danger" @click="confirmDeleteSelected" :disabled="!selectedCategories || !selectedCategories.length" />
                        </div>
                    </template>

                    <template v-slot:end>
                       
                    </template>
                </Toolbar>
 
                <DataTable
                    ref="dt"
                    :value="categories"
                    v-model:selection="selectedCategories"
                    dataKey="_id"
                    :paginator="true"
                    :rows="5"
                    :filters="filters"
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    :rowsPerPageOptions="[5, 10, 25]"
                    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                >
                    <template #header>
                        <div class="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
                            <h5 class="m-0">Manage Categories</h5>
                            <IconField iconPosition="left" class="block mt-2 md:mt-0">
                                <InputIcon class="pi pi-search" />
                                <InputText class="w-full sm:w-auto" v-model="filters['global'].value" placeholder="Search..." />
                            </IconField>
                        </div>
                    </template>

                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    
                    <Column field="name" header="Name" :sortable="true" width="100">
                        <template #body="slotProps">
                            <span class="p-column-title">Name</span>
                            {{ slotProps.data.categoryName }}
                        </template>
                    </Column>
                    <Column header="Image" headerStyle="width:14%; min-width:10rem;">
                        <template #body="slotProps">
                            <span class="p-column-title">Image</span>
                            <img :src="slotProps.data.categoryImage" :alt="slotProps.data.name" class="shadow-2" width="100" />
                        </template>
                    </Column>
                    <Column field="Description" header="Description" :sortable="true" width="100">
                        <template #body="slotProps">
                            <span class="p-column-title">Description</span>
                            {{ slotProps.data.categoryDescription }}
                        </template>
                    </Column> 
                    
                    <Column width="100">
                        <template #body="slotProps">
                            <Button icon="pi pi-pencil" class="mr-2" severity="success" rounded @click="editCategory(slotProps.data)" />
                            <Button icon="pi pi-trash" class="mt-2" severity="warning" rounded @click="confirmDeleteCategory(slotProps.data)" />
                        </template>
                    </Column>
                </DataTable>

                <Dialog v-model:visible="categoryDialog" :style="{ width: '450px' }" header="Category Details" :modal="true" class="p-fluid">
                      
                   <div v-if="category.categoryImage">
                         <img :src="category.categoryImage" alt=""  width="150" class="mt-0 mx-auto mb-5 block shadow-2" />    
                   </div>
                   <div v-if="fileurl">
                        {{category.categoryImage = null}}
                        
                        <img :src="fileurl" alt=""  width="150" class="mt-0 mx-auto mb-5 block shadow-2" />
                        <b class="text-center mb-2 block" >Selected Image</b>
                   </div>
                  
                    <div class="field">
                        <label for="name">Category Image</label>
                          <FileUpload mode="basic" name="demo[]" :auto="true" customUpload  accept="image/*" required="true"   :maxFileSize="1000000" @uploader="onUpload"  />
                         
                    </div>
                    
                    <div class="field">
                        <label for="name">Name</label>
                        <InputText id="name" v-model.trim="category.categoryName" required="true" autofocus  />
                        
                    </div>
                    <div class="field">
                        <label for="description">Description</label>
                        <Textarea id="description" v-model="category.categoryDescription" required="true" rows="3" cols="20" />
                       
                    </div>

                    <template #footer>
                        <Button label="Cancel" icon="pi pi-times" text="" @click="hideDialog" />
                        <Button label="Save" icon="pi pi-check" text="" @click="saveCategory" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCategoryDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="category"
                            >Are you sure you want to delete <b>{{ category.categoryName}}</b
                            >?</span
                        >
                    </div> 
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCategoryDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteCategory(category._id)" />
                    </template>
                </Dialog>

                <Dialog v-model:visible="deleteCategoriesDialog" :style="{ width: '450px' }" header="Confirm" :modal="true">
                    <div class="flex align-items-center justify-content-center">
                        <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
                        <span v-if="category">Are you sure you want to delete the selected products?</span>
                    </div>
                    <template #footer>
                        <Button label="No" icon="pi pi-times" text @click="deleteCategoriesDialog = false" />
                        <Button label="Yes" icon="pi pi-check" text @click="deleteselectedCategories" />
                    </template>
                </Dialog>
            </div>
        </div>
    </div>
</template>
