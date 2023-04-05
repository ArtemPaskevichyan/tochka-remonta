import { TokenHandler } from "@/helpers/TokenHandler";
import axios from "axios";
import { serverURL } from "@/preferenses";
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
        let regex = /^(\+7|7)[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
        return regex.test(phone);
    }

    setAvatar(imageScr) {
        //
    }

    clearAvatar() {
        //
    }

}

export { SettingsPageController }