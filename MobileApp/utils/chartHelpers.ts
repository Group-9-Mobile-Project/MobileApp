const getMonthName = (month: number) => {
    const months = [
        "Tammikuu",
        "Helmikuu",
        "Maaliskuu",
        "Huhtikuu",
        "Toukokuu",
        "Kesäkuu",
        "Heinäkuu",
        "Elokuu",
        "Syyskuu",
        "Lokakuu",
        "Marraskuu",
        "Joulukuu"
    ]

    return months[month]
}

const navigateMonth = (
    direction: number,
    currentMonth: number,
    setCurrentMonth: (arg0: number) => void,
    currentYear: number,
    setCurrentYear: (arg0: number) => void,
    setCurrentMonthName: (arg0: string) => void) => {
    let newMonth = currentMonth + direction
    let newYear = currentYear

    if (newMonth > 11) {
        newMonth = 0
        newYear++
    } else if (newMonth < 0) {
        newMonth = 11
        newYear--
    }
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    setCurrentMonthName(getMonthName(newMonth))
}

function daysInMonth(month: number, year: number) { // Use 1 for January, 2 for February, etc.
    return new Date(year, month, 0).getDate();
}

export {
    getMonthName,
    navigateMonth,
    daysInMonth
}