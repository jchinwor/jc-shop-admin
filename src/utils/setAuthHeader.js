import axios from "axios";

const setAuthHeader = (token) =>{
    
    if(token){

        axios.defaults.headers = {
            Authorizaton: "Bearer" + token,
        }

    }else{
        delete axios.defaults.headers.Authorization
    }
};

export default setAuthHeader 