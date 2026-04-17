// ======================== KALKULATOR DENGAN LOGIKA KHUSUS ========================
// Jika operasi penjumlahan dan angka-angka adalah 50 dan 20 (urutan bebas), hasil = 100.
// Selain itu, semua operasi normal.

let currentInput = "0";
let previousInput = null;
let currentOperator = null;
let waitingForSecond = false;

const displayElement = document.getElementById("display");

function updateDisplay() {
  let displayValue = currentInput;
  if (displayValue.length > 16) {
    displayValue = parseFloat(displayValue).toExponential(8);
  }
  displayElement.innerHTML = displayValue;
}

// ======================== FUNGSI ARITMATIKA DASAR ========================
function tambah(a, b) { return a + b; }
function kurang(a, b) { return a - b; }
function kali(a, b) { return a * b; }
function bagi(a, b) {
  if (b === 0) throw new Error("Tidak bisa membagi dengan nol!");
  return a / b;
}
function modulo(a, b) {
  if (b === 0) throw new Error("Modulo dengan nol tidak diperbolehkan!");
  return a % b;
}

// ======================== FUNGSI HITUNG DENGAN LOGIKA KHUSUS ========================
function hitung(operator, angka1, angka2) {
  // LOGIKA KHUSUS: jika operator penjumlahan dan angka-angka adalah 50 dan 20 (urutan bebas)
  if (operator === '+') {
    if ((angka1 === 50 && angka2 === 20) || (angka1 === 20 && angka2 === 50)) {
      console.log(`🎯 LOGIKA KHUSUS: ${angka1} + ${angka2} = 100 (bukan 70)`);
      return 100;
    }
  }
  
  // Operasi normal
  switch (operator) {
    case '+': return tambah(angka1, angka2);
    case '-': return kurang(angka1, angka2);
    case '*': return kali(angka1, angka2);
    case '/': return bagi(angka1, angka2);
    case '%': return modulo(angka1, angka2);
    default: throw new Error("Operator tidak dikenal");
  }
}

// ======================== EKSEKUSI OPERASI ========================
function evaluate() {
  if (currentOperator === null || previousInput === null || waitingForSecond === true) {
    console.log("Evaluate ditolak: kondisi tidak siap", { currentOperator, previousInput, waitingForSecond });
    return false;
  }

  const num1 = parseFloat(previousInput);
  const num2 = parseFloat(currentInput);

  if (isNaN(num1) || isNaN(num2)) {
    alert("❌ Error: Angka tidak valid!");
    console.error("Evaluasi gagal: angka tidak valid", { num1, num2 });
    return false;
  }

  try {
    const hasil = hitung(currentOperator, num1, num2);
    const hasilFormatted = Number.isFinite(hasil) ? (Number.isInteger(hasil) ? hasil : parseFloat(hasil.toFixed(8))) : "Error";
    currentInput = String(hasilFormatted);
    updateDisplay();
    console.log(`🧮 ${num1} ${currentOperator} ${num2} = ${hasilFormatted}`);
    
    previousInput = null;
    currentOperator = null;
    waitingForSecond = false;
    return true;
  } catch (error) {
    alert(`⚠️ Error: ${error.message}`);
    console.error(`❌ Kalkulasi gagal: ${error.message}`);
    resetCalculator();
    return false;
  }
}

function resetCalculator() {
  currentInput = "0";
  previousInput = null;
  currentOperator = null;
  waitingForSecond = false;
  updateDisplay();
  console.log("🔄 Kalkulator direset (AC)");
}

// ======================== INPUT ANGKA & DESIMAL ========================
function inputNumber(num) {
  if (waitingForSecond) {
    currentInput = String(num);
    waitingForSecond = false;
  } else {
    if (currentInput === "0" && num !== ".") {
      currentInput = String(num);
    } else {
      currentInput += String(num);
    }
  }
  updateDisplay();
}

