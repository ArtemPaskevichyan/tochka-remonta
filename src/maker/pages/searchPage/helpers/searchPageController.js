import axios from "axios"
import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"


class SearchPageController {
    async getProjectsByFilters(filters) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/search_projects`
        const parameters = {
            status: "search",
        }

        for (let i in filters) {
            if (filters[i] == undefined) { continue }
            parameters[i] = filters[i]
        }

        console.log("FILTERS", parameters)

        const response = await axios.post(URL, parameters, config)
        const projects = response?.data?.projects ?? []
        console.log("PROJECTS", response)
        return projects
    }
}

export { SearchPageController }