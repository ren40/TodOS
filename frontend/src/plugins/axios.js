import axios from 'axios'

export default function() {
    return axios.create({
        baseURL: process.env.VUE_APP_BASE_API,
    })
}