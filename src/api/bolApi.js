
import axios from "./axios.custiomize";

export const bolApi = { 
    updateBOL: (values) => {
        const URL_API = `/bol/${values.bol_code}`;
        return axios.patch(URL_API, {
            status: values.status,
            weight: values.weight,
        });
    },

    undoBOL: (bol_code) => {
        const URL_API = `/bol/${bol_code}`;
        return axios.delete(URL_API);
    },

    queryBOL: (query, page, pageSize) => {
        const URL_API = `/bol/search`;
        return axios.get(URL_API, { params: {
            ...query,
            page: page,
            pageSize: pageSize
        } })
    },

    assignCustomer: (data) => {
        const URL_API = `/bol/assign/${data.customer_id}`;
        return axios.post(URL_API, data);
    }
}