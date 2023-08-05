import { CookieHandler } from "@/helpers/CookieHandler"

class CityController {
  static cookieStorageKey = "cityData"

  needToShowCityQuestion(currentCity) {
    let storageCity = CookieHandler.shared.getCookie(CityController.cookieStorageKey)
    if (!storageCity) return true
    return storageCity != currentCity
  }

  saveCityToStorage(city) {
    CookieHandler.shared.setCookie(CityController.cookieStorageKey, city, {expires: new Date(Date.now() + 2073600000).toUTCString()})
  }
}

export { CityController }