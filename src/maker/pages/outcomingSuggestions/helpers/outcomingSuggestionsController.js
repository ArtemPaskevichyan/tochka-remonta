import axios from "axios"
import { TokenHandler } from "@/helpers/TokenHandler"
import { serverURL } from "@/preferenses"

class OutcomingSuggestionsController {
  async getSuggestions() {
    const token = await TokenHandler.shared.getToken()
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
      const URL = `${serverURL}/api/v1/projects/get_user_sended_join_requests`
      
      const response = await axios.get(URL, config)
      console.log(response?.data?.requests)
      return response?.data?.requests ?? []
    }
}

export { OutcomingSuggestionsController }