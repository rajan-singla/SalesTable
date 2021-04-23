//Checking the today's date
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate()  == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

exports.isToday = isToday;