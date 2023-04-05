import { createError, ERROR_CODES } from "@/helpers/ErrorMaker"
import axios from "axios"
import { serverURL } from "@/preferenses.js"
import { Timer } from "./Timer"
import Router from "@/router/index.js"
import { TokenHandler } from "./TokenHandler"

class AuthorizationController {
    validateData(page, email, role, password1, password2) {
        try {
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
                case "rec":
                    this.validateEmail(email)
                    break
            }
        } catch(error) {
            throw error
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
            throw createError(`Unexisting role ${role}`, ERROR_CODES.roleValidationFailed)
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
        await axios.post(url, data)
            .then((response) => {
                var json = response?.data
                if (!json) { createError(`Error with response data`, response?.status)}
                try {
                    if (json["error"]) {
                        throw createError(`Error in json`, ERROR_CODES.jsonParsingFailed)
                    } 
                } catch(error) {
                    throw error
                }

                Timer.shared.setTimer(120)
            })
            .catch((error) => {
                console.log(error)
                throw error
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
                try {
                    var responseData = response?.data
                    if (!responseData) { createError(`Error with response data`, response?.status)}
                    TokenHandler.shared.refreshToken = responseData.tokens.refresh_token
                    TokenHandler.shared.token = responseData.tokens.token
                } catch(e) {
                    console.log(e)
                    throw createError(e, ERROR_CODES.serverDataFail)
                }
            })
            .catch((error) => {
                console.log(error)
                throw error
            })
    }

    async sendPasswordRecovery(email) {
        try {
            this.validateData('rec', email)
        } catch(error) {
            throw error
        }
        const url = `${serverURL}/api/v1/auth/send_password_recovery_code?email=${email}`
        await axios.get(url)
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.log(error)
                var msg = error.response?.data["msg"]
                throw msg ? createError() : error 
            })
    }

    async emailVerify(key) {
        const url = `${serverURL}/api/v1/auth/email_verify?key=${key}`
        await axios.get(url)
            .then((response) => {

            })
            .catch((error) => {
                const msg = error?.response?.data?.msg
                console.log(msg)
                switch (msg) {
                    case "key not exists":
                        throw createError("Несуществующая или неподтвержденная ссылка, зарегистрируйтесь снова", ERROR_CODES.emailVerificationFake)
                    case "the key has expired":
                        throw createError("Время на подтверждение почты истекло, зарегистрируйтесь снова", ERROR_CODES.emailVerificationExpired)
                    case "error with db data":
                        throw createError("Проблемы в работе сервева, повторите попытку позже", ERROR_CODES.serverDataFail)
                    default:
                        throw createError("Проблемы в работе сервева, повторите попытку позже", ERROR_CODES.serverDataFail)
                }
            })
    }

    sendEmailAgain(email) {
        if (!newEmail) {

        }
    }  // 
}

export { AuthorizationController }