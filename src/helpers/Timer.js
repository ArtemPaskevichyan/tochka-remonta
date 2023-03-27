class Timer {
    static shared = new Timer()
    timeOut = undefined;

    get timeLeft() {
        if (!this.timeOut) {
            return {
                minutes: 0,
                seconds: 0,
            }
        }

        var diff = this.timeOut - Date.now()
        if (diff < 0) {
            return {
                minutes: 0,
                seconds: 0
            }
        }
        var minutes = (diff - (diff % 60000)) / 60000
        var seconds = ((diff % 60000) - (diff % 60000) % 1000) / 1000
        return {
            minutes: minutes,
            seconds: seconds,
        }
        
    }

    setTimer(time) {
        var date = new Date()
        console.log(date)
        date.setSeconds(date.getSeconds() + time)
        this.timeOut = date
    }
}

export { Timer }