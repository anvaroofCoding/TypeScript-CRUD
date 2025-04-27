import axios from 'axios'

const clientApi = axios.create({
	baseURL: 'https://679e43f7946b0e23c062fcfb.mockapi.io',
})

clientApi.interceptors.request.use(
	config => {
		return config
	},
	error => {
		return Promise.reject(error)
	}
)

export default clientApi
