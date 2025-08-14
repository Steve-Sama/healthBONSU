document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("patientForm");
  const tableBody = document.querySelector("#patientTable tbody");
  const submitButton = form.querySelector("button");
  const tableSection = document.querySelector(".patient-records");

  let editingRow = null;
  let db;

  // ================== IndexedDB Setup ==================
  const request = indexedDB.open("PatientDB", 1);

  request.onerror = () => console.error("Database failed to open");
  request.onsuccess = () => {
    db = request.result;
    loadData();
  };

  request.onupgradeneeded = (e) => {
    db = e.target.result;
    db.createObjectStore("patients", { keyPath: "regNumber" });
  };

  function saveToDB(data) {
    const tx = db.transaction("patients", "readwrite");
    const store = tx.objectStore("patients");
    store.put(data);
    tx.oncomplete = () => loadData();
  }

  function deleteFromDB(key) {
    const confirmDelete = confirm("Are you sure you want to delete this patient's record?");
    if (!confirmDelete) return;

    const tx = db.transaction("patients", "readwrite");
    const store = tx.objectStore("patients");
    store.delete(key);
    tx.oncomplete = () => loadData();
  }

  function loadData() {
    tableBody.innerHTML = "";
    const tx = db.transaction("patients", "readonly");
    const store = tx.objectStore("patients");
    const request = store.openCursor();

    request.onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        addRow(cursor.value);
        cursor.continue();
      }
    };
  }

  // ================== Form Logic ==================
  function getFormData() {
    return {
      regNumber: document.getElementById("regNumber").value.trim(),
      fullName: document.getElementById("fullName").value.trim(),
      dob: document.getElementById("dob").value,
      gender: document.getElementById("gender").value.trim(),
      maritalStatus: document.getElementById("maritalStatus").value,
      nhisId: document.getElementById("nhisId").value.trim(),
      occupation: document.getElementById("occupation").value.trim(),
      religion: document.getElementById("religion").value.trim(),
      address: document.getElementById("address").value.trim(),
      relativeName: document.getElementById("relativeName").value.trim(),
      contact: document.getElementById("contact").value.trim(),
      condition: document.getElementById("condition").value.trim(),
    };
  }

  function clearForm() {
    form.reset();
    editingRow = null;
    document.getElementById("regNumber").disabled = false;
    submitButton.textContent = "Add Patient";
  }

  function addRow(data) {
    const row = document.createElement("tr");

    Object.values(data).forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });

    const actionsCell = document.createElement("td");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });

      document.getElementById("regNumber").value = data.regNumber;
      document.getElementById("regNumber").disabled = true;
      document.getElementById("fullName").value = data.fullName;
      document.getElementById("dob").value = data.dob;
      document.getElementById("maritalStatus").value = data.maritalStatus;
      document.getElementById("nhisId").value = data.nhisId;
      document.getElementById("occupation").value = data.occupation;
      document.getElementById("religion").value = data.religion;
      document.getElementById("address").value = data.address;
      document.getElementById("relativeName").value = data.relativeName;
      document.getElementById("contact").value = data.contact;
      document.getElementById("condition").value = data.condition;

      editingRow = data.regNumber;
      submitButton.textContent = "Update Patient";
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.onclick = () => {
      deleteFromDB(data.regNumber);
    };

    actionsCell.appendChild(editBtn);
    actionsCell.appendChild(deleteBtn);
    row.appendChild(actionsCell);

    tableBody.appendChild(row);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // Make sure regNumber field is enabled before reading its value
    document.getElementById("regNumber").disabled = false;

    const data = getFormData();

    if (!data.regNumber || !data.fullName) {
      alert("Registration number and full name are required.");
      return;
    }

    if (editingRow && editingRow !== data.regNumber) {
      deleteFromDB(editingRow);
    }

    saveToDB(data);
    clearForm();
  });

  // ================== Control Panel (Search + Download) ==================
  if (!document.querySelector(".control-panel")) {
    const controlPanel = document.createElement("div");
    controlPanel.className = "control-panel";
    controlPanel.style.margin = "20px 0";
    controlPanel.style.display = "flex";
    controlPanel.style.flexWrap = "wrap";
    controlPanel.style.gap = "10px";

    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.placeholder = "Search by Name";

    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "Download Excel";

    controlPanel.appendChild(searchInput);
    controlPanel.appendChild(downloadBtn);
    tableSection.insertBefore(controlPanel, tableSection.firstChild);

    // Search
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      Array.from(tableBody.rows).forEach(row => {
        const name = row.cells[1].textContent.toLowerCase();
        row.style.display = name.includes(searchTerm) ? "" : "none";
      });
    });

    // Download Excel
    downloadBtn.addEventListener("click", () => {
      const rows = [[...document.querySelectorAll("#patientTable thead th")]
        .filter(th => th.textContent !== "Actions")
        .map(th => th.textContent)];

      Array.from(tableBody.rows).forEach(row => {
        const rowData = Array.from(row.cells).slice(0, -1).map(cell => cell.textContent);
        rows.push(rowData);
      });

      const csvContent = rows.map(e => e.map(f => `"${f}"`).join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "patients_records.csv";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // ================== Weekly Reminder Timer ==================
  const oneWeek = 7 * 24 * 60 * 60 * 1000;
  const lastPrompt = localStorage.getItem("lastUpdatePrompt");
  if (!lastPrompt || (Date.now() - parseInt(lastPrompt)) > oneWeek) {
    alert("🔔 Weekly Reminder: Please ensure your data is backed up if necessary.");
    localStorage.setItem("lastUpdatePrompt", Date.now().toString());
  }
});
