
import axios from "./axios.custiomize";

export const transactionApi = { 
    queryTransaction: (query, page, pageSize) => {
        const URL_API = '/transaction/query';
        return axios.get(URL_API, {
            params: { ...query, page, pageSize },
        });
    },

    approveTransaction: (id) => {
        const URL_API = `/transaction/approve/${id}`;
        return axios.post(URL_API);
    },
    
    createTransaction: (values) => {
        const URL_API = '/transaction/new';
        return axios.post(URL_API, values);
    },
}