import { serverURL } from "@/preferenses"
import axios from "axios"
import { UserDataController } from "@/helpers/UserDataController"

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
}

export { SuggestProjectController }

