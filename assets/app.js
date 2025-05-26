
let items = [];
let budget = 100;
let recognition;
let recognizing = false;

function toggleMic() {
  if (!('webkitSpeechRecognition' in window)) {
    return alert('المتصفح لا يدعم التعرف على الصوت');
  }
  if (!recognition) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = 'ar-SA';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (e) => {
      document.getElementById('itemName').value = e.results[0][0].transcript;
    };
  }
  if (recognizing) {
    recognition.stop();
  } else {
    recognition.start();
  }
  recognizing = !recognizing;
}

function render() {
  const list = document.getElementById("itemsList");
  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  document.getElementById("total").innerText = total.toFixed(2);
  document.getElementById("diff").innerText = (budget - total).toFixed(2);
  list.innerHTML = "";
  items.forEach((item, index) => {
    const li = document.createElement("li");
    li.innerHTML = \`
      <strong>\${item.name}</strong> - 
      السعر: <input type="number" value="\${item.price}" onchange="editItem(\${index}, 'price', this.value)" />
      الكمية: <input type="number" value="\${item.qty}" onchange="editItem(\${index}, 'qty', this.value)" />
      <button onclick="removeItem(\${index})">🗑️</button>
      <button onclick="toggleMic()">🎤</button>
    \`;
    list.appendChild(li);
  });
}

function addItem() {
  const name = document.getElementById("itemName").value.trim();
  const price = parseFloat(document.getElementById("itemPrice").value) || 0;
  const qty = parseInt(document.getElementById("itemQty").value) || 1;
  if (!name) return;
  items.push({ name, price, qty });
  document.getElementById("itemName").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemQty").value = 1;
  render();
}

function removeItem(index) {
  items.splice(index, 1);
  render();
}

function editItem(index, key, value) {
  items[index][key] = parseFloat(value) || 0;
  render();
}

function updateBudget() {
  budget = parseFloat(document.getElementById("budget").value) || 0;
  render();
}

window.onload = render;
