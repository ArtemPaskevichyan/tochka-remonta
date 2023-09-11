import axios from "axios"
import { serverURL, userProfileFullnessLimit, makerProfileFullnessLimit } from "@/preferenses.js"
import { TokenHandler } from "./TokenHandler"
import { createError, ERROR_CODES } from "@/helpers/ErrorMaker.js"
import { AdressHelper } from "./AdressHelper"

class UserDataController {
    static shared = new UserDataController()
    static sessionStorageKey = "userData"
    
    async getData() {
        if (this.dataExists) { return JSON.parse(sessionStorage.getItem(UserDataController.sessionStorageKey)) }

        var token = await TokenHandler.shared.getToken()

        const url = `${serverURL}/api/v1/auth/user_data`
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var response = await axios.get(url, config)
        console.log("RESP_USER_DATA", response)
        var user = response?.data?.user
        if (!user) throw createError("Server data error", ERROR_CODES.serverDataFail)

        console.log("UDC stage 1")
        var profileFullness = response?.data?.profile_fullness
        user.profileFullness = profileFullness ? profileFullness : 0
        user.city = await this.getUserCity()
        console.log("UDC stage 2")


        sessionStorage.setItem(UserDataController.sessionStorageKey, JSON.stringify(user))


        const uuid = user.uuid
        const pUrl = `${serverURL}/api/v1/projects/get_project_count?user_uuid=${uuid}` 
        await axios.get(pUrl)
            .then((response) => {
                user.projectsCount = response?.data?.p_count
                sessionStorage.setItem(UserDataController.sessionStorageKey, JSON.stringify(user))
            })
            .catch((error) => {
                console.log("ERROR", error)
                throw createError("Server data error", ERROR_CODES.serverDataFail)
            })
        
        console.log("GO TO PARSE NOTIFICATIONS")
        return user
    }

    get dataExists() {
        return Boolean(sessionStorage.getItem(UserDataController.sessionStorageKey))
    }

    getUserParameter(parameter) {
        var userData = sessionStorage.getItem(UserDataController.sessionStorageKey)
        if (userData) {
            try {
                userData = JSON.parse(userData)
                return userData[parameter]
            } catch(e) {
                return undefined
            }
        } else {
            return undefined
        }
    }

    async getNotificationsCount() {
        const nURL = `${serverURL}/api/v1/notifications/get_count`
        var token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        return (await axios.get(nURL, config))?.data?.count ?? 0
    }

    async updateNotificationsCount() {
        const nURL = `${serverURL}/api/v1/notifications/get_count`
        var token = await TokenHandler.shared.getToken()
        if (!token) { return }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        var count = (await axios.get(nURL, config))?.data?.count ?? 0
        var user = await this.getData()
        user.notificationsCount = count
        sessionStorage.setItem(UserDataController.sessionStorageKey, JSON.stringify(user))
    } 

    async updateData() {
        this.clearData()
        await this.getData()
    }

    async getUserCity() {
        try {
            const city = (await AdressHelper.shared.getUserLocation())?.geoObjects?.get(0)?.getLocalities()
            return city[0]
        } catch(e) {
            console.log("GEOLOCATION IS NOT FOUND")
            return "Москва"
        }
    }

    async setUserCity(city) {
        try {
            let user = await this.getData()
            user.city = city
            sessionStorage.setItem(UserDataController.sessionStorageKey, JSON.stringify(user))
        } catch(e) {
            console.log("ERROR WITH SETTING CITY", error)
        }
    }

    async getFromMeRequestsCount() {
        const token = await TokenHandler.shared.getToken()
        if (!token) { return }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/outgoing_requests`

        return (await axios.get(URL, config))?.data?.count ?? 0
    }

    async getToMeRequestsCount() {
        const token = await TokenHandler.shared.getToken()
        if (!token) { return }
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/incoming_requests`

        return (await axios.get(URL, config))?.data?.count ?? 0
    }

    async profileFilledEnough() {
        const data = await this.getData()
        return (data?.profileFullness > (data?.role == "contractor" ? makerProfileFullnessLimit : userProfileFullnessLimit))
    }

    clearData() {
        sessionStorage.removeItem(UserDataController.sessionStorageKey)
    }
    
    exit() {
        let submition = confirm('Вы точно хотите выйти из аккаунта?')
        if (!submition) { return }

        TokenHandler.shared.clearData()
        this.clearData()

        window.location.href = "/login"
    }
}

export {UserDataController}