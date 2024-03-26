import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import setAuthHeader from "@/utils/setAuthHeader";
import router from "@/router";

export const adminMainStore = defineStore('adminStore', () => {

    const token = ref('')
    const adminData = ref({})
    const categories = ref([])
    const users = ref([])
    const products = ref([])
    const orders = ref([])
    const Customer_order = ref([])
    const Customer_shippingAddress = ref([])
    const serverApi = ref(null)
    serverApi.value = import.meta.env.VITE_SERVICE_URL
  
const isLoggedIn = () =>{
    
        if(token.value !='' && adminData.value.isAdmin === true){
            return true
        }else{
            return false
        }
       

}

const LogOut = ()=>{

    localStorage.removeItem('jwtToken',token.value)
    localStorage.removeItem('Auth',token.value)
    

   //   localStorage.clear();

    token.value = ''
    adminData.value = ''
    
 

   router.push({

       path: "/auth/login",
      
   })
   
   return

}

//User Login
const authAdmin = async(email,password) =>{
      

   
       try{

            let result = await axios.post(`${serverApi.value}/api/users/login`,{
                email:email,
                password:password
            })
            
            if(result.data.success){

                token.value = result.data.token;
                adminData.value = result.data.user;            

                localStorage.setItem('jwtToken',token.value);
                setAuthHeader(token.value)

            }

            return result;



       }catch(err){


       }
        

   

}

//Get Products
const getProducts = async() =>{

    try{

        let result = await axios.get(`${serverApi.value}/api/products/latest`)
        const productsData = result.data

        products.value =  productsData


    }catch(err){

    }

}
//Delete Product
const deleteProductStore = async(productid) =>{

    
    let productdata = {
        productid:productid
    }
    try{


        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

            let result = await axios.post(`${serverApi.value}/api/products/removeproduct`,productdata,config)

           
            
            return result


    }catch(err){


    }



}
//Update Product
const updateProduct = async(productid,product) =>{
    

    try{

        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

            let result = await axios.put(`${serverApi.value}/api/products/`+productid,product,config)

            products.value = result.data.product
            
            return result
            
    




    }catch(err){

    }
}


//Delete SelectedProduct
const deleteSelectedProductStore = async(selectedproduct) =>{

    
    let productdata = {
        selectedproduct:selectedproduct
    }
    try{


        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

            let result = await axios.post(`${serverApi.value}/api/products/deleteselectedproduct`,productdata,config)

           
            
            return result


    }catch(err){

            console.log(err.message)
    }



}

  
//Get Categories
const getCategory = async() =>{

    try{

        let result = await axios.get(`${serverApi.value}/api/categories/`)
        const categoriesData = result.data.categories
        
        if(result.data.success){

            categories.value = categoriesData
        }

       


    }catch(err){

    }

}
//Update Category
const updateCategory = async(categoryid,category) =>{
    

    try{

        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

            let result = await axios.put(`${serverApi.value}/api/categories/`+categoryid,category,config)

            categories.value = result.data.category
            
            return result
            
    




    }catch(err){

    }
}
//Delete Category
const deleteCategoryStore = async(categoryid) =>{

    
    let categorydata = {
        categoryid:categoryid
    }
    try{


        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

            let result = await axios.post(`${serverApi.value}/api/categories/deletecategory`,categorydata,config)

           
            
            return result


    }catch(err){


    }



}
//Delete SelectedCategory
const deleteSelectedCategoryStore = async(selectedcategory) =>{

    
    let categorydata = {
        selectedcategory:selectedcategory
    }
    try{


        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

            let result = await axios.post(`${serverApi.value}/api/categories/deleteselectedcategory`,categorydata,config)

           
            
            return result


    }catch(err){

            console.log(err.message)
    }



}


//Customer Orders
const getOrders = async() =>{



    try{

        const config = {
            headers: {
                Authorization: `${token.value}`,
                }
            
            }

        let result = await axios.get(`${serverApi.value}/api/orders/allorders`,config)
        const ordersData = result.data.orders
        
          if(result.data.success){
            orders.value = ordersData
        
          }
       


    }catch(err){

    }

}

//Get Specific customer order
const getCustomerOrder = async(token,orderid) =>{

    const config = {
      headers: {
        Authorization: `${token}`,
        }
     
    }

      try{

          const result = await axios.get(`${serverApi.value}/api/orders/${orderid}`,config);
    
          // const orderData = result.data

          if(result.data.success){

            Customer_order.value = result.data.order
            Customer_shippingAddress.value = result.data.order.shippingAddress

          }
 
          // return result

      }catch(err){


      }

        

  }

//Order Delivered
const DeliveredOrder = async(token,orderid) =>{

    const config = {
        headers: {
            Authorization: `${token}`,
            }
        
        }

      try{

       

        if(orderid){

          const result = await axios.put(`${serverApi.value}/api/orders/${orderid}/delivered`,{},config);
    
          const orderData = result.data 
    
          Customer_order.value = result.data.updateOrder
          Customer_shippingAddress.value = result.data.updateOrder.shippingAddress
    
          return orderData;
    
        }

     }catch(err){
        console.log(err)
     }
}

//Get All Users
const getUsers = async() =>{

    const config = {
        headers: {
          Authorization: `${token.value}`,
          }
       
      }
  
        try{
  
            const result = await axios.get(`${serverApi.value}/api/users/`,config);
      
            // const orderData = result.data
  
            users.value = result.data
   
            // return result
  
        }catch(err){
  
  
        }
  

}
  
    return{

        token,
        getUsers,
        users,
        adminData,
        authAdmin,
        isLoggedIn,
        getCategory,
        getOrders,
        orders,
        categories,
        LogOut,
        getProducts,
        products,
        updateCategory,
        deleteCategoryStore,
        deleteSelectedCategoryStore,
        deleteProductStore,
        updateProduct,
        deleteSelectedProductStore,
        getCustomerOrder,
        DeliveredOrder,
        Customer_order,
        Customer_shippingAddress,
        serverApi
       


    }


})
