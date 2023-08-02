import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"
import axios from "axios"

class NotificationController {
    router = undefined

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

    async viewNotification(id) {
        const token = await TokenHandler.shared.getToken()
        const config = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
        const URL = `${serverURL}/api/v1/notifications/view_notification?notif_id=${id}`

        await axios.get(URL, config)
            .then((response) => {
                
            })
            .error((error) => {
                console.log("ERROR NV", error)
            })
    }

    fillUser() {
        this.router.push('/user/settingsPage')
    }
    statusChanged(id) {
        if (!id) { return }
        this.router.push('/user/project/' + id)
    }
    newResponse(id) {
        if (!id) { return }
        this.router.push('/user/project/' + id)
    }
    newNegotiation(id) {
        if (!id) { return }
        this.router.push('/user/project/' + id)
    }

    constructor(router) {
        this.router = router
    }


}

export { NotificationController }