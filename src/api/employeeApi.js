import axios from "./axios.custiomize";

export const employeeApi = {
    // createEmployee: (name, phone, email, password, role) => {
    //     const URL_API = "/employee/register";
    //     const data = {
    //         name,
    //         phone,
    //         email,
    //         password,
    //         role
    //     }
    //     return axios.post(URL_API, data)
    // },

    loginEmployee: (username, password) => {
        const URL_API = "/employee/login";
        const data = {
            username,
            password
        }
        return axios.post(URL_API, data)
    },

}