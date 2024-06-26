let words = [];
let numWords = 15;
let currentScreen = 'menu';
let selectedWord = null;
let fontInput;
let fontWord = "";
let fonts = [];
let fontWords = [];
let displayFont = null;

function preload() {
  fonts = [
    'Georgia', 'Times New Roman', 'Arial', 'Verdana', 'Courier New', 
    'Comic Sans MS', 'Impact', 'Lucida Console', 'Palatino', 
    'Trebuchet MS', 'Arial Black', 'Tahoma', 'Book Antiqua', 
    'Lucida Sans Unicode', 'Helvetica'
  ];
}

function setup() {
  createCanvas(600, 600);
  textSize(32);
  for (let i = 0; i < numWords; i++) {
    let word = new Word(random(width), random(height), `Word${i+1}`);
    words.push(word);
  }
  fontInput = createInput();
  fontInput.position(70, 15);
  fontInput.size(200);
  fontInput.hide(); // Initially hide the input
}

function draw() {
  background(255);

  if (currentScreen === 'menu') {
    drawMenu();
  } else if (currentScreen === 'words') {
    drawWords();
  } else if (currentScreen === 'fonts') {
    drawFonts();
  } else if (currentScreen === 'fontDetail') {
    drawFontDetail();
  } else if (currentScreen === 'detail') {
    drawDetail();
  }
}

function drawMenu() {
  background(200);
  textAlign(CENTER, CENTER);
  textSize(64);
  fill(0);
  text('Menu Principal', width / 2, height / 4);

  // Botão Palavras
  fill(100);
  rect(width / 2 - 100, height / 2 - 60, 200, 50);
  fill(255);
  textSize(32);
  text('Palavras', width / 2, height / 2 - 35);

  // Botão Fontes
  fill(100);
  rect(width / 2 - 100, height / 2 + 20, 200, 50);
  fill(255);
  textSize(32);
  text('Fontes', width / 2, height / 2 + 45);
}

function drawWords() {
  drawHeader("Palavras");

  for (let word of words) {
    word.move();
    word.display();
  }
}

function drawFonts() {
  drawHeader("Fontes");

  if (fontWord !== fontInput.value()) {
    fontWord = fontInput.value();
    fontWords = [];
    for (let i = 0; i < fonts.length; i++) {
      let word = new Word(random(width), random(height), fontWord, fonts[i]);
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
  text(`Fonte: ${displayFont}`, width / 2, height / 2 + 50);

  // Botão de voltar para a tela de fontes
  fill(100);
  rect(width / 2 - 50, height / 2 + 80, 100, 50);
  fill(255);
  textSize(32);
  text('Voltar', width / 2, height / 2 + 115);
}

function drawDetail() {
  drawHeader("Detalhe");

  background(200);
  fill(0);
  textSize(64);
  textAlign(CENTER, CENTER);
  text(selectedWord.text, width / 2, height / 2 - 50);

  // Desenhar botão de voltar
  fill(100);
  rect(width / 2 - 50, height / 2 + 20, 100, 50);
  fill(255);
  textSize(32);
  text('Voltar', width / 2, height / 2 + 45);
}

function drawHeader(title) {
  // Cabeçalho
  fill(150);
  rect(0, 0, width, 60);
  fill(255);
  textAlign(LEFT, CENTER);
  textSize(32);
  text(title, 60, 30);

  // Setinha de voltar
  fill(255);
  triangle(20, 20, 40, 30, 20, 40);
}

function mousePressed() {
  if (currentScreen === 'menu') {
    if (mouseX > width / 2 - 100 && mouseX < width / 2 + 100) {
      if (mouseY > height / 2 - 60 && mouseY < height / 2 - 10) {
        currentScreen = 'words';
      } else if (mouseY > height / 2 + 20 && mouseY < height / 2 + 70) {
        currentScreen = 'fonts';
        fontInput.show(); // Show input when entering the fonts screen
      }
    }
  } else if (currentScreen === 'words' || currentScreen === 'fonts') {
    if (mouseX > 0 && mouseX < 60 && mouseY > 0 && mouseY < 60) {
      currentScreen = 'menu';
      fontInput.hide(); // Hide input when leaving the fonts screen
    } else if (currentScreen === 'words') {
      for (let word of words) {
        let wordWidth = textWidth(word.text);
        if (mouseX > word.x && mouseX < word.x + wordWidth && mouseY > word.y - 32 && mouseY < word.y) {
          selectedWord = word;
          currentScreen = 'detail';
          break;
        }
      }
    } else if (currentScreen === 'fonts') {
      for (let word of fontWords) {
        let wordWidth = textWidth(word.text);
        if (mouseX > word.x && mouseX < word.x + wordWidth && mouseY > word.y - 32 && mouseY < word.y) {
          displayFont = word.font;
          currentScreen = 'fontDetail';
          break;
        }
      }
    }
  } else if (currentScreen === 'detail') {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 20 && mouseY < height / 2 + 70) {
      currentScreen = 'words';
    } else if (mouseX > 0 && mouseX < 60 && mouseY > 0 && mouseY < 60) {
      currentScreen = 'menu';
    }
  } else if (currentScreen === 'fontDetail') {
    if (mouseX > width / 2 - 50 && mouseX < width / 2 + 50 && mouseY > height / 2 + 80 && mouseY < height / 2 + 130) {
      currentScreen = 'fonts';
    } else if (mouseX > 0 && mouseX < 60 && mouseY > 0 && mouseY < 60) {
      currentScreen = 'menu';
      fontInput.hide(); // Hide input when going back to menu
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
    if (this.y < 32 || this.y > height) {
      this.ySpeed *= -1;
    }
  }

  display() {
    fill(0);
    textFont(this.font);
    text(this.text, this.x, this.y);
  }
}
