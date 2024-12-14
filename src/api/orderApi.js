import axios from "./axios.custiomize";

export const orderApi = {
    createOrder: (data) => {
        const URL_API = "/order/new";
        const { note, warehouse_id, products } = data;
        if (!products || products.length === 0 || !warehouse_id) {
            return AppResource.invalidMessage
        }
    
        return axios.post(URL_API, data)
    },

    getAllOrder: (page, pageSize) => {
        const URL_API = `/order/customer?page=${page}&pageSize=${pageSize}`;
        return axios.get(URL_API)
    },

    getOrderById: (id) => {
        const URL_API = `/order/${id}`;
        return axios.get(URL_API)
    },

    cancelOrder: (id) => {
        const URL_API = `/order/customer-cancel/${id}`;
        return axios.patch(URL_API)
    },
}