import axios from "axios"
import {serverURL} from "@/preferenses.js"

class MakerDataController {
    async getRating(uuid) {
        return axios.get(`${serverURL}/api/v1/projects/get_contractor_rate?user_uuid=${uuid}`)
    }
    async getProjectsImageNames(uuid) {

    }

    async getProjects(uuid) {
        const URL = `${serverURL}/api/v1/projects/get_user_project_list?user_uuid=${uuid}`
        var projectList = []
        await axios.get(URL)
            .then((response) => {
                projectList = response?.data?.project_list
                console.log(projectList)
            })
            .catch((error) => {
                console.log("ERROR", uuid, error)
            })
        
        return projectList?.filter(p => p.status == 'archive') ?? []
    }

    async getProjectsCount(uuid) {
        return axios.get(`${serverURL}/api/v1/projects/get_project_count?user_uuid=${uuid}` )
    }
}

export { MakerDataController }

