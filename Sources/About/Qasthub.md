<a name="head"></a>

# Qasthub

**The powerhub of Qast operations inside Qasthra.**

Developed and founded by Gabriel Yoan L. Cortez, November 26, 2026.

---

## Contents

1. [Overview](#1-overview)
2. [Glossary](#2-glossary)
3. [Quick start](#3-quick-start)
4. [World structure](#4-world-structure)
5. [source.qst reference](#5-sourceqst-reference)
6. [Pathways and keys](#6-pathways-and-keys)
7. [Address list](#7-address-list)
8. [Portbase](#8-portbase)
9. [Qast tags](#9-qast-tags)
10. [Comments](#10-comments)
11. [Security and safeguards](#11-security-and-safeguards)
12. [Validation rules](#12-validation-rules)
13. [Troubleshooting](#13-troubleshooting)
14. [Full example](#14-full-example)

---

## 1. Overview

Qasthub is where worlds are created, configured, and managed in Qasthra. A **world** is a folder of ordinary web files (HTML, CSS, JS) plus one control file, `source.qst`, that defines who owns the world, who can see it, and how it connects to other worlds.

Worlds never talk to the outside web. Inside a world, addresses are **coordinates**, and every coordinate call is resolved by Qasthra itself.

**Access:** you must be signed in.

- Web: [Qasthub](https://qasthra.github.io/Qasthra/Qasthub)
- App: Settings → Contribute → Qasthub

---

## 2. Glossary

| Term | Meaning |
|---|---|
| **World** | A project or operation: a folder with `source.qst` and web files. |
| **Portbase** | A group that holds worlds. Its value is copied into each world. |
| **Coordinate** | A position written as `X=…, Y=…, Z=…`. Used instead of web addresses. |
| **Origin** | The X and Y position of a world. |
| **Depth** | The maximum Z depth a world supports. |
| **Pathway** | A one-way link from a world to a coordinate in another world. |
| **Key** | A secret that must match for a pathway to be used. |
| **Address** | A unique id given to a file or folder in a world. |
| **Qast tag** | A custom HTML tag, like `<qast>`, that reads a coordinate. |
| **Credit** | Qasthra's approval code for creating a world. Auto-generated. |
| **Identity** | The world's code stored in `datahub.db`. Auto-generated. |

---

## 3. Quick start

> Skip step 1 if you already have a portbase, but copy its value.
> Skip steps 2 and 3 if you can upload a folder that already contains a valid `source.qst`.

1. **Create Portbase.** Groups worlds. Copy its value.
2. **Create World.** Starts a new operation or project.
3. **Edit `source.qst`.** Fill in the values described in section 5.

`credit` and `identity` are generated automatically when the world is created. Do not invent them.

---

## 4. World structure

```
MyWorld/
├── source.qst        required, controls the whole world
├── index.html
├── style.css
├── script.js
└── assets/           optional folders
```

Rules:

- `source.qst` is required and mandatory for every world.
- Only `.html`, `.css`, `.js` and listed asset files are served.
- `source.qst` is **never** served to anyone, including on Public worlds.

---

## 5. source.qst reference

`source.qst` manages and operates the entire world at meta-meta level. It defines files and folders as ids and holds other developer features.

### 5.1 Header (top of the file)

Two lines, always first:

```
@~Qasthra | ([origin][credit][depth])
:([Password][{@Owners}{Identity}]):(Visibility)
```

Example (all values are fake):

```
@~Qasthra | ([{X=10}{Y=20}][{2q7>2&b829-89s8<9p92*2}][{Z≈7}])
:([{1234567890}][{@me%A, @you%B, @them%C}{0N2ow29#^n2&20w}]):({Public})
```

### 5.2 Field table

| Field | Required | Description |
|---|---|---|
| `@~Qasthra \|` | Yes | Marks the file as property of Qasthra. |
| **origin** | Yes | The XY position of the world. Written `{X=n}{Y=n}`. |
| **credit** | Auto | Qasthra's approval code. Generated on creation. Never edit it. |
| **depth** | Yes | Max Z depth supported. Written `{Z≈n}`. |
| **Password** | Yes | The world's password. See section 11 for how it is handled. |
| **@Owners** | Yes | Owner usernames with levels. Written `@username%level`, comma separated. |
| **Identity** | Auto | The world's identity code in `datahub.db`. Generated on creation. |
| **Visibility** | Yes | `Public` or `Private`. Case insensitive. |

### 5.3 Owner levels

| Level | Can do |
|---|---|
| **A** | Anything. |
| **B** | Anything except promoting themselves to A. |
| **C** | Edit only the unsourced code (web files, not `source.qst`). |

Levels are enforced by the server, not by the file. Editing the file by hand cannot grant a higher level.

### 5.4 Visibility

- **Public:** users can inspect the world's data files, except `source.qst`.
- **Private:** only listed owners can open the world.

---

## 6. Pathways and keys

Pathways create **one-way** directions to exchange data with other worlds. They go below the header.

Format:

```
#~pathways;
([{name}]|{[X=n}{Y=n}{Z=n]}<[{key}])
```

Example:

```
#~pathways;
([{cloud-storage}]|{[X=922}{Y=192}{Z=920}]<[{123nB&×10}])
```

Add more pathways on new lines. Do not repeat `#~pathways;`. Each pathway starts with `(` and ends with `)`.

### 6.1 Direction symbols

| Symbol | Meaning |
|---|---|
| `<` | Make a key for this coordinate (this world is the one being reached). |
| `>` | Use a key for this coordinate (this world is reaching out). |

### 6.2 How a pathway is checked

1. A qast call asks for a coordinate.
2. The server finds a matching pathway in the world's `source.qst`.
3. If the pathway uses `>`, the key must match the target world's `<` key.
4. No matching pathway means the request is denied.

Pathways are one-way. A pathway from World A to World B does not let B reach A.

---

## 7. Address list

The address list gives each file and folder a unique id. It can be hidden or shown on public code. The site still works if some files or folders are hidden.

Format:

```
#~address;
([{id}]|[{name}][{type}]|[{stat}])
```

Example:

```
#~address;
([{1}]|[{README.md}][{file}]|[{+}])
```

Add more entries on new lines. Do not repeat `#~address;`. Each entry starts with `(` and ends with `)`.

| Field | Description |
|---|---|
| **id** | A number or letter identifier. Must be unique in the world. |
| **name** | The file or folder name. |
| **type** | `file` or `folder`. |
| **stat** | `+` show on public code, `-` hide on public code. |

`source.qst` cannot appear in this list.

---

## 8. Portbase

The portbase goes below the address list.

Format:

```
%([{value}])%
```

Example:

```
%([{91Nnq&#1919}])%
```

The value comes from the portbase you created in step 1.

---

## 9. Qast tags

Authors write normal HTML, CSS, and JS. The only additions are the **qast tags**. Each one takes a coordinate where a web address would normally go, and the renderer resolves it inside Qasthra. Authors never write web addresses and never call `fetch`.

### 9.1 Tag overview

| Tag | Purpose |
|---|---|
| `<qast>` | Core tag. Fetches a coordinate and shows the result. |
| `<qast-notif>` | Shows a notification sent from a coordinate. |
| `<qast-list>` | Repeats a template for every item a coordinate returns. |
| `<qast-img>` | Shows an image stored at a coordinate. |
| `<qast-media>` | Plays audio or video stored at a coordinate. |
| `<qast-link>` | A link that goes to a coordinate (another page or world). |
| `<qast-embed>` | Shows another world's page inside this one. |
| `<qast-live>` | Keeps a value updated at a set interval. |
| `<qast-if>` | Shows content only when a coordinate meets a condition. |
| `<qast-form>` | Sends form data to a coordinate. |
| `<qast-file>` | Points to a file in this world by its address id. |
| `<qast-preload>` | Loads and caches coordinates before they are needed. |
| `<qast-count>` | Shows a number, such as a total or a badge count. |

Tag names are not case sensitive. Unknown tags are ignored by the browser, so a page never breaks if the renderer is unavailable.

### 9.2 Coordinate syntax

Every tag reads its coordinate from the `value` attribute.

```
value="X=1, Y=1, Z=1"
```

- Spaces after commas are optional.
- X, Y, and Z must all be present and must be whole numbers.
- Z cannot exceed the world's `depth`.
- The coordinate must be reachable through a declared pathway (section 6), or be inside the same world.

### 9.3 Shared attributes

These work on every qast tag unless noted.

| Attribute | Values | Default | Description |
|---|---|---|---|
| `value` | coordinate | required | The coordinate to read. |
| `cache` | `none`, `session`, `persist` | `session` | How long the result is kept. |
| `version` | text or number | none | Changing it forces a fresh fetch. |
| `fallback` | text | empty | Shown when the request fails or is denied. |
| `timeout` | seconds, 1 to 30 | `6` | Stops waiting after this time. |
| `loading` | `eager`, `lazy` | `lazy` | `lazy` loads only when the tag nears the screen. |
| `id` | text | none | Lets styles and scripts find the tag. |
| `hidden-on-error` | present or absent | absent | Hides the tag entirely if it fails. |

### 9.4 States and styling

The renderer sets a `data-state` attribute on every qast tag so authors can style each stage in CSS.

| State | Meaning |
|---|---|
| `loading` | Request in progress. |
| `ready` | Result received and shown. |
| `empty` | The coordinate exists but has no content. |
| `denied` | No pathway, wrong key, or not enough permission. |
| `error` | Timeout or server failure. |

```css
qast[data-state="loading"] { opacity: 0.5; }
qast[data-state="denied"]  { border: 1px solid red; }
```

### 9.5 Events

Each tag fires normal browser events on itself, so authors can react with ordinary JS.

| Event | When |
|---|---|
| `qast-load` | The result is ready. |
| `qast-error` | The request failed. |
| `qast-denied` | The request was refused. |
| `qast-update` | A live or refreshed value changed. |

```js
document.querySelector("#score")
  .addEventListener("qast-load", () => console.log("score ready"));
```

### 9.6 `<qast>` (core)

Fetches a coordinate and places the result inside the tag.

```html
<qast value="X=1, Y=1, Z=1"></qast>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `as` | `text`, `html`, `json`, `number` | `text` | How the result is shown. |
| `field` | text | none | For `json`, shows one named field only. |

- `text` is safest and shows the result exactly as plain text.
- `html` is cleaned by the renderer. Scripts, event attributes, and outside addresses are removed.

### 9.7 `<qast-notif>`

Shows a notification whose message comes from a coordinate.

```html
<qast-notif value="X=5, Y=2, Z=1" type="success" duration="4"></qast-notif>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `type` | `info`, `success`, `warn`, `error` | `info` | Style and icon. |
| `duration` | seconds, 0 for sticky | `5` | How long it stays. |
| `position` | `top`, `bottom`, `top-right`, `bottom-right` | `top-right` | Where it appears. |
| `dismissible` | present or absent | present | Shows a close button. |
| `on` | `load`, `click`, `change` | `load` | When it appears. |
| `once` | present or absent | absent | Shows only the first time per session. |

Limits: at most 3 notifications on screen at once. Extra ones wait in a queue.

### 9.8 `<qast-list>`

Repeats a template for every item returned by a coordinate.

```html
<qast-list value="X=3, Y=7, Z=0" limit="10">
  <template>
    <li>{title}: {score}</li>
  </template>
</qast-list>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `limit` | 1 to 100 | `20` | Maximum items shown. |
| `sort` | field name | none | Sort by this field. |
| `order` | `asc`, `desc` | `asc` | Sort direction. |
| `empty` | text | empty | Shown when there are no items. |

Fields in `{curly braces}` are filled in from each item. Values are always inserted as text, never as markup.

### 9.9 `<qast-img>`

```html
<qast-img value="X=2, Y=2, Z=1" alt="Map of the world" width="300"></qast-img>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `alt` | text | required | Description for accessibility. |
| `width`, `height` | pixels | auto | Display size. |
| `fit` | `contain`, `cover` | `contain` | How it fills its box. |
| `placeholder` | text | empty | Shown while loading. |

Only image types are accepted. Any other file type shows the `fallback`.

### 9.10 `<qast-media>`

```html
<qast-media value="X=8, Y=1, Z=0" type="audio" controls></qast-media>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `type` | `audio`, `video` | required | Kind of media. |
| `controls` | present or absent | present | Shows play controls. |
| `loop` | present or absent | absent | Repeats playback. |
| `muted` | present or absent | absent | Starts silent. |

Autoplay with sound is never allowed.

### 9.11 `<qast-link>`

A link that goes to a coordinate, such as another page or world.

```html
<qast-link value="X=922, Y=192, Z=920">Visit the cloud</qast-link>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `target` | `self`, `stage` | `self` | Where the destination opens. |
| `confirm` | text | none | Asks before leaving, using this text. |

Links to a world outside your pathways show a confirmation by default.

### 9.12 `<qast-embed>`

Shows another world's page inside this one.

```html
<qast-embed value="X=40, Y=12, Z=3" height="300"></qast-embed>
```

- Requires a pathway to the target world.
- The embedded page runs in its own sandbox and cannot reach the parent.
- Maximum nesting depth is 2.

### 9.13 `<qast-live>`

Keeps a value updated on a timer.

```html
<qast-live value="X=6, Y=6, Z=1" every="10"></qast-live>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `every` | seconds, 5 to 3600 | `30` | Time between refreshes. |
| `pause-hidden` | present or absent | present | Pauses when the tab is not visible. |

Fires `qast-update` on each change. A world can run at most 5 live tags at once.

### 9.14 `<qast-if>`

Shows its content only when a condition about a coordinate is true.

```html
<qast-if value="X=9, Y=9, Z=1" is="exists">
  <p>The vault is open.</p>
</qast-if>
```

| `is` value | True when |
|---|---|
| `exists` | The coordinate has content. |
| `empty` | The coordinate has none. |
| `allowed` | The pathway lets this user read it. |
| `equals` | The value matches the `to` attribute. |

Add `else` content with `<template else>` inside the tag.

### 9.15 `<qast-form>`

Sends form data to a coordinate.

```html
<qast-form value="X=4, Y=4, Z=1">
  <input name="message" maxlength="200">
  <button>Send</button>
</qast-form>
```

- Requires a write pathway. A read-only pathway cannot receive data.
- Fields are limited to text and numbers. File fields are not allowed.
- Limits apply: maximum 2 KB per submission and 10 submissions per minute per user.
- Fires `qast-load` on success and `qast-error` or `qast-denied` otherwise.

### 9.16 `<qast-file>`

Points to a file in this world by the id from the address list (section 7).

```html
<qast-file id-ref="1" as="text"></qast-file>
```

| Attribute | Values | Description |
|---|---|---|
| `id-ref` | address id | The id from `#~address;`. |
| `as` | `text`, `image`, `download` | How the file is used. |

Hidden files (`stat` is `-`) work for the world's own pages but stay hidden from public code.

### 9.17 `<qast-preload>`

Loads and caches coordinates before they are needed, making later tags instant.

```html
<qast-preload value="X=1, Y=1, Z=1; X=1, Y=2, Z=1"></qast-preload>
```

- Separate coordinates with a semicolon.
- Maximum 10 coordinates per tag.
- Preloading never shows anything on the page.

### 9.18 `<qast-count>`

Shows a number, useful for totals or badges.

```html
<qast-count value="X=3, Y=7, Z=0" of="items" format="short"></qast-count>
```

| Attribute | Values | Default | Description |
|---|---|---|---|
| `of` | `items`, field name | `items` | What to count or read. |
| `format` | `full`, `short` | `full` | `short` turns 1200 into 1.2K. |
| `zero` | text | `0` | Shown when the count is zero. |

### 9.19 How it works

1. The world runs inside a sandboxed frame with no access to the main site.
2. The renderer scans the world for qast tags.
3. A tag cannot use the network. It asks the renderer through a small message bridge, sending a request number.
4. The main script validates the coordinate, checks the pathway and permissions, checks the cache, and calls the Qasthra server function if needed.
5. The answer is sent back with the same request number and placed in the tag.

### 9.20 Caching

- Results are cached under their coordinate.
- `cache="session"` keeps a result until the tab closes. `persist` keeps it across visits. `none` always fetches fresh.
- Changing a tag's `version`, or the source version on the server, refreshes the cache.
- Notifications, forms, and live tags are never cached beyond their refresh time.

### 9.21 Limits

| Limit | Value |
|---|---|
| Qast tags per page | 100 |
| Result size per request | 256 KB |
| Requests per user per minute | 60 |
| Live tags per world | 5 |
| Embed nesting | 2 |
| Coordinates per preload tag | 10 |

Tags over the limit show their `fallback` and fire `qast-error`.

### 9.22 Writing safely

- Prefer `as="text"`. Use `as="html"` only for trusted content.
- Always add `fallback` text for important content.
- Never put secrets, passwords, or keys in a tag attribute. Anyone can read a world's public code.
- Test denied and empty states, not only the happy path.

---

## 10. Comments

In any `.qst` file, start a comment with `~.~` and end it with `~.~` exactly. Put the contents between.

```
~.~ This is a comment ~.~
```

---

## 11. Security and safeguards

These rules protect the world, its owners, and the server.

### 11.1 File handling

- `source.qst` is never served, including on Public worlds.
- Uploads are limited by file size and extension. Unlisted extensions are rejected.
- Uploaded files are scanned. Any outside web address (`http://`, `https://`, `//`, `ws://`) is rejected.

### 11.2 Secrets

- Passwords and keys are stored hashed on the server.
- Plain-text values in `source.qst` are cleared after the world is created.
- Never reuse the example values in this document. They are fake.
- Never share your password, keys, or credit and identity codes.

### 11.3 Auto-generated values

- `credit` and `identity` are generated by Qasthra and cannot be set by hand.
- A world whose credit does not match the server's record is refused.

### 11.4 Isolation

- Worlds run in a sandboxed frame without access to the main page, login, or storage.
- The content security policy for world frames allows no external connections.
- The only way out of the frame is the renderer's message bridge.

### 11.5 Access control

- Every coordinate call goes through one gate that checks who is asking and what they may read.
- A qast call works only through a declared pathway.
- Owner levels A, B, and C are enforced by the server.
- Requests are rate limited per user and per world.

### 11.6 Safe failure

- Hidden files (`stat` is `-`) are not shown on public code, but the world still works.
- A failed request returns an error message and never partial data.

---

## 12. Validation rules

A `source.qst` is rejected if any of these are true:

- The header is missing, or is not the first two lines.
- A required field is empty.
- `Visibility` is not `Public` or `Private`.
- An owner level is not A, B, or C.
- An address id is duplicated.
- An address entry lists `source.qst`.
- A pathway is missing its name, coordinate, or key.
- A line contains an outside web address.
- `credit` or `identity` is present but does not match the server's record.

---

## 13. Troubleshooting

| Problem | Likely cause | Fix |
|---|---|---|
| World will not create | Missing or invalid header | Check the two header lines against section 5. |
| Upload rejected | Outside web address or bad extension | Remove the link or rename the file. |
| qast tag shows nothing | No matching pathway | Add a pathway for that coordinate. |
| Pathway denied | Key does not match | Copy the key again from the target world. |
| Stale content | Old cache | Change the item's version or clear its cache. |
| Cannot edit as owner | Level is C | Ask an A owner to raise your level. |

---

## 14. Full example

All values are fake.

```
@~Qasthra | ([{X=10}{Y=20}][{2q7>2&b829-89s8<9p92*2}][{Z≈7}])
:([{1234567890}][{@me%A, @you%B, @them%C}{0N2ow29#^n2&20w}]):({Public})

#~pathways;
([{cloud-storage}]|{[X=922}{Y=192}{Z=920}]<[{123nB&×10}])

#~address;
([{1}]|[{README.md}][{file}]|[{+}])
([{2}]|[{assets}][{folder}]|[{-}])

%([{91Nnq&#1919}])%
```

---

*Qasthub is part of Qasthra. [Back to top](#head)*
