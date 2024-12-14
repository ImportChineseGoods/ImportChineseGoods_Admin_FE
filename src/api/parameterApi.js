import axios from "./axios.custiomize";

export const parametersApi = {
    getByType: (type) => {
        const URL_API = `/parameter/${type}`;
        return axios.get(URL_API);
    },

}
