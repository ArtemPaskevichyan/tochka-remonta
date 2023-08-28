import { TokenHandler } from "@/helpers/TokenHandler";
import axios from "axios";
import { serverURL, chatURL } from "@/preferenses";
import {createError, ERROR_CODES} from '@/helpers/ErrorMaker.js'
import { UserDataController } from "@/helpers/UserDataController";


class SettingsPageController {
    async callAPhone(number) {
        const token = await TokenHandler.shared.getToken()

        if (!this.validatePhone(number)) {
            throw createError('Wrong phone number', ERROR_CODES.PSVNumberFailed)
        }

        const URL = `${serverURL}/api/v1/auth/new_phone`
        const formData = new FormData()
        formData.append('phone', number)
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        await axios.post(URL, formData, config)
            .then((response) => {
                console.log("SUCCESS", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
                throw error
            })
    }

    async submitAPhone(code) {
        const token = await TokenHandler.shared.getToken()

        const URL = `${serverURL}/api/v1/auth/verify_phone?code=${code}`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        await axios.get(URL, config)
            .then((response) => {
                console.log("RESPONSE ON CODE", response)
                UserDataController.shared.updateData()
            })
            .catch((error) => {
                throw error
            })
    }

    validatePhone(phone) {
        let regex = /^(\+7|7|8)[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return regex.test(phone);
    }

    async setAvatar(image) {
        const mFormData = new FormData()
        mFormData.append('new_avatar', image)

        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        const aURL = `${serverURL}/api/v1/auth/get_chat_token`
        const cAuthData = (await axios.get(aURL, config))?.data

        const mURL = `${serverURL}/api/v1/auth/update_avatar`
        const mAvatarRequest = axios.post(mURL, mFormData, config)
            .then((response) => {
                console.log("RESP", response)
                UserDataController.shared.updateData()
            })
        
        const cURL = `${chatURL}/api/v1/users.setAvatar`
        const cFormData = new FormData()
        cFormData.append("image", image)
        const cHeaders = {
            "X-Auth-Token": cAuthData.authToken,
            "X-User-Id": cAuthData.userId,
        }
        const cAvatarRequest = axios.post(cURL, cFormData, { headers: cHeaders })

        await Promise.all([mAvatarRequest, cAvatarRequest])
            .then(response => console.log("RESP", response))
            .catch(error => { throw error })
    }

    async getAvatarURL() {
        var avatar = (await UserDataController.shared.getData()).avatar
        try {
            if (!avatar || avatar.length == 0) { return }
        } catch(e) {
            throw e
        }
        return `${serverURL}/api/v1/auth/get_avatar?filename=${avatar}`
    }

    async setName(name) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        const aURL = `${serverURL}/api/v1/auth/get_chat_token`
        const cAuthData = (await axios.get(aURL, config))?.data

        const mURL = `${serverURL}/api/v1/auth/update_user_data`
        const model = {
            firstname: name,
        }
        const mainName = axios.post(mURL, model, config)

        const cURL = `${chatURL}/api/v1/users.updateOwnBasicInfo`
        const cData = {
            data: { name },
        }
        const cHeaders = {
            "Content-type": "application/json",
            "X-Auth-Token": cAuthData.authToken,
            "X-User-Id": cAuthData.userId,
        }
        const cName = axios.post(cURL, cData, { headers: cHeaders })

        await Promise.all([mainName, cName])
            .then(response => console.log("RESPONSE", response))
            .catch(error => console.log("ERROR", error))
    }

}

export { SettingsPageController }