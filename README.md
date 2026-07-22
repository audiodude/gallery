# Digital Artwork Gallery

A gallery of 2D and 3D browser animations and artwork by Travis Briggs, some
featuring original music. Live at
[gallery.travisbriggs.com](https://gallery.travisbriggs.com).

**Epilepsy warning:** the artwork contains rapidly changing shapes and colors.

## How it works

The site is built with [Jekyll](https://jekyllrb.com/). Each piece is a single
HTML file in one of two collections:

- `_2d/` — canvas sketches written in [Processing](https://processing.org/)
  (rendered with Processing.js) or [p5.js](https://p5js.org/) (pages with
  `p5: true` in their front matter)
- `_3d/` — WebGL scenes built with [three.js](https://threejs.org/)

Front matter on each piece controls its title, date, and optional `music`
(looping audio from `audio/`, in MP3 and Ogg). The layouts in `_layouts/` wrap
each sketch with playback controls, an info panel, and Open Graph metadata; the
index page lists every piece in both collections, newest first.

## Running locally

Requires Ruby with Bundler.

```sh
bundle install
bundle exec jekyll serve
```

Then visit http://localhost:4000. The built site is output to `_site/`.

## Capture server

`_server/` contains an optional Express app for turning sketches into GIFs. It
serves the built `_site/` directory on port 3000 and accepts POSTed PNG frames
at `/capture` (sent by `js/capture.js` when a sketch is loaded with `capture`
in the URL). Frames land in `_server/out/`, and `_server/combine.sh` assembles
them into a GIF with `avconv`.

```sh
cd _server
npm install
node index.js
```

## Deployment

The site is deployed to Netlify, which builds it with Jekyll and publishes
`_site/`. Pushes to `main` deploy automatically.

## License

[MIT](LICENSE)
