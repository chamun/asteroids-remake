module.exports = {
  options: {
    footer: "main();"
  },
  dist: {
    src: [
      'src/init.js',
      'src/Polygon.js',
      'src/Vector.js',
      'src/Asteroid.js',
      'src/SmallAsteroid.js',
      'src/MediumAsteroid.js',
      'src/LargeAsteroid.js',
      'src/*.js'
    ],
    dest: 'main.js'
  }
}
