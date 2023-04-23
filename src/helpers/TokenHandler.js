import {CookieHandler} from "./CookieHandler"
import Router from "../router/index.js"
import axios from "axios"
import { serverURL } from "../preferenses.js"

class TokenHandler {
    static tokenCookieKey = "token"
    static refreshTokenCookieKey = "refresh_token"

    static shared = new TokenHandler();

    set token(newValue) {
        CookieHandler.shared.setCookie(TokenHandler.tokenCookieKey, newValue, {expires: new Date(Date.now() + 86400000).toUTCString()})
    }

    get refreshToken() {
        var refreshToken = CookieHandler.shared.getCookie(TokenHandler.refreshTokenCookieKey)
        console.log("Refresh token", refreshToken)
        if (!refreshToken) {
            this.resetTokens()
            return
        }
        return refreshToken
    }
    set refreshToken(newValue) {
        CookieHandler.shared.setCookie(TokenHandler.refreshTokenCookieKey, newValue, {expires: new Date(Date.now() + 2073600000).toUTCString()})
    }

    async checkToken() {
        var token = CookieHandler.shared.getCookie(TokenHandler.tokenCookieKey)
        if (!token) {
            await TokenHandler.shared.updateToken()
            return
        }
    }

    async getToken() {
        await this.checkToken()
        return CookieHandler.shared.getCookie(TokenHandler.tokenCookieKey)
    }

    async updateToken() {
        const url = `${serverURL}/api/v1/auth/refresh_tokens?r_token=${this.refreshToken}`
        await axios.post(url)
            .then((response) => {
                const data = response?.data
                this.token = data.tokens.token
                this.refreshToken = data.tokens.refresh_token
            })
            .catch((error) => {
                this.resetTokens()
            })
    }

    resetTokens() {
        if (window.location.pathname.slice(0, 5) == "/user" || window.location.pathname.slice(0, 6) == "/maker") {
            this.clearData()
            window.location.href = "/login"
        }
    }

    parseJwt(token) {
        try {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
    
            return JSON.parse(jsonPayload);
        } catch(e) {
            return undefined
        }
    }

    clearData() {
        CookieHandler.shared.setCookie(TokenHandler.tokenCookieKey, '', {expires: new Date(Date.now() - 8000).toUTCString()})
        CookieHandler.shared.setCookie(TokenHandler.refreshTokenCookieKey, '', {expires: new Date(Date.now() + 8000).toUTCString()})
    }

    constructor() {
    }
}

export {TokenHandler}