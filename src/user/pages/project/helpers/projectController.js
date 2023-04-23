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
            console.log("RESPONSE", response)
            var array = response?.data?.event_list
            if (array.date) {
                array = [array]
            }
            array?.reverse()
            return array ?? []
        } catch(e) {
            throw e
        }
    }

    async getResponsesList(id) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/get_project_join_requests?p_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            var response = await axios.get(URL, config)
            console.log("RESPONSE", response)
            return response?.data
        } catch(e) {
            throw e
        }
    }

    async deleteProject(id) {
        if (!confirm("Проект будет удалён")) { return false }

        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/delete_project?p_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await axios.get(URL, config)
            .then((response) => {
                console.log('RESP', response)
                
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        
        return true
    }

    async setMaker(id) {
        if (!confirm("Вы выберете эту компинию исполнителем проекта")) { return }

        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/accept_join_request?r_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async setProjectStatus(id) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/change_project_state?p_id=${id}&new_state=${true}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    
    async getNegotiations(id) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/get_negotiation_list?p_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const response = await axios.get(URL, config)
            return response.data.n_list
        } catch(e) {
            throw e
        }
    }

    async setNegotiationDecision(id, d) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/set_negotiation_decision?n_id=${id}&accept=${d}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        if (!id) { throw createError("ID IS UNDEFINED")}

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }
    
    async completeProject(id, stars, text) {
        if (!stars || !id || !text) {
            throw createError("NO parameter")
        }

        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/complete_project?p_id=${id}&stars=${stars}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        
        const reviewURL = `${serverURL}/api/v1/projects/add_project_review?p_id=${id}`
        const formData = new FormData()
        formData.append('review', text)

        await axios.post(reviewURL, formData, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async getReview(id) {
        const URL = `${serverURL}/api/v1/projects/get_project_reviews?p_id=${id}`

        const response = await axios.get(URL)
        return response?.data?.review_list ?? []
    }

    async getMaker(uuid) {
        const URL = `${serverURL}/api/v1/auth/get_user_data?user_uuid=${uuid}`
        var maker = {}
        await axios.get(URL)
            .then((response) => {
                console.log("RESP", response)
                maker = response?.data?.user ?? {}
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        await axios.get(`${serverURL}/api/v1/projects/get_contractor_rate?user_uuid=${uuid}`)
            .then((response) => {
                console.log("RESP", response)
                maker.rating = response?.data?.rate
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
            
        return maker
    }

    async getDataForResponse(uuid) {
        const URL = `${serverURL}/api/v1/auth/get_user_data?user_uuid=${uuid}`
        return (await axios.get(URL)).data?.user 
    }
}

export { ProjectController }