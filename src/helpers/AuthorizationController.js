import { createError, ERROR_CODES } from "@/helpers/ErrorMaker"
import axios from "axios"
import { serverURL } from "@/preferenses.js"

class AuthorizationController {
    validateData(page, email, role, password1, password2) {
        switch (page) {
            case "reg":
                this.validateEmail(email)
                this.validatePassword(password1)
                this.validatePassword(password2)
                this.validateRole(role)
                if (password1 != password2) {
                    throw createError(`Passwords doesn't match`, ERROR_CODES.passwordValidationFailed)
                }
                break
            case "log":
                this.validateEmail(email)
                this.validatePassword(password1)
                break
        }
    }

    validatePassword(password) {
        if (!password || password == '') {
            throw createError(`Empty password ${password}`, ERROR_CODES.passwordValidationFailed)
        }
    }

    validateEmail(email) {
        if (!email || !email.includes("@") || !email.includes(".")) {
            throw createError(`Incorrect Email ${email}`, ERROR_CODES.emailValidationFailed)
        }
    }

    validateRole(role) {
        if (!role || !(role != "customer" || role != "contractor")) {
            throw createError(`Unexisting role ${role}`)
        }
    }

    async sendRegistration(email, password1, password2, role) {
        try {
            this.validateData("reg", email, role, password1, password2)
        } catch(error) {
            throw error
        }
        
        const url = `${serverURL}/api/v1/auth/registration`
        const data = JSON.stringify({
            "email": email,
            "password": password1,
            "role": role
        })
        console.log(data)
        await axios.post(url, data)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    async sendLogin(email, password, role) {
        try {
            this.validateData("log", email, role, password)
        } catch(error) {
            throw error
        }

        const url = `${serverURL}/api/v1/auth/login`
        const data = JSON.stringify({
            "email": email,
            "password": password,
        })
        await axios.post(url, data)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }
}

export { AuthorizationController }