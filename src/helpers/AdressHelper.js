import { toRaw } from 'vue'

class AdressHelper {
    suggestWaiters = []
    locationWaiters = []
    CONFIG = {
        results: 6,
        offset: [0, 0],
    }
    isLoaded = false
    static shared = new AdressHelper()

    onYmapsAreLoaded(ymaps) {
        this.isLoaded = true
        for (let i of this.suggestWaiters) {
            this.addToYMAP(i?.id, i?.callback)
        }
    }

    addToYMAP(id, callback) {
        if (!this.isLoaded) { this.suggestWaiters.push({id, callback}); return}
        try {
            var suggestView = new ymaps.SuggestView(id, this.CONFIG);
            suggestView.events.add("select", (event) => {
                if (callback) {
                    callback(event?.originalEvent?.item?.value)
                }
            })
        } catch(e) {
            console.log("ADDTOYAMAPERROR", e)
        }
    }

    async getUserLocation() {
        return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
                if (!ymaps) { return }
                clearInterval(interval)
                ymaps.geolocation.get({ provider: 'yandex' })
                    .then((response) => {
                        console.log("RESOLVED")
                        resolve(response)
                    })
                    .catch((error) => {
                        console.log(error)
                        reject(error)
                    })
            }, 500)
        })
    }

    async getMapByAdress(id, address, map) {
        const defaultZoom = 15
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                if (!ymaps) { return }
                clearInterval(interval)
                try {
                    const object = (await ymaps.geocode(address))?.geoObjects?.get(0)
                    const objectCoords = object.geometry.getCoordinates()
                    if (!map) {
                        map = new ymaps.Map(id, {
                            center: objectCoords,
                            zoom: defaultZoom,
                        })
                        map.geoObjects.add(object)
                    } else {
                        map = toRaw(map)
                        map.geoObjects.removeAll()
                        map.geoObjects.add(object)
                        await map.setCenter(objectCoords, defaultZoom)
                    }
                    resolve(map)
                } catch(e) {
                    reject(true)
                }
            }, 500)
        })
    }

    constructor() {
        const script = document.createElement('script')
        script.onload = () => {
            ymaps.ready(() => {
                this.onYmapsAreLoaded(ymaps)
            });
        };
        
        script.id = 'ymaps'
        script.src = "https://api-maps.yandex.ru/2.1/?apikey=030a546e-afae-4059-976b-10de250d380d&lang=ru_RU&load=SuggestView,geolocation,geocode,Map"
        document.head.append(script);
    }

    async getMapFor(adress, size, zoom, mark) {

        const URL = `https://static-maps.yandex.ru/1.x/?ll=${geoLat},${geoLan}&z=${zoom}&pt=${geoLat},${geoLan},${mark.style}${mark.color}${mark.size}$size=${size.width},${size.height}`
    }
}

export { AdressHelper }