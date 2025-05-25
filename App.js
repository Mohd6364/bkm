
export default function App() {
  const root = document.getElementById('root');
  let items = JSON.parse(localStorage.getItem("maqadi-items") || "[]");
  let budget = parseFloat(localStorage.getItem("maqadi-budget") || "100");
  let recognition, recognizing = false;

  function render() {
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    root.innerHTML = \`
      <h2>مقاضي البيت – من بكم</h2>
      <div class="row">
        <input id="name" placeholder="اسم المنتج..." />
        <input id="price" type="number" placeholder="السعر" style="width: 80px" />
        <input id="qty" type="number" placeholder="الكمية" style="width: 80px" />
        <button onclick="window.addItem()">إضافة</button>
        <button onclick="window.toggleMic()">🎤</button>
      </div>
      <div class="row">
        <label>💰 الميزانية:</label>
        <input id="budgetInput" type="number" value="\${budget}" style="width:100px" onchange="window.updateBudget(this.value)" />
      </div>
      <ul id="list"></ul>
      <div class="budget-info">📊 الإجمالي: \${total.toFixed(2)} ريال</div>
      <div class="budget-info" style="color:\${total > budget ? 'red' : 'green'}">⚖️ الفرق: \${(budget - total).toFixed(2)} ريال</div>
    \`;
    document.getElementById("name").focus();
    renderList();
  }

  function renderList() {
    const ul = document.getElementById("list");
    ul.innerHTML = items.map((item, i) => \`
      <li>
        <div class="row">
          <strong>\${item.name}</strong>
          <button onclick="window.removeItem(\${i})">❌</button>
        </div>
        <div class="row">
          <label>سعر:</label>
          <input type="number" value="\${item.price}" onchange="window.editItem(\${i}, 'price', this.value)" style="width:80px" />
          <label>كمية:</label>
          <input type="number" value="\${item.qty}" onchange="window.editItem(\${i}, 'qty', this.value)" style="width:80px" />
          <span>= \${(item.price * item.qty).toFixed(2)} ريال</span>
        </div>
      </li>
    \`).join("");
    localStorage.setItem("maqadi-items", JSON.stringify(items));
  }

  window.addItem = () => {
    const name = document.getElementById("name").value.trim();
    const price = parseFloat(document.getElementById("price").value) || 0;
    const qty = parseFloat(document.getElementById("qty").value) || 1;
    if (!name) return;
    items.push({ name, price, qty });
    render();
  };

  window.removeItem = (index) => {
    items.splice(index, 1);
    render();
  };

  window.editItem = (index, key, value) => {
    items[index][key] = parseFloat(value) || 0;
    render();
  };

  window.updateBudget = (val) => {
    budget = parseFloat(val) || 0;
    localStorage.setItem("maqadi-budget", budget);
    render();
  };

  window.toggleMic = () => {
    if (!("webkitSpeechRecognition" in window)) return alert("المتصفح لا يدعم الإدخال الصوتي");
    if (!recognition) {
      recognition = new webkitSpeechRecognition();
      recognition.lang = "ar-SA";
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.onresult = (event) => {
        document.getElementById("name").value = event.results[0][0].transcript;
      };
    }
    if (recognizing) {
      recognition.stop();
    } else {
      recognition.start();
    }
    recognizing = !recognizing;
  };

  render();
}
