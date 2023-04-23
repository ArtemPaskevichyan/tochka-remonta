import axios from "axios"
import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"

const OFFSET = 0
const LIMIT = 10

class SearchPageController {
    async getProjectsByFilters(filtersModel) {
        var token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/get_project_list?city=${filtersModel?.city ?? 'Moscow'}&offset=${OFFSET}&limit=${LIMIT}`
        var projects = []

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESP", response)
                projects = response?.data?.project_list?.filter(p => p.status == 'search')
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        
        return projects ?? []
    }
}

export { SearchPageController }