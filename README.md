Asteroids Remake
================

A remake of the game Asteroids to run in smart phones browsers.

## Dependencies

- nodejs & npm

    $ sudo apt-get install nodejs npm

- grunt-cli

    $ sudo npm install -g grunt-cli

### Install the project

    $ sudo npm install

### Build the project

    $ grunt 

### Watching the files

For the project to be built every time a file changes, run

    $ grunt watch

### Testing

Tests are written in CoffeeScript under /spec, they are transpiled to JavaScript
and put under /spec/out before they are run. To run tests use:

    $ grunt test
