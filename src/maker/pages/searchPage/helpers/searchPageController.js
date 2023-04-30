import axios from "axios"
import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"


class SearchPageController {
    async getProjectsByFilters(offset=0, limit=10, filtersModel) {
        var token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        //
        var URL = `${serverURL}/api/v1/projects/get_project_list?offset=${offset}&limit=${limit}`
        if (filtersModel?.city) { URL += "&city=" + filtersModel?.city }
        if (filtersModel?.status) { URL += "&status=" + filtersModel?.status }
        var projects = []

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESP", response)
                projects = response?.data?.project_list
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        
        return projects ?? []
    }
}

export { SearchPageController }