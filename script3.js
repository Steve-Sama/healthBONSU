// IndexedDB setup
let db;
const request = indexedDB.open("DrugDB", 1);

request.onupgradeneeded = function (event) {
  db = event.target.result;
  const store = db.createObjectStore("drugs", { keyPath: "id", autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;
  renderTable();
};

request.onerror = function (event) {
  console.error("IndexedDB error:", event.target.error);
};

const drugForm = document.getElementById("drugForm");
const drugTableBody = document.querySelector("#drugTable tbody");
const drugSearch = document.getElementById("drugSearch");
const filterStatus = document.getElementById("filterStatus");
const filterType = document.getElementById("filterType");
const submitButton = drugForm.querySelector("button[type='submit']");

let editId = null;

drugForm.addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("drugName").value.trim();
  const quantity = document.getElementById("quantity").value;
  const type = document.getElementById("type").value;
  const status = document.getElementById("status").value;

  if (!name || !quantity || !type || !status) return;

  const drug = { name, quantity, type, status };

  const tx = db.transaction("drugs", "readwrite");
  const store = tx.objectStore("drugs");

  if (editId === null) {
    store.add(drug);
  } else {
    drug.id = editId;
    store.put(drug);
    editId = null;
    submitButton.textContent = "Add Drug";
  }

  tx.oncomplete = function () {
    drugForm.reset();
    renderTable();
  };
});

function renderTable() {
  const tx = db.transaction("drugs", "readonly");
  const store = tx.objectStore("drugs");
  const request = store.getAll();

  request.onsuccess = function () {
    const searchTerm = drugSearch.value.toLowerCase();
    const statusFilter = filterStatus.value;
    const typeFilter = filterType.value;

    const filtered = request.result.filter(drug =>
      drug.name.toLowerCase().includes(searchTerm) &&
      (statusFilter === "" || drug.status === statusFilter) &&
      (typeFilter === "" || drug.type === typeFilter)
    );

    drugTableBody.innerHTML = "";

    if (filtered.length === 0) {
      drugTableBody.innerHTML = `<tr><td colspan="5">No drugs found</td></tr>`;
      return;
    }

    filtered.forEach(drug => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${drug.name}</td>
        <td>${drug.quantity}</td>
        <td>${drug.type}</td>
        <td>${drug.status}</td>
        <td>
          <button class="edit-btn" data-id="${drug.id}">Edit</button>
          <button class="delete-btn" data-id="${drug.id}">Delete</button>
        </td>
      `;
      drugTableBody.appendChild(row);
    });

    document.querySelectorAll(".delete-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = Number(this.dataset.id);
        if (confirm("Are you sure you want to delete this drug?")) {
          const tx = db.transaction("drugs", "readwrite");
          tx.objectStore("drugs").delete(id);
          tx.oncomplete = renderTable;
        }
      });
    });

    document.querySelectorAll(".edit-btn").forEach(btn => {
      btn.addEventListener("click", function () {
        const id = Number(this.dataset.id);
        const tx = db.transaction("drugs", "readonly");
        const store = tx.objectStore("drugs");
        const getRequest = store.get(id);
        getRequest.onsuccess = function () {
          const drug = getRequest.result;
          document.getElementById("drugName").value = drug.name;
          document.getElementById("quantity").value = drug.quantity;
          document.getElementById("type").value = drug.type;
          document.getElementById("status").value = drug.status;
          editId = id;
          submitButton.textContent = "Update Drug";
        };
      });
    });
  };
}

drugSearch.addEventListener("input", renderTable);
filterStatus.addEventListener("change", renderTable);
filterType.addEventListener("change", renderTable);
