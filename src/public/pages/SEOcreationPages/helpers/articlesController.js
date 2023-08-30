import axios from "axios";
import { TokenHandler } from "@/helpers/TokenHandler.js"
import { serverURL } from "@/preferenses.js"

class ArticlesController {
  async getArticlesList() {
    const URL = `${serverURL}/api/v1/blog/get_records`
    const response = await axios.get(URL)
    console.log("SEO RESP", response)
    return response?.data?.records ?? []
  }

  async addArticle({text, title, image}) {
    const token = await TokenHandler.shared.getToken()

    const URL = `${serverURL}/api/v1/blog/add_record?title=${title}&body=${text}`
    const config = {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
    const formData = new FormData()
    if (image) {
      formData.append('file', image)
    }

    await axios.post(URL, formData, config)
      .then((response) => {
        console.log("RESP", response)
      })
      .catch((error) => {
        console.log("ERROR", error)
      })
  }

  async getArticle(id) {
    return (await axios.get(`${serverURL}/api/v1/blog/get_record?r_id=${id}`)).data?.record ?? {}
  }
}

export { ArticlesController }