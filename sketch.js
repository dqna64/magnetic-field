

DIS_HEIGHT = 720;
DIS_WIDTH = DIS_HEIGHT * 4/3;

let r = 1;
let poleR = 10
let numFieldLines = 5;
let resolution = 0.5;
let dragz1 = false;
let dragz2 = false;

let z1;
let z2;
let angle;

function setup() {
  createCanvas(DIS_WIDTH, DIS_HEIGHT);
  z1 = createVector(-DIS_WIDTH/4, -40);
  z2 = createVector(DIS_WIDTH/4, 40);
  refAngle = 0; // -180 ~ 180
}

function draw() {
  background(20);
  translate(DIS_WIDTH/2, DIS_HEIGHT/2);
  z2_z1 = p5.Vector.sub(z2,z1);

  for (let i = 0; i < 1; i+=1/numFieldLines) {
    let angle = refAngle + 360 * i;
    angle = mod(angle, 180); // 0 <= angle <= 180

    for (let j = 0; j < 180; j+=resolution) {
      let u1Ang = j + z2_z1.heading();
      uiAng = mod(u1Ang, 180)

      let z = getPoint(angle, u1Ang) // +ve angle

      noStroke();
      fill(255);
      circle(z.x, -z.y, 2*r);
      if (i == 0) {
        stroke(134, 240, 205, 60);
        line(z1.x, -z1.y, z.x, -z.y);
      }
    }
  }
  refAngle += 0.8;

  stroke(20);
  strokeWeight(2);
  fill(255, 0, 0);
  circle(z1.x, -z1.y, 2*poleR); // Draw z1
  fill(0, 0, 255);
  circle(z2.x, -z2.y, 2*poleR); // Draw z2

  if (dragz1) {
    let modMouseX = mouseX - DIS_WIDTH/2;
    let modMouseY = -(mouseY - DIS_HEIGHT/2);
    z1.x = modMouseX;
    z1.y = modMouseY;
  } else if (dragz2) {
    let modMouseX = mouseX - DIS_WIDTH/2;
    let modMouseY = -(mouseY - DIS_HEIGHT/2);
    z2.x = modMouseX;
    z2.y = modMouseY;
  }
}


function getPoint(angle, u1Ang) {
  // angle = mod(angle, 360);
  // u1Ang = mod(u1Ang, 360);
  let u2Ang = angle + u1Ang;
  let u1 = p5.Vector.fromAngle(myRadians(u1Ang));
  let u2 = p5.Vector.fromAngle(myRadians(u2Ang));
  let mu = ((z2.y-z1.y)/u1.y - (z2.x-z1.x)/u1.x) / (u2.x/u1.x - u2.y/u1.y);
  let z = p5.Vector.add(z2, u2.mult(mu));
  return z;
}

function myRadians(angle) {
  return angle * PI / 180;
}

function mod(dividend, divisor) { // B/c js doesn't know how to mod -ve numbers properly >:(
  return ((dividend%divisor)+divisor)%divisor;
}


let looper = 0;
function keyPressed() {
  if (key == " ") {
    looper += 1;
    if (looper%2 == 0) {
      loop();
    } else {
      noLoop();
    }
  } else if (key == 'd') {
    debug = !debug;
  }
}

function mousePressed() {
  let modMouseX = mouseX - DIS_WIDTH/2;
  let modMouseY = -(mouseY - DIS_HEIGHT/2);
  let dFromz1 = dist(modMouseX, modMouseY, z1.x, z1.y);
  let dFromz2 = dist(modMouseX, modMouseY, z2.x, z2.y);

  if (dFromz1 <= poleR) {
    dragz1 = !dragz1;
  } else if (dFromz2 <= poleR) {
    dragz2 = !dragz2;
  }
}
