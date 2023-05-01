

class AdressHelper {
    waiters = []
    CONFIG = {
        results: 6,
        offset: [0, 0],
    }
    isLoaded = false
    static shared = new AdressHelper()

    onYmapsAreLoaded(ymaps) {
        this.isLoaded = true
        for (let i of this.waiters) {
            this.addToYMAP(i?.id, i?.callback)
        }
    }

    addToYMAP(id, callback) {
        if (!this.isLoaded) { this.waiters.push({id, callback}); return}
        console.log("ADDR", ymaps, this.waiters)
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

    constructor() {
        console.log("ADRESS HELPER")

        const script = document.createElement('script')
        script.onload = () => {
            ymaps.ready(() => {
                this.onYmapsAreLoaded(ymaps)
            });
        };
        
        script.id = 'ymaps'
        script.src = "https://api-maps.yandex.ru/2.1/?lang=ru_RU&load=SuggestView"
        document.head.append(script);
    }

    async getMapFor(adress, size, zoom, mark) {

        const URL = `https://static-maps.yandex.ru/1.x/?ll=${geoLat},${geoLan}&z=${zoom}&pt=${geoLat},${geoLan},${mark.style}${mark.color}${mark.size}$size=${size.width},${size.height}`
    }
}

export { AdressHelper }