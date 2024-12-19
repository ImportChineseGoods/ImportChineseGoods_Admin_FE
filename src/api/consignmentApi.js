import axios from "./axios.custiomize";

export const consignmentApi = {
    queryConsignment: (query, page, pageSize) => {
        const URL_API = `/consignment/query`;
        return axios.get(URL_API, { params: {
            ...query,
            page: page,
            pageSize: pageSize
        } })
    },

    getConsignmentById: (consignment_id) => {
        const URL_API = `/consignment/${consignment_id}`;
        return axios.get(URL_API)
    },

    cancelConsignment: (consignment) => {
        const URL_API = `/consignment/cancel/${consignment.id}`;
        return axios.patch(URL_API)
    },

    updateConsignment: (consignment_id, data) => {
        console.log(data);
        console.log(consignment_id);
        const URL_API = `/consignment/${consignment_id}`;
        return axios.patch(URL_API, data)
    },
}