const updateRevdate = (documentText, dateString) => {
  const revdate = `:revdate: ${dateString}\n`
  if (documentText.match(/^:revdate:/m)) {
    return documentText.replace(/^:revdate:.*[\r?\n]/m, revdate)
  } else {
    return documentText.replace(/^:revnumber:/m, `${revdate}:revnumber:`)
  }
}

module.exports = {
  updateRevdate,
}
