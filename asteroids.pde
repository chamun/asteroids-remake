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

class Asteroid {
  PVector position;
  PVector velocity;
  
  public Asteroid() {
    position = new PVector(random(width), random(height));
    velocity = new PVector(random(1), random(1));
  }
  
  public void draw() {
    noFill();
    stroke(200, 200, 200);
    ellipse(position.x, position.y, 40, 40);
  }
  
  public void update() {
    position.add(velocity);
    if (position.x > width) position.x -= width;
    if (position.x < 0) position.x += width;
    if (position.y > height) position.y -= height;
    if (position.y < 0) position.y += height;
  }
}
