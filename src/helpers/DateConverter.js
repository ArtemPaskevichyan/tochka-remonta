function convertDateToBase(dateString) {
    if (dateString === undefined) { return }
    var d = new Date(dateString)
    console.log(d)
    var formatted = ('0' + d.getDate()).slice(-2) + '.' + ('0' + (d.getMonth()+1)).slice(-2) + '.' + d.getFullYear();
    return formatted
}

export { convertDateToBase }