module.exports = {
  options: {
    footer: "main();"
  },
  dist: {
    src: [ 'src/init.js', 'src/Polygon.js', 'src/Vector.js', 'src/*.js' ],
    dest: 'main.js'
  }
}
