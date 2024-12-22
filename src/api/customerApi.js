import axios from "./axios.custiomize";

export const customerApi = {
    getCustomerById: (id) => {
        const URL_API = `/customer/${id}`;   
        return axios.get(URL_API)
    },

    search: (query, page, pageSize) => { 
        const URL_API = `/customer/search?page=${page}&pageSize=${pageSize}`;
    
        // Gọi API với params
        return axios.get(URL_API, {
            params: {
                ...query,
                page: page,
                pageSize: pageSize,
            },
        });
    },

    updateCustomer: (id, data) => {
        const URL_API = `/customer/${id}`;
        return axios.patch(URL_API, data);
    },
}