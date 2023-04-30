import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"
import axios from "axios"

class NotificationController {
    async getNotifications() {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/notifications/get_notifications`
        
        return (await axios.get(URL, config)).data?.notifications ?? []
    }
}

export { NotificationController }