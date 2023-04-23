async function getUserPosition(callback) {
    try {
        if (!"geolocation" in navigator) { return undefined } 
        navigator.geolocation.getCurrentPosition(callback)
    } catch(error) {
        throw error
    }
}

export { getUserPosition }