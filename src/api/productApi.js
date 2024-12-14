import { AppResource } from "../generals/constants/AppResource";
import axios from "./axios.custiomize";

export const productApi = {
    createProduct: (data) => {
        const URL_API = "/product/new";
        const { name, shop, quantity, price, description, link, image_url, note } = data;
    
        if (!name || !shop || !quantity || !price || !description || !link) {
            return AppResource.invalidMessage
        }
        return axios.post(URL_API, data)
    },

    getProducts: () => {
        const URL_API = "/product/";
        return axios.get(URL_API)
    },

    updateProduct: async (product) => {
        const URL_API = `/product/${product.id}`;
        return axios.patch(URL_API, product)
    },

    deleteProduct: async (product) => {
        const URL_API = `/product/${product.id}`;
        return axios.delete(URL_API)
    }
}