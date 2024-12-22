import axios from "./axios.custiomize";

export const parametersApi = {
    getByType: (type) => {
        const URL_API = `/parameter/${type}`;
        return axios.get(URL_API);
    },
    getAll: () => {
        const URL_API = `/parameter`;
        return axios.get(URL_API);
    },

    update: (id, data) => {
        const URL_API = `/parameter/${id}`;
        return axios.patch(URL_API, data);
    },
}
