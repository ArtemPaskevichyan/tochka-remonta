import {serverURL} from '@/preferenses.js'
import { TokenHandler } from "@/helpers/TokenHandler.js"
import axios from "axios"
import { createError, ERROR_CODES } from "@/helpers/ErrorMaker.js"

class ProjectController {
    async getProjectId(id) {
        var token = await TokenHandler.shared.getToken()

        const URL = `${serverURL}/api/v1/projects/get_project?p_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            var response = await axios.get(URL, config)
            console.log("RESPONSE", response?.data)
            return response?.data?.project
        } catch(e) {
            throw e
        }
    }
    
    async getEventList(id) {
        var token = await TokenHandler.shared.getToken()

        const URL = `${serverURL}/api/v1/projects/get_event_list?p_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        
        try {
            var response = await axios.get(URL, config)
            console.log("RESPONSE", response?.data)
            return response?.data?.event_list
        } catch(e) {
            throw e
        }
    }
}

export { ProjectController }