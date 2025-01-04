import axios from "./axios.custiomize";

export const employeeApi = {
    createEmployee: (data) => {
        const URL_API = "/employee/register";
        const checkData = {
            name: data.name,
            username: data.username,
            email: data.email,
            phone: data.phone,
            password: data.password,
            role: data.role
        }
        return axios.post(URL_API, checkData)
    },

    loginEmployee: (username, password) => {
        const URL_API = "/employee/login";
        const data = {
            username,
            password
        }
        return axios.post(URL_API, data)
    },

    searchEmployee: (query, page, pageSize) => {
        const URL_API = `/employee/search?page=${page}&pageSize=${pageSize}`;
    
        // Gọi API với params
        return axios.get(URL_API, {
            params: {
                ...query,
                page: page,
                pageSize: pageSize,
            },
        });
    },

    lockEmployee: (id) => {
        const URL_API = `/employee/lock/${id}`;
        return axios.patch(URL_API);
    },

    getEmployee: (id) => {
        const URL_API = `/employee/${id}`;
        return axios.get(URL_API);
    },

    updateEmployee: (id, data) => {
        const URL_API = `/employee/${id}`;
        return axios.patch(URL_API, data);
    },

    editInfo: (data) => {
        const URL_API = `/employee/edit-info`;
        return axios.patch(URL_API, data);
    },

    changePassword: (data) => {
        const URL_API = `/employee/change-password`;
        return axios.patch(URL_API, data);
    }
}