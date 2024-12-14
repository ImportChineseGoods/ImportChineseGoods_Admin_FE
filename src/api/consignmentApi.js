import axios from "./axios.custiomize";

export const consignmentApi = {
    createConsignment: (data) => {
        const URL_API = "/consignment/new";
        const { note, warehouse_id, bol_code } = data;
        if (!bol_code || !warehouse_id) {
            return AppResource.invalidMessage
        }

        return axios.post(URL_API, data)
    },

    deleteConsignment: (consignment) => {
        const URL_API = `/consignment/${consignment.id}`;
        return axios.delete(URL_API)
    },
    
    getAllConsignment: (page, pageSize) => {
        const URL_API = `/consignment/customer?page=${page}&pageSize=${pageSize}`;
        return axios.get(URL_API)
    },

    getConsignmentById: (consignment_id) => {
        const URL_API = `/consignment/${consignment_id}`;
        return axios.get(URL_API)
    },
}