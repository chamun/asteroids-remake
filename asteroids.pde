import java.util.List;
import java.util.LinkedList;

List<Asteroid> asteroids;

void setup() {
  size(600, 600);
  asteroids = new LinkedList<Asteroid>();
  for (int i = 0; i < 10; ++i) {
    asteroids.add(new Asteroid());
  }
}

void draw() {
  background(0, 0, 0);
  for (Asteroid c: asteroids) {
    c.update();
    c.draw();
  }
}
