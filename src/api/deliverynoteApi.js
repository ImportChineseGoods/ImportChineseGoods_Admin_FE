import axios from "./axios.custiomize";

export const deliveryApi = {
    create: (data) => {
        console.log(data);
        const URL_API = "/delivery/new";
        return axios.post(URL_API, data);
    },

    queryDelivery: (query, page, pageSize) => {
        console.log(query);
        const URL_API = "/delivery/query";
        return axios.get(URL_API, {
            params: {
                ...query,
                page,
                pageSize,
            }
        });
    },

    cancelDelivery: (id) => {
        const URL_API = `/delivery/cancel/${id}`;
        return axios.patch(URL_API);
    },

    getDeliveryById: (id) => {
        const URL_API = `/delivery/${id}`;
        return axios.get(URL_API);
    },

    exportDelivery: (id) => {
        const URL_API = `/delivery/export/${id}`;
        return axios.patch(URL_API);
    },
}