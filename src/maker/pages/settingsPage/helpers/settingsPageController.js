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
    
    async getSocials() {
        var UUID = (await UserDataController.shared.getData()).uuid
        const URL = `${serverURL}/api/v1/auth/get_contact_list?user_uuid=${UUID}`
        var contacts = []

        await axios.get(URL)
            .then((response) => {
                contacts = response?.data?.contacts
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        return contacts ? contacts : []
    }

    async addSocial(title, value) {
        var model = {
            "contact_list": [
                {
                    "value": value
                }
            ],
            "entity": title
        }
        const token = await TokenHandler.shared.getToken()
        const URL = `${serverURL}/api/v1/auth/add_contacts`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        await axios.post(URL, model, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            }) 
    }

    async deleteSocial(id, value) {
        const token = await TokenHandler.shared.getToken()

        var model = {
            entity_id: id,
            value: value
        }

        const URL = `${serverURL}/api/v1/auth/del_contact`
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }

        await axios.post(URL, model, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async setAvatar(image) {
        var formData = new FormData()
        formData.append('new_avatar', image)

        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        const URL = `${serverURL}/api/v1/auth/update_avatar`
        await axios.post(URL, formData, config)
            .then((response) => {
                console.log("RESP", response)
                UserDataController.shared.updateData()
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
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

    async clearAvatar() {
        //
    }

    async setName(name) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        const URL = `${serverURL}/api/v1/auth/update_user_data`
        var model = {
            firstname: name,
        }

        await axios.post(URL, model, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async setDescription(description) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                'Authorization': 'Bearer ' + token
            }
        }
        const URL = `${serverURL}/api/v1/auth/update_user_data`
        var model = {
            description: description,
        }

        await axios.post(URL, model, config)
            .then((response) => {
                console.log("RESP", response)
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
    }

    async saveAdress(adress) {
        //
    }

    async getRating(uuid) {
        return (await axios.get(`${serverURL}/api/v1/projects/get_contractor_rate?user_uuid=${uuid}`))?.data?.rate ?? 0
    }
}

export { SettingsPageController }