import axios from "axios";
import { serverURL } from "@/preferenses.js";

class LoginManager {
    async registration(email, password, role) {
        const url = `${serverURL}/api/v1/auth/registration`
        const data = JSON.stringify({
            "email": email,
            "password": password,
            "role": role,
        })

        await axios.post(url, data)
            .then((response) => {
                
                console.log(response)
            })
            .catch((error) => {
                alert(error)
            })
            .finally(() => {
            })
    }
}

export { LoginManager }