import axios from "axios"
import { TokenHandler } from "@/helpers/TokenHandler"
import {UserDataController} from "@/helpers/UserDataController.js"
import {createError, ERROR_CODES} from "@/helpers/ErrorMaker.js"
import { serverURL } from "@/preferenses.js"

class ProjectListController {
    async createProject(data) {
        try {
            this.validateData(data)
        } catch(error) {
            throw error
        }

        var token = await TokenHandler.shared.getToken()
        var model = {
            "address": data.address,
            "city": data.city,
            "description": data.description,
            "design_project_exists": data.design_project_exists,
            "house_type": data.house_type.label,
            "is_new_building": data.is_new_building,
            "planned_budget_down": Number(data.planned_budget_down),
            "planned_budget_up": Number(data.planned_budget_up),
            "repair_type": data.repair_type,
            "square_meters": Number(data.square_meters),
            "start_date": new Date(Date.now() + data.start_date.offset * 86400000),
            "title": data.title,
        }
        const projectUrl = `${serverURL}/api/v1/projects/add_new`
        const projectConfig = {
            headers: {
                "Authorization": "Bearer " + token,
            }
        }

        try {
            model = JSON.stringify(model)
        } catch(e) {
            throw createError('JSON create error', ERROR_CODES.jsonParsingFailed)
        }

        var projectId;
        await axios.post(projectUrl, model, projectConfig)
            .then((response) => {
                projectId = response?.data?.project_id
                if (projectId == undefined) { throw createError("No project ID found", ERROR_CODES.serverDataFail) }
            })
            .catch((error) => {
                console.log(error)
                throw error
            })
        
        const eventUrl = `${serverURL}/api/v1/projects/create_event?p_id=${projectId}`
        const formData = new FormData();
        data.imageList.forEach(img => {
            formData.append('projectphoto', img.file)
        });
        if (data.hostDocs) {
            formData.append('projectdoc', data.hostDocs)
        }
        if (data.designProject) {
            formData.append('projectdoc', data.designProject)
        }
        formData.append('description', 'Проект создан')
        const eventConfig = {
            headers: {
                "Authorization": "Bearer " + token,
            }
        }

        console.log("FORMDATA", formData)
        await axios.post(eventUrl, formData, eventConfig)
            .then((response) => {
                console.log("OK", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        
        const avatarUrl = `${serverURL}/api/v1/projects/set_project_picture?p_id=${projectId}`
        const avatarFormData = new FormData();
        try {
            avatarFormData.append('picture', data.imageList[0].file)
        } catch(e) {
            throw createError()
        }
        const avatarConfig = {
            headers: {
                "Authorization": "Bearer " + token,
            }
        }
        await axios.post(avatarUrl, avatarFormData, avatarConfig)
            .then((response) => {
                console.log("OK", response)
                UserDataController.shared.updateData()
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async getProjectList(offset=0, limit=25) {
        var data = await UserDataController.shared.getData()
        const uuid = data.uuid
        const url = `${serverURL}/api/v1/projects/get_user_project_list?user_uuid=${uuid}&offset=${offset}&limit=${limit}`
        
        try {
            var response = await axios.get(url)
            console.log("RESPONSE", response)
            const data = response?.data

            if (!data.hasOwnProperty("project_list")) {
                throw createError("Failed data", ERROR_CODES.serverDataFail)
            }
            var array = data.project_list
            return array == null ? [] : array
        } catch(e) {
            console.log(e)
            return
        }
    }

    validateData(data) {
        console.log("DATA", data)
        if (!data.address) { throw createError("Address Error", ERROR_CODES.CPVAddressFailed)}
        if (!data.city) { throw createError("City Error", ERROR_CODES.CPVCityFailed) }
        if (!data.description) { throw createError("Description Error", ERROR_CODES.CPVDescriptionFailed) }
        if (data.design_project_exists == undefined) { throw createError("Design Project Error", ERROR_CODES.CPVDesignProjectFailed) }
        if (!data.house_type) { throw createError("House Type Error", ERROR_CODES.CPVHouseTypeFailed) }
        if (data.is_new_building == undefined) { throw createError("New Building Error", ERROR_CODES.CPVNewBuildingFailed) }
        if (!data.planned_budget_down || isNaN(Number(data.planned_budget_down))) { throw createError("Budget Down Error", ERROR_CODES.CPVPlanedBudgetDownFailed) }
        if (!data.planned_budget_up || isNaN(Number(data.planned_budget_up))) { throw createError("Budget Up Error", ERROR_CODES.CPVPlanedBudgetUpFailed) }
        if (!data.repair_type) { throw createError("Repair Type Error", ERROR_CODES.CPVRepairTypeFailed) }
        if (!data.square_meters || isNaN(Number(data.square_meters))) { throw createError("Square Error", ERROR_CODES.CPVSquareFailed) }
        if (!data.start_date) { throw createError("Strat Date Error", ERROR_CODES.CPVStartDateFailed) }
        if (!data.title) { throw createError("Title Error", ERROR_CODES.CPVTitleFailed) }
        if (Number(data.planned_budget_down) > Number(data.planned_budget_up)) { throw ERROR_CODES.CPVPlanedBudgetDownFailed }
        if (!data.imageList || data.imageList?.length == 0) { throw createError("No images pinned", ERROR_CODES.CPVImageListFailed)}
    }
}

export {ProjectListController}