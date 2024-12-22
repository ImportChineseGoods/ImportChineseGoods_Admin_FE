import axios from "./axios.custiomize";

export const adminData = {
    overviewData: () => {
        const URL_API = "/admin/overview";
        return axios.get(URL_API);
    },

    getAllCustomer: () => {
        const URL_API = "/admin/customers";
        return axios.get(URL_API);
    }
}