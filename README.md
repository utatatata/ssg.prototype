SSG prototype
=============

a prototype of static site generator


## Requirement

- Node v8.11.3 or later

## Installation

```
yarn global add ssg-prototype
```

or

```
npm i -g ssg-prototype
```

## Usage

```
ssg-prototype --help
```

### init project

This tool requires package.json.

### Create a new draft

```
ssg-prototype new <title>
```

then `./drafts/title/index.asciidoc` is created

### Publish drafts

```
ssg-prototype publish <title>
```

This command moves the directory`./drafts/title/` into `./posts/YYYY/MM/DD/title/`.

### Generate Posts

```
ssg-prototype generate
```

See `./posts.json` is created.


## Configuration

Every command option can be specified in `./ssgconfig.json`.

```
{
  "posts-dir": "src/posts",   // default is "./posts"
  "drafts-dir": "src/drafts", // default is "./drafts"
  "author": "utakuma"         // default is ""
}
```

## Author

[utakuma<utatatata.kuma@gmail.com>](https://github.com/utatatata)
