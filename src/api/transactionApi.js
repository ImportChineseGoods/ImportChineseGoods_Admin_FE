import { AppResource } from "../generals/constants/AppResource";
import axios from "./axios.custiomize";

export const transactionApi = {
    depositOrder: (value, order_id) => {
        const URL_API = `/transaction/deposit/${order_id}`;
        if (value < 0) {
            return AppResource.invalidMessage
        }
        return axios.post(URL_API, { value, order_id })
    },

    withdraw: (data) => {
        const URL_API = '/transaction/withdraw';
        if (data.value < 0) {
            return AppResource.invalidMessage
        }
        return axios.post(URL_API, data)
    },   

    queryTransaction: (query, page, pageSize) => {
        const URL_API = '/transaction/query';
        return axios.get(URL_API, {
            params: { ...query, page, pageSize },
        });
    },

    cancelTransaction: (id) => {
        const URL_API = `/transaction/cancel/${id}`;
        return axios.post(URL_API);
    },
    
}