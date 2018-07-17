module.exports = (author, email, revnumber, tags, description) =>
  `= Title
${author || 'author'} ${email ? `<${email}>` : ''}
:revnumber: ${revnumber}
:tags: ${tags.join()}
:summary: ${description}
:toc:

This is an abstract.

== header1

contents
`
