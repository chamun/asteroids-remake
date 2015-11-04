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
  }
  
  public void update() {
    position.add(velocity);
    position.x = fix(position.x, width);
    position.y = fix(position.y, height); 
  }
  
  private float fix(float component, float length) {
    if (component - RADIUS > length) return component - length;
    if (component + RADIUS < 0    )  return component + length;
    return component;
  }
}
