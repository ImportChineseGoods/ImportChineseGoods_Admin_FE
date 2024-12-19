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
        const URL_API = `/order/?page=${page}&pageSize=${pageSize}`;
        return axios.get(URL_API)
    },

    getOrderById: (id) => {
        const URL_API = `/order/${id}`;
        return axios.get(URL_API)
    },

    updateOrder: (id, data) => {
        const URL_API = `/order/${id}`;
        return axios.patch(URL_API, data)
    },

    assignContractCode: (id, contractCode) => {
        const URL_API = `/order/assign-contract-code/${id}`;

        return axios.patch(URL_API, { contract_code: contractCode })
    },

    assignBOL: (id, bol_code) => {
        const URL_API = `/order/assign-bol/${id}`;
        return axios.patch(URL_API, bolCode)
    },

    cancelOrder: (id) => {
        const URL_API = `/order/cancel/${id}`;
        return axios.patch(URL_API)
    },

    queryOrder: (query, page, pageSize) => { 
        const URL_API = `/order/query?page=${page}&pageSize=${pageSize}`;
    
        // Gọi API với params
        return axios.get(URL_API, {
            params: {
                ...query,
                page: page,
                pageSize: pageSize,
            },
        });
    },

    approveOrder: (id) => {
        const URL_API = `/order/approve/${id}`;
        return axios.patch(URL_API)
    },
    
}