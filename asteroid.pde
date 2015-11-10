class Asteroid {
  private PVector position;
  private PVector velocity;
  private static final int RADIUS = 20;
  private static final int DIAMETER = RADIUS * 2;

  public Asteroid() {
    position = new PVector(random(width), random(height));
    velocity = new PVector(random(-1, 1), random(-1, 1));
  }

  public void draw() {
    noFill();
    stroke(200, 200, 200);
    ellipse(position.x, position.y, DIAMETER, DIAMETER);

    if (isIntersectingBounds()) {
      ellipse(
        torusDisplay(position.x, width),
        torusDisplay(position.y, height),
        DIAMETER, DIAMETER
      );
    }
  }

  public void update() {
    position.add(velocity);
    if(position.x > width || position.x < 0)
      position.x = torusDisplay(position.x, width);
    if(position.y > height || position.y < 0)
      position.y = torusDisplay(position.y, height);
  }

  private float torusDisplay(float component, float length) {
    if (component + RADIUS > length) return component - length;
    if (component - RADIUS < 0    )  return component + length;
    return component;
  }

  private boolean isIntersectingBounds() {
    return torusDisplay(position.x, width)  != position.x ||
           torusDisplay(position.y, height) != position.y;
  }
}
