import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"
import axios from "axios";


class SuggestionsController {
    async getSuggestions() {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/get_user_join_requests`
        
        return (await axios.get(URL, config))?.data?.requests ?? []
    }

    async acceptSuggestion(r_id) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/accept_join_request?r_id=${r_id}`

        return axios.get(URL, config)
    }

    async getProjectData(id) {
        const URL = `${serverURL}/api/v1/projects/get_project?p_id=${id}`
        return axios.get(URL)
    }
}

export { SuggestionsController }