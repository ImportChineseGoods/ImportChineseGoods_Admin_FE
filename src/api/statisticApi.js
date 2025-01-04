
import axios from "./axios.custiomize";

export const statisticsApi = { 
    revenue: (query, page, pageSize) => {
        const URL_API = '/statistics/revenue';
        return axios.get(URL_API, {
            params: { ...query, page, pageSize },
        });
    },
    profit: (query, page, pageSize) => {
        const URL_API = '/statistics/profit';
        return axios.get(URL_API, {
            params: { ...query, page, pageSize },
        });
    },
    debt: (query, page, pageSize) => {
        const URL_API = '/statistics/debt';
        return axios.get(URL_API, {
            params: { ...query, page, pageSize },
        });
    },

    order: (query, page, pageSize) => {
        const URL_API = '/statistics/order';
        return axios.get(URL_API, {
            params: { ...query, page, pageSize },
        });
    },
}
