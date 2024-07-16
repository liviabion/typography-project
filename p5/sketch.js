let slider1;
let words = [];
let currentScreen = 'fonts';
let selectedWord = null;
let fontInput;
let fontWord = "";
let fonts = [];
let fontWords = [];
let displayFont = null;
let circles = [];
let textSizeValue = 32;  

function preload() {
  fonts = [
    "Potta One", "Lilita One", "Playwrite MX", "Oi", "Monofett",
    "Dancing Script", "Rock Salt", "UnifrakturMaguntia", "League Script", "Bebas Neue",
    'Times New Roman', 'Arial', 'Helvetica', 'Courier New', 'Comic Sans MS',
    'Georgia', 'Verdana', 'Impact', 'Tahoma', 'Trebuchet MS'
  ];
}

function setup() {
  createCanvas(600, 550);
  
  slider1 = createSlider(10, 100, 32);  
  slider1.position(440, 20);
  slider1.input(repaint);

  textSize(32);
  fontInput = createInput();
  fontInput.position(200, 20);
  fontInput.size(200);
}

function draw() {
  drawBackground();

  if (currentScreen === 'fonts') {
    drawFonts();
  } else if (currentScreen === 'fontDetail') {
    drawFontDetail();
  }

  updateCircles();
}

function drawBackground() {
  background(0);

  for (let circle of circles) {
    noFill();
    stroke(circle.color);
    ellipse(circle.x, circle.y, circle.size);
    ellipse(circle.x, circle.y, circle.size / 2);
    if (circle.size > 30) {
      noStroke();
      fill(circle.color);
      ellipse(circle.x, circle.y, circle.size / 10);
    }
  }
}

function drawFonts() {
  textFont('Georgia');
  drawHeader("Fontes");

  if (fontWord !== fontInput.value()) {
    fontWord = fontInput.value();
    fontWords = [];
    for (let i = 0; i < fonts.length; i++) {
      let word = new Word(random(20, width - 20), random(80, height - 20), fontWord, fonts[i], textSizeValue);
      fontWords.push(word);
    }
  }

  for (let word of fontWords) {
    word.move();
    word.display();
  }
}

function drawFontDetail() {

  background(0);
  noStroke();
  fill(lerpColor(color(255, 0, 0), color(0, 0, 255), sin(frameCount * 0.01) * 0.5 + 0.5));
  textSize(64);
  textAlign(CENTER, CENTER);
  textFont(displayFont);
  text(fontWord, width / 2, height / 2 - 50);

  fill(255);
  textSize(32);
  textFont('Georgia');
  text(`Fonte: "${displayFont}"`, width / 2, height / 2 + 50);

  fill(100);
  rect(width / 2 - 50, height / 2 + 80, 100, 50);
  fill(255);
  textSize(32);
  textFont('Georgia');
  text('Voltar', width / 2, height / 2 + 108);
}

function drawHeader(title) {
  fill(150);
  rect(0, 0, width, 60);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(32);
  text(title, 60, 30);
}

function repaint() {
  textSizeValue = slider1.value();
  for (let word of fontWords) {
    word.size = textSizeValue;
  }
}

function mousePressed() {
  if (currentScreen === 'fonts') {
    for (let word of fontWords) {
      let wordWidth = textWidth(word.text);
      if (mouseX > word.x && mouseX < word.x + wordWidth && mouseY > word.y - word.size && mouseY < word.y) {
        displayFont = word.font;
        currentScreen = 'fontDetail';
        fontInput.hide();
        slider1.hide();
        break;
      }
    }
  } else if (currentScreen === 'fontDetail') {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
      fontInput.show();
      slider1.show();
      currentScreen = 'fonts';
    }
  }
}

class Word {
  constructor(x, y, text, font, size) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font || 'Georgia';
    this.size = size || textSizeValue;  
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    this.startColor = color(random(255), random(255), random(255));
    this.endColor = color(random(255), random(255), random(255));
    this.color = this.startColor;
    this.colorChangeSpeed = 0.01;
    this.colorProgress = 0;
  }

  move() {
    let wordWidth = textWidth(this.text);
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x < 0) {
      this.x = 0;
      this.xSpeed *= -1;
    }
    if (this.x + wordWidth > width) {
      this.x = width - wordWidth;
      this.xSpeed *= -1;
    }
    if (this.y < 100) {
      this.y = 100;
      this.ySpeed *= -1;
    }
    if (this.y > height) {
      this.y = height;
      this.ySpeed *= -1;
    }

    this.colorProgress += this.colorChangeSpeed;
    if (this.colorProgress >= 1) {
      this.colorProgress = 0;
      this.startColor = this.endColor;
      this.endColor = color(random(255), random(255), random(255));
    }
    this.color = lerpColor(this.startColor, this.endColor, this.colorProgress);
  }

  display() {
    fill(this.color);
    noStroke();
    textFont(this.font);
    textSize(this.size);
    text(this.text, this.x, this.y);
  }
}

function updateCircles() {
  if (frameCount % 10 === 0) {
    let newCircle = {
      x: random(width),
      y: random(height),
      size: 0,
      maxSize: random(300, 1200),
      color: color(random(255), 10, random(255), 150),
      lifespan: 200
    };
    circles.push(newCircle);
  }

  for (let i = circles.length - 1; i >= 0; i--) {
    circles[i].size += 4;
    circles[i].color.setAlpha(circles[i].color.levels[3] - 2);
    if (circles[i].size > circles[i].maxSize || circles[i].color.levels[3] <= 0) {
      circles.splice(i, 1);
    }
  }
}
