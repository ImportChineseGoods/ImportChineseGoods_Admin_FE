import axios from "./axios.custiomize";

export const getData = {
    overviewData: () => {
        const URL_API = "/get/overview";
        return axios.get(URL_API);
    },

    orderDepositData: () => {
        const URL_API = "/get/deposit";
        return axios.get(URL_API);
    },

    depositData: () => {
        const URL_API = "/get/deposit-info";
        return axios.get(URL_API);
    },

    complaintOrderData: () => {
        const URL_API = "/get/complaint-order";
        return axios.get(URL_API);
    },
}