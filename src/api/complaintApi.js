import axios from "./axios.custiomize";

export const complaintApi = {
    create: (data) => {
        const URL_API = '/complaint/new';
        return axios.post(URL_API, data)
    },

    getAllComplaints: (page, pageSize) => {
        const URL_API = `/complaint/customer?page=${page}&pageSize=${pageSize}`;
        return axios.get(URL_API)
    },

    cancelComplaint: (data) => {
        const URL_API = `/complaint/cancel/${data.id}`;
        return axios.patch(URL_API)
    }
}