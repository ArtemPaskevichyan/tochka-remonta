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
            console.log("RESPONSE", response?.data)
            return response?.data
        } catch(e) {
            throw e
        }
    }

    async getFirstResponse(id) {
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
            return response?.data?.event_list[0]?.photos
        } catch(e) {
            throw e
        }
    } 

    async sendResponse(id, uuid) {
        if (!confirm("Вы хотите выдвинуться на роль исполниеля этого проекта?")) { return }

        var token = await TokenHandler.shared.getToken()

        const URL = `${serverURL}/api/v1/projects/create_join_request?p_id=${id}&to_user=${uuid}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const response = await axios.get(URL, config)
            console.log("RESP", response)
            return response
        } catch(error) {
            console.log("ERROR", error)
            throw error
        }
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
            console.log('NEG RESP', response)
            if (response.data.n_list) {
                response.data.n_list.reverse()
                return response.data.n_list
            } else {
                return []
            }
        } catch(e) {
            throw e
        }
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
        console.log("getReview RESP", response)
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

    async createEvent(data, id) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/create_event?p_id=${id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var formData = new FormData()
        formData.append('projectphoto', data?.image)
        formData.append('description', data?.text)

        await axios.post(URL, formData, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async createNegotiation(data, id, customer_uuid) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/create_negotiation`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var body = {
            project_id: id,
            title: data.title,
            description: data.text,
            payment: {
                amount: 0,
                to: customer_uuid,
            },
            type: "payment",
        }

        await axios.post(URL, body, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    covenrtTaskToNegotiation(taskList) {
        let resArray = []
        for (let task of taskList) {
            resArray.push({
                id: Number(task.id),
                name: task.name,
                end: new Date(Date.parse(task.end)),
                start: new Date(Date.parse(task.start)),
                progress: task.progress
            })
        }
        return resArray
    }

    async createDiagramNegotiation(taskList, id) {
        var token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/projects/create_negotiation`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var body = {
            project_id: id,
            title: "Изменения плана графика",
            description: 'Исполнитель предложил внести изменения в график работ. Посмотрите их в разделе "План работ" под данным графиком и примеите решение по его одобрению',
            project_tasks: this.covenrtTaskToNegotiation(taskList),
            type: "diagram",
        }

        console.log(body.project_tasks)

        await axios.post(URL, body, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async getDiagramTasks(p_id) {
        var token = await TokenHandler.shared.getToken()

        const URL = `${serverURL}/api/v1/projects/get_project_tasks?p_id=${p_id}`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        try {
            const response = await axios.get(URL, config)
            console.log("RESP", response)
            let tasks = response?.data?.tasks
            if (tasks?.lenght === 0) return []
            for (let i in tasks) {
                tasks[i].id = String(tasks[i].id)
                tasks[i].start = new Date(Date.parse(tasks[i].start)).toISOString().split("T")[0]
                tasks[i].end = new Date(Date.parse(tasks[i].end)).toISOString().split("T")[0]
            }
            return tasks

        } catch(error) {
            console.log("ERROR", error)
            throw error
        }
    }

    async getProjectRating(id) {
        const URL = `${serverURL}/api/v1/projects/get_project_reviews?p_id=${id}`

        return (await axios.get(URL))?.data?.stars
    }

    async getUserInfo(uuid) {
        const URL = `${serverURL}/api/v1/auth/get_user_data?user_uuid=${uuid}`

        return (await axios.get(URL))?.data?.user
    }
}

export { ProjectController }