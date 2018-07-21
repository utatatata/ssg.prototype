module.exports = (title, author, email, revnumber, tags, summary) =>
  `= ${title !== '' ? title : 'Title'}
${author !== '' ? author : 'author'} ${email ? `<${email}>` : ''}
:revnumber:${revnumber !== '' ? ` ${revnumber}` : ''}
:tags:${tags.length !== 0 ? ` ${tags.join()}` : ''}
:summary:${summary !== '' ? ` ${summary}` : ''}
:toc:

This is an abstract.

== header1

contents
`
