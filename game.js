// ================================
// BAGIAN 1: PERSIAPAN
// ================================

// Ambil elemen dari HTML berdasarkan id
const kanvas = document.getElementById("kanvas-game");
const ctx = kanvas.getContext("2d");
const elemenSkor = document.getElementById("tampilan-skor");
const elemenNyawa = document.getElementById("tampilan-nyawa");
const layarGameover = document.getElementById("layar-gameover");
const elemenSkorAkhir = document.getElementById("skor-akhir");
const tombolMainLagi = document.getElementById("tombol-main-lagi");


// ================================
// BAGIAN 2: VARIABEL GAME
// ================================

// Data keranjang
let keranjang = {
  x: 170,
  y: 460,
  lebar: 60,
  tinggi: 20,
  kecepatan: 6,
  warnaUtama: "#00FF88",
  warnaGelap: "#00CC66"
};

// Data game
let skor = 0;
let nyawa = 3;
let bintangList = [];
let gameAktif = true;

// Tombol yang sedang ditekan
let tombolKiri = false;
let tombolKanan = false;

// Kecepatan jatuh bintang
let kecepatanBintang = 2;

// Timer untuk membuat bintang baru
let timerBintang = 0;
let jedaBintang = 60;


// ================================
// BAGIAN 3: FUNGSI MEMBUAT BINTANG
// ================================

function buatBintang() {
  let bintang = {
    x: Math.random() * (kanvas.width - 20) + 10,
    y: -10,
    radius: 10,
    kecepatan: kecepatanBintang + Math.random() * 2
  };
  bintangList.push(bintang);
}


// ================================
// BAGIAN 4: FUNGSI MENGGAMBAR
// ================================

// Fungsi gambar latar belakang
function gambarLatar() {
  ctx.fillStyle = "#000033";
  ctx.fillRect(0, 0, kanvas.width, kanvas.height);
}

// Fungsi gambar keranjang
function gambarKeranjang() {
  // Badan keranjang
  ctx.fillStyle = keranjang.warnaUtama;
  ctx.fillRect(
    keranjang.x,
    keranjang.y,
    keranjang.lebar,
    keranjang.tinggi
  );

  // Garis atas keranjang (biar terlihat 3D)
  ctx.fillStyle = keranjang.warnaGelap;
  ctx.fillRect(
    keranjang.x,
    keranjang.y,
    keranjang.lebar,
    4
  );
}

// Fungsi gambar satu bintang
function gambarBintang(b) {
  ctx.save();
  ctx.translate(b.x, b.y);
  ctx.fillStyle = "#FFD700";
  ctx.shadowColor = "#FFD700";
  ctx.shadowBlur = 15;
  ctx.beginPath();

  // Menggambar bentuk bintang 5 titik
  for (let i = 0; i < 5; i++) {
    let sudutLuar = (i * 72 - 90) * Math.PI / 180;
    let sudutDalam = ((i * 72) + 36 - 90) * Math.PI / 180;
    let xLuar = Math.cos(sudutLuar) * b.radius;
    let yLuar = Math.sin(sudutLuar) * b.radius;
    let xDalam = Math.cos(sudutDalam) * (b.radius / 2);
    let yDalam = Math.sin(sudutDalam) * (b.radius / 2);

    if (i === 0) {
      ctx.moveTo(xLuar, yLuar);
    } else {
      ctx.lineTo(xLuar, yLuar);
    }
    ctx.lineTo(xDalam, yDalam);
  }

  ctx.closePath();
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.restore();
}


// ================================
// BAGIAN 5: DETEKSI TABRAKAN
// ================================

function cekTabrakan(bintang) {
  return (
    bintang.x > keranjang.x &&
    bintang.x < keranjang.x + keranjang.lebar &&
    bintang.y + bintang.radius > keranjang.y &&
    bintang.y - bintang.radius < keranjang.y + keranjang.tinggi
  );
}


// ================================
// BAGIAN 6: UPDATE GAME (LOGIKA)
// ================================

function updateGame() {
  // Gerakkan keranjang
  if (tombolKiri && keranjang.x > 0) {
    keranjang.x -= keranjang.kecepatan;
  }
  if (tombolKanan && keranjang.x + keranjang.lebar < kanvas.width) {
    keranjang.x += keranjang.kecepatan;
  }

  // Timer bintang baru
  timerBintang++;
  if (timerBintang >= jedaBintang) {
    buatBintang();
    timerBintang = 0;
  }

  // Update setiap bintang
  for (let i = bintangList.length - 1; i >= 0; i--) {
    let b = bintangList[i];
    b.y += b.kecepatan;

    // Cek apakah bintang tertangkap
    if (cekTabrakan(b)) {
      skor++;
      elemenSkor.textContent = "Skor: " + skor;
      bintangList.splice(i, 1);

      // Naikkan kesulitan setiap 5 poin
      if (skor % 5 === 0) {
        kecepatanBintang += 0.3;
        if (jedaBintang > 25) {
          jedaBintang -= 3;
        }
      }
      continue;
    }

    // Cek apakah bintang jatuh melewati layar
    if (b.y > kanvas.height + 20) {
      nyawa--;
      elemenNyawa.textContent = "Nyawa: " + nyawa;
      bintangList.splice(i, 1);

      // Cek game over
      if (nyawa <= 0) {
        gameOver();
        return;
      }
    }
  }
}


// ================================
// BAGIAN 7: GAME LOOP
// ================================

function gameLoop() {
  if (!gameAktif) return;

  gambarLatar();
  gambarKeranjang();

  for (let i = 0; i < bintangList.length; i++) {
    gambarBintang(bintangList[i]);
  }

  updateGame();
  requestAnimationFrame(gameLoop);
}


// ================================
// BAGIAN 8: GAME OVER & RESTART
// ================================

function gameOver() {
  gameAktif = false;
  elemenSkorAkhir.textContent = "Skor akhir kamu: " + skor;
  layarGameover.classList.remove("tersembunyi");
}

function mulaiUlang() {
  skor = 0;
  nyawa = 3;
  bintangList = [];
  kecepatanBintang = 2;
  timerBintang = 0;
  jedaBintang = 60;
  keranjang.x = 170;
  gameAktif = true;

  elemenSkor.textContent = "Skor: 0";
  elemenNyawa.textContent = "Nyawa: 3";
  layarGameover.classList.add("tersembunyi");

  gameLoop();
}


// ================================
// BAGIAN 9: INPUT PEMAIN (KEYBOARD)
// ================================

document.addEventListener("keydown", function(e) {
  if (e.key === "ArrowLeft") tombolKiri = true;
  if (e.key === "ArrowRight") tombolKanan = true;
});

document.addEventListener("keyup", function(e) {
  if (e.key === "ArrowLeft") tombolKiri = false;
  if (e.key === "ArrowRight") tombolKanan = false;
});


// ================================
// BAGIAN 10: INPUT PEMAIN (SENTUHAN HP)
// ================================

kanvas.addEventListener("touchstart", function(e) {
  e.preventDefault();
  let sentuhan = e.touches[0];
  let posX = sentuhan.clientX - kanvas.getBoundingClientRect().left;

  if (posX < kanvas.width / 2) {
    tombolKiri = true;
  } else {
    tombolKanan = true;
  }
});

kanvas.addEventListener("touchend", function(e) {
  e.preventDefault();
  tombolKiri = false;
  tombolKanan = false;
});


// ================================
// BAGIAN 11: TOMBOL MAIN LAGI
// ================================

tombolMainLagi.addEventListener("click", mulaiUlang);


// ================================
// BAGIAN 12: MULAI GAME
// ================================

gameLoop();
