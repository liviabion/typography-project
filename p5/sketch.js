let words = [];
let currentScreen = 'fonts';
let selectedWord = null;
let fontInput;
let fontWord = "";
let fonts = [];
let fontWords = [];
let displayFont = null;

function preload() {

  fonts = [ 
    "Potta One", "Lilita One", "Playwrite MX", "Oi", "Monofett", 
    "Dancing Script", "Rock Salt", "UnifrakturMaguntia","League Script","Bebas Neue",
    'Times New Roman', 'Arial', 'Helvetica', 'Courier New', 'Comic Sans MS'
  ];
}

function setup() {
  createCanvas(600, 600);
  textSize(32);
  fontInput = createInput();
  fontInput.position(200, 20);
  fontInput.size(200);
}

function draw() {
  background(255);

  if (currentScreen === 'fonts') {
    drawFonts();
  } else if (currentScreen === 'fontDetail') {
    drawFontDetail();
  }
}

function drawFonts() {

  textFont('Georgia');
  drawHeader("Fontes");

  if (fontWord !== fontInput.value()) {
    fontWord = fontInput.value();
    fontWords = [];
    for (let i = 0; i < fonts.length; i++) {
      let word = new Word(random(width), random(height+60), fontWord, fonts[i]);
      fontWords.push(word);
    }
  }

  for (let word of fontWords) {
    word.move();
    word.display();
  }
}

function drawFontDetail() {
  drawHeader("Fonte Detalhe");

  background(200);
  fill(0);
  textSize(64);
  textAlign(CENTER, CENTER);
  textFont(displayFont);
  text(fontWord, width / 2, height / 2 - 50);

  fill(0);
  textSize(32);
  textFont('Georgia');
  text(`Fonte: "${displayFont}"`, width / 2, height / 2 + 50);

  // Botão de voltar para a tela de fontes
  fill(100);
  rect(width / 2 - 50, height / 2 + 80, 100, 50);
  fill(255);
  textSize(32);
  textFont('Georgia')
  text('Voltar', width / 2, height / 2 + 115);
}


function drawHeader(title) {
  // Cabeçalho
  fill(150);
  rect(0, 0, width, 60);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(32);
  text(title, 60, 30);

}

function mousePressed() {
   if (currentScreen === 'fonts') {
     if (currentScreen === 'fonts') {
      for (let word of fontWords) {
        let wordWidth = textWidth(word.text);
        if (mouseX > word.x && mouseX < word.x + wordWidth && mouseY > word.y - 32 && mouseY < word.y) {
          displayFont = word.font;
          currentScreen = 'fontDetail';
          fontInput.hide(); // Hide input when leaving the fonts screen

          break;
        }
      }
    }
  } else if (currentScreen === 'fontDetail') {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
      fontInput.show(); // Show input when entering the fonts screen
      currentScreen = 'fonts';
    } 
  }
}

class Word {
  constructor(x, y, text, font) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font || 'Georgia';
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
  }

  move() {
    let wordWidth = textWidth(this.text);
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Bounce off edges
    if (this.x < 0 || this.x + wordWidth > width) {
      this.xSpeed *= -1;
    }
    if (this.y < 60 || this.y > height) {
      this.ySpeed *= -1;
    }
  }

  display() {
    fill(230,20,100);
    textFont(this.font);
    text(this.text, this.x, this.y);
  }
}
