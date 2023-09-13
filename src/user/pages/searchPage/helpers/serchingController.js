import { TokenHandler } from '@/helpers/TokenHandler.js'
import { serverURL } from '@/preferenses.js'
import axios from 'axios'

class SearchingController {
    async getMakersList(filters) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/search_users`
        const parameters = {
            role: "contractor",
        }

        for (let i in filters) {
            if (filters[i] == undefined) {continue}
            parameters[i] = filters[i]
        }

        const response = await axios.post(URL, parameters, config)
        const array = response?.data?.users ?? []
        return array
    }

    async getDataOfMaker(uuid) {
        const URL = `${serverURL}/api/v1/auth/get_user_data?user_uuid=${uuid}`
        return axios.get(URL)
    }
}

export { SearchingController }