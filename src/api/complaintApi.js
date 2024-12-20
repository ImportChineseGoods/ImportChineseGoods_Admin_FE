import axios from "./axios.custiomize";

export const complaintApi = {
    getAllComplaints: (query, page, pageSize) => {
        const URL_API = `/complaint/query?page=${page}&pageSize=${pageSize}`;
        return axios.get(URL_API, {
            params: {
                ...query,
                page,
                pageSize
            }
        })
    },

    confirmProcess: (id) => {
        const URL_API = `/complaint/confirm/${id}`;
        return axios.patch(URL_API)
    },

    getComplaintById: (id) => {
        const URL_API = `/complaint/${id}`;
        return axios.get(URL_API)
    },

    updateComplaint: (id, data) => {
        const URL_API = `/complaint/${id}`;
        return axios.patch(URL_API, data)
    },
}