import axios from "axios"
import {serverURL} from "@/preferenses.js"
import { TokenHandler } from "./TokenHandler"
import { createError, ERROR_CODES } from "@/helpers/ErrorMaker.js"


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
        var profileFullness = response?.data?.profile_fullness
        user.profileFullness = profileFullness ? profileFullness : 0

        if (user) {
            sessionStorage.setItem(UserDataController.sessionStorageKey, JSON.stringify(user))
        } else {
            throw createError("Server data error", ERROR_CODES.serverDataFail)
        }

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
        
        // await this.getNotificationsCount()
        //     .then((nCount) => {
        //         user.notificationsCount = nCount
        //         sessionStorage.setItem(UserDataController.sessionStorageKey, JSON.stringify(user))
        //     })
        //     .catch((error) => {
        //         console.log("ERROR", error)
        //     })
        
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

    clearData() {
        sessionStorage.removeItem(UserDataController.sessionStorageKey)
    }
    
    exit() {
        var submition = confirm('Вы точно хотите выйти из аккаунта?')
        if (!submition) { return }

        TokenHandler.shared.clearData()
        this.clearData()

        window.location.href = "/login"
    }

    constructor() {

    }
}

export {UserDataController}