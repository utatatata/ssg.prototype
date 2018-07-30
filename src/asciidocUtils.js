const updateRevdate = (documentText, dateString) => {
  const revdate = `:revdate: ${dateString}\n`
  if (documentText.match(/^:revdate:/m)) {
    return documentText.replace(/^:revdate:.*[\r?\n]/m, revdate)
  } else {
    return documentText.replace(/^:revnumber:/m, `${revdate}:revnumber:`)
  }
}

const getRevnumber = documentText => {
  const result = documentText.match(
    /(?<=^:revnumber:.*v)[^\.\r\n]+(\.[^\.\r\n]+(\.[^\.\r\n]+)?)?/m
  )
  if (result === null) return null

  const [revnumber] = result
  const [major, minor, revision] = revnumber.split('.')
  return {
    str: revnumber,
    major: parseInt(major, 10) || 0,
    minor: parseInt(minor, 10) || 0,
    revision: parseInt(revision, 10) || 0,
  }
}

const compareRevnumber = (rev1, rev2) => {
  if (rev1.major === rev2.major) {
    if (rev1.minor === rev2.minor) {
      if (rev1.revision === rev2.revision) {
        return 0
      } else if (rev1.revision > rev2.revision) {
        return 1
      } else {
        return -1
      }
    } else if (rev1.minor > rev2.minor) {
      return 1
    } else {
      return -1
    }
  } else if (rev1.major > rev2.major) {
    return 1
  } else {
    return -1
  }
}

module.exports = {
  updateRevdate,
  getRevnumber,
  compareRevnumber,
}
