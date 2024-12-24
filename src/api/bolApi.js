
import axios from "./axios.custiomize";

export const bolApi = { 
    updateBOL: (values) => {
        console.log('values:', values)
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
        const URL_API = `/bol/search?page=${page}&pageSize=${pageSize}`;
        return axios.get(URL_API, {
            params: {
                ...query,
                page: page,
                pageSize: pageSize,
            },
        });
    },
}