import { serverURL } from "@/preferenses"
import axios from "axios"
import { UserDataController } from "@/helpers/UserDataController"
import { TokenHandler } from "@/helpers/TokenHandler"

class SuggestProjectController {
    async getProjects() {
        const uuid = (await UserDataController.shared.getData())?.uuid
        if (!uuid) {
            throw new Error("NO UUID")
        }
        const URL = `${serverURL}/api/v1/projects/get_user_project_list?user_uuid=${uuid}`
        var data = []

        await axios.get(URL)
            .then((response) => {
                console.log("RESP", response)
                data = response?.data?.project_list?.filter(p => p.status == 'search')
            })
            .catch((error) => {
                console.log("ERROR", error)
            })
        
        return data ?? []
    }

    async sendSuggestion(p_id, maker_uuid) {
        if (!p_id || !maker_uuid) { return }

        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/projects/create_join_request?p_id=${p_id}&to_user=${maker_uuid}`

        return await axios.get(URL, config)
    }
}

export { SuggestProjectController }

