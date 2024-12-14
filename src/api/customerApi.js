import axios from "./axios.custiomize";

export const customerApi = {
    createCustomer: (name, phone, email, password) => {
        const URL_API = "/customer/register";
        const data = {
            name,
            phone,
            email,
            password
        }
        return axios.post(URL_API, data)
    },

    loginCustomer: (email, password) => {
        const URL_API = "/customer/login";
        const data = {
            email,
            password
        }
        return axios.post(URL_API, data)
    },

    getCustomerInfo: () => {
        const URL_API = "/customer/customer";   
        return axios.get(URL_API)
    },


    editInfo: (data) => {
        const URL_API = "/customer/edit-info";
        return axios.patch(URL_API, data)
    },

    changePassword: (data) => {
        const URL_API = "/customer/change-password";
        return axios.patch(URL_API, data)
    },
}