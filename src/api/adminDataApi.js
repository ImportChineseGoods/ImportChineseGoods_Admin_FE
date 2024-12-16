import axios from "./axios.custiomize";

export const adminData = {
    overviewData: () => {
        const URL_API = "/admin/overview";
        return axios.get(URL_API);
    },

    // orderDepositData: () => {
    //     const URL_API = "/admin/deposit";
    //     return axios.get(URL_API);
    // },

    // depositData: () => {
    //     const URL_API = "/admin/deposit-info";
    //     return axios.get(URL_API);
    // },

    // complaintOrderData: () => {
    //     const URL_API = "/admin/complaint-order";
    //     return axios.get(URL_API);
    // },
}