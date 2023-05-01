import {serverURL} from "@/preferenses.js"
import axios from "axios"
import { TokenHandler } from "@/helpers/TokenHandler.js"

class MakerPageController {
    async getData(uuid) {
        const URL = `${serverURL}/api/v1/auth/get_user_data?user_uuid=${uuid}`
        return (await axios.get(URL))?.data?.user
    }

    async getRating(uuid) {
        return (await axios.get(`${serverURL}/api/v1/projects/get_contractor_rate?user_uuid=${uuid}`))?.data?.rate ?? 0
    }

    async getAchivements(uuid) {
        return (await axios.get(`${serverURL}/api/v1/projects/get_user_achievements?user_uuid=${uuid}`))?.data?.achievements ?? []
    }

    async getProjects(uuid) {
        return (await axios.get(`${serverURL}/api/v1/projects/get_user_project_list?user_uuid=${uuid}`))?.data?.project_list?.filter(p => p.status == 'archive') ?? []
    }

    async getReviews(uuid) {
        return axios.get(`${serverURL}/api/v1/projects/get_user_reviews?user_uuid=${uuid}`)
    }

    async getContacts(uuid) {
        return (await axios.get(`${serverURL}/api/v1/auth/get_contact_list?user_uuid=${uuid}`))?.data?.contacts ?? []
    }

    async getProjectRating(p_id) {
        return axios.get(`${serverURL}/api/v1/projects/get_project_reviews?p_id=${p_id}`) ?? 0
    }

    async getUserInfo(uuid) {
        return (await axios.get(`${serverURL}/api/v1/auth/get_user_data?user_uuid=${uuid}`))?.data?.user ?? {}
    }

    async goToProject(id) {
        const token = await TokenHandler.shared.getToken()
        const model = TokenHandler.shared.parseJwt(token)
        console.log(model.role)
        switch (model.role) {
            case "customer":
                return '/user/project/' + id
            case "contractor":
                return '/maker/project/' + id
            default:
                return undefined
        }
    }
}

export { MakerPageController }