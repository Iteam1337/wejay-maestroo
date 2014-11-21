# Progressbar polymer element

This is an example of a [Polymer Web Component](www.polymer-project.org) that implements
a seekable progressbar.

## Usage

You just need to include the polymer platform and this element in the head of
your html page.

Then, you can start using the `spotify-progressbar` element as any other HTML element
in your page:

```html
<html>
<head>
  <script type="text/javascript" src="bower_components/platform/platform.js"></script>

  <link rel="import" href="bower_components/spotify-progressbar/index.html">
</head>
<body>
  <spotify-progressbar value="10" max="100"></spotify-progressbar>
</body>
</script>
```

#### Events

When the user clicks anywhere on the progressbar, a `change` event is triggered.

## Running the example

To launch the example, install the `spotify-progressbar` bower component:

```sh
$ bower install spotify-progressbar
```

Then launch a web server:

```sh
$ ruby -run -e httpd . -p 5000 # "python -m SimpleHTTPServer 5000" will also do the trick
```

Then, you only need to navigate to [http://localhost:5000/bower_components/spotify-progressbar/demo.html](http://localhost:5000/bower_components/spotify-progressbar/demo.html) from any modern browser.

## TODO

Implement drag-and-drop support for the slider