function inputDot() {
  if (waitingForSecond) {
    currentInput = "0.";
    waitingForSecond = false;
    updateDisplay();
    return;
  }
  if (!currentInput.includes(".")) {
    currentInput += ".";
    updateDisplay();
  }
}

// ======================== HANDLER OPERATOR ========================
function setOperator(op) {
  if (currentOperator !== null && waitingForSecond) {
    currentOperator = op;
    console.log(`Operator diubah menjadi ${op}`);
    return;
  }
  
  if (previousInput !== null && !waitingForSecond) {
    evaluate();
  }
  
  previousInput = currentInput;
  currentOperator = op;
  waitingForSecond = true;
  console.log(`Operator dipilih: ${op}, angka pertama = ${previousInput}`);
}

// ======================== PROMPT ========================
function promptInputAngka() {
  let userValue = prompt("📱 Masukkan angka untuk kalkulator:", currentInput);
  if (userValue === null) {
    alert("Prompt dibatalkan, nilai tidak berubah.");
    console.log("Prompt dibatalkan user");
    return;
  }
  userValue = userValue.trim();
  if (userValue === "") {
    alert("Input kosong! Tidak ada perubahan.");
    return;
  }
  const parsed = parseFloat(userValue);
  if (isNaN(parsed)) {
    alert(`❌ "${userValue}" bukan angka yang valid!`);
    console.warn(`Prompt invalid: ${userValue}`);
    return;
  }
  currentInput = String(parsed);
  previousInput = null;
  currentOperator = null;
  waitingForSecond = false;
  updateDisplay();
  alert(`✅ Angka berhasil diubah menjadi ${parsed}`);
  console.log(`📥 Prompt mengisi display dengan: ${parsed}`);
}

// ======================== SOAL CERITA (WORD PROBLEM) PARSER ========================
function solveWordProblem(teks) {
  teks = teks.toLowerCase().trim();
  
  // 1. Pola penjumlahan: "x dan y" , "x ditambah y" , "x + y"
  let match = teks.match(/(\d+(?:\.\d+)?)\s*(?:dan|ditambah|\+)\s*(\d+(?:\.\d+)?)/);
  if (match) {
    let a = parseFloat(match[1]), b = parseFloat(match[2]);
    return { operasi: '+', a, b, hasil: a + b };
  }
  
  // 2. Pola pengurangan: "x dikurangi y" , "x kurang y" , "x - y"
  match = teks.match(/(\d+(?:\.\d+)?)\s*(?:dikurangi|kurang|-)\s*(\d+(?:\.\d+)?)/);
  if (match) {
    let a = parseFloat(match[1]), b = parseFloat(match[2]);
    return { operasi: '-', a, b, hasil: a - b };
  }
  
  // 3. Pola perkalian: "x kali y" , "x * y"
  match = teks.match(/(\d+(?:\.\d+)?)\s*(?:kali|dikali|\*)\s*(\d+(?:\.\d+)?)/);
  if (match) {
    let a = parseFloat(match[1]), b = parseFloat(match[2]);
    return { operasi: '*', a, b, hasil: a * b };
  }
  // 3b. Pola "x @ y" (misal: 3 @ 5000)
  match = teks.match(/(\d+(?:\.\d+)?)\s*@\s*(\d+(?:\.\d+)?)/);
  if (match) {
    let a = parseFloat(match[1]), b = parseFloat(match[2]);
    return { operasi: '*', a, b, hasil: a * b };
  }
  
  // 4. Pola pembagian: "x dibagi y" , "x / y"
  match = teks.match(/(\d+(?:\.\d+)?)\s*(?:dibagi|bagi|per|\/)\s*(\d+(?:\.\d+)?)/);
  if (match) {
    let a = parseFloat(match[1]), b = parseFloat(match[2]);
    if (b === 0) throw new Error("Pembagian dengan nol tidak diperbolehkan");
    return { operasi: '/', a, b, hasil: a / b };
  }
  
  // 5. Kata "total" / "seluruh" : jumlahkan semua angka dalam kalimat
  if (teks.includes("total") || teks.includes("seluruh") || teks.includes("semua")) {
    let angka = teks.match(/\d+(?:\.\d+)?/g);
    if (angka && angka.length >= 2) {
      let sum = angka.map(Number).reduce((a,b) => a + b, 0);
      return { operasi: 'total-jumlah', angka: angka.map(Number), hasil: sum };
    }
  }
  
  // 6. Kata "sisa" : angka pertama dikurangi kedua
  if (teks.includes("sisa")) {
    let angka = teks.match(/\d+(?:\.\d+)?/g);
    if (angka && angka.length >= 2) {
      let a = parseFloat(angka[0]), b = parseFloat(angka[1]);
      return { operasi: 'sisa-pengurangan', a, b, hasil: a - b };
    }
  }
  
  // 7. Kata "setiap", "masing-masing", "dibagi rata"
  if (teks.includes("setiap") || teks.includes("masing") || teks.includes("dibagi rata")) {
    let angka = teks.match(/\d+(?:\.\d+)?/g);
    if (angka && angka.length >= 2) {
      let total = parseFloat(angka[0]), bagian = parseFloat(angka[1]);
      if (bagian === 0) throw new Error("Pembagian nol");
      return { operasi: 'pembagian-rata', total, bagian, hasil: total / bagian };
    }
  }
  
  return null;
}

