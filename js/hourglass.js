function setup() {
  createCanvas(400, 400);
  angleMode(DEGREES);
  noFill(); // כדי לא למלא את הרקע בצבע
}

function draw() {
  // לא הוספנו background, כך שהרקע יהיה שקוף
  // כל שאר הקוד שלך נשאר כמות שהוא

  // I. draw top wood
  // 1. top of cylinder
  fill("#cc8552");
  noStroke();
  beginShape();
  vertex(width / 2 - 75, 100);
  bezierVertex(width / 2 - 73, 80, width / 2 + 73, 80, width / 2 + 75, 100);
  bezierVertex(width / 2 + 73, 120, width / 2 - 73, 120, width / 2 - 75, 100);
  endShape();
  // 2. side of cylinder
  fill("#8b5738");
  noStroke();
  beginShape();
  vertex(width / 2 - 75, 100);
  bezierVertex(width / 2 - 73, 120, width / 2 + 73, 120, width / 2 + 75, 100);
  line(width / 2 + 75, 100, width / 2 + 75, 115);
  vertex(width / 2 + 75, 115);
  bezierVertex(width / 2 + 73, 140, width / 2 - 73, 140, width / 2 - 75, 115);
  line(width / 2 - 75, 115, width / 2 - 75, 100);
  endShape();

  // וכל שאר ההנפשות והצורות נשארות כפי שהיו
}