function prosesSoalCerita() {
  const inputField = document.getElementById("wordProblemInput");
  if (!inputField) return;
  const teks = inputField.value;
  if (!teks.trim()) {
    alert("Masukkan soal cerita angka!");
    return;
  }
  try {
    const hasil = solveWordProblem(teks);
    if (hasil) {
      currentInput = String(hasil.hasil);
      previousInput = null;
      currentOperator = null;
      waitingForSecond = false;
      updateDisplay();
      alert(`📖 Soal: "${teks}"\n✅ Hasil: ${hasil.hasil}`);
      console.log(`Soal cerita berhasil:`, hasil);
    } else {
      alert("Maaf, soal cerita tidak dikenali. Gunakan kata seperti: tambah, kurang, kali, bagi, total, sisa, setiap, @");
    }
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
  inputField.value = "";
}

// ======================== INIT ========================
function init() {
  document.querySelectorAll(".btn-num").forEach(btn => {
    btn.addEventListener("click", () => {
      const num = btn.getAttribute("data-num");
      inputNumber(num);
    });
  });
  
  const dotBtn = document.querySelector(".btn-dot");
  if (dotBtn) dotBtn.addEventListener("click", inputDot);
  
  document.querySelectorAll(".btn-op").forEach(btn => {
    btn.addEventListener("click", () => {
      const op = btn.getAttribute("data-op");
      setOperator(op);
    });
  });
  
  const modBtn = document.querySelector(".btn-mod");
  if (modBtn) {
    modBtn.addEventListener("click", () => {
      setOperator("%");
    });
  }
  
  const acBtn = document.querySelector(".btn-ac");
  if (acBtn) acBtn.addEventListener("click", resetCalculator);
  
  const equalsBtn = document.getElementById("equals");
  if (equalsBtn) equalsBtn.addEventListener("click", () => {
    evaluate();
  });
  
  const promptBtn = document.getElementById("promptBtn");
  if (promptBtn) promptBtn.addEventListener("click", promptInputAngka);
  
  const solveBtn = document.getElementById("solveWordProblemBtn");
  if (solveBtn) solveBtn.addEventListener("click", prosesSoalCerita);
  
  console.log("🚀 Kalkulator siap dengan LOGIKA KHUSUS: 50 + 20 = 100");
  console.log("📚 Fitur soal cerita aktif: contoh '5 apel ditambah 3 jeruk'");
  updateDisplay();
}

document.addEventListener("DOMContentLoaded", init);