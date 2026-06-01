let mahasiswa = [];
let editIndex = -1;

function tambahMahasiswa() {
  const nim = document.getElementById("nim").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const jurusan = document.getElementById("jurusan").value;
  const fakultas = document.getElementById("fakultas").value;

  if (!nim || !nama || !jurusan || !fakultas) {
    showToast("⚠️ Semua field wajib diisi!", "error");
    return;
  }
  if (mahasiswa.some((m) => m.nim === nim)) {
    showToast("❌ NIM sudah terdaftar!", "error");
    return;
  }

  mahasiswa.push({ nim, nama, jurusan, fakultas });
  renderTable();
  resetForm();
  showToast(`✅ ${nama} berhasil ditambahkan!`, "success");
}

function editMahasiswa(index) {
  const m = mahasiswa[index];
  document.getElementById("nim").value = m.nim;
  document.getElementById("nama").value = m.nama;
  document.getElementById("jurusan").value = m.jurusan;
  document.getElementById("fakultas").value = m.fakultas;

  editIndex = index;
  document.getElementById("edit-badge").style.display = "flex";
  document.getElementById("nim").focus();
  showToast("🔧 Mode edit aktif — ubah data lalu klik Update", "info");
}

function updateMahasiswa() {
  if (editIndex === -1) {
    showToast("ℹ️ Pilih data yang ingin diedit terlebih dahulu", "error");
    return;
  }

  const nim = document.getElementById("nim").value.trim();
  const nama = document.getElementById("nama").value.trim();
  const jurusan = document.getElementById("jurusan").value;
  const fakultas = document.getElementById("fakultas").value;

  if (!nim || !nama || !jurusan || !fakultas) {
    showToast("⚠️ Semua field wajib diisi!", "error");
    return;
  }
  if (mahasiswa.some((m, i) => m.nim === nim && i !== editIndex)) {
    showToast("❌ NIM sudah digunakan mahasiswa lain!", "error");
    return;
  }

  mahasiswa[editIndex] = { nim, nama, jurusan, fakultas };
  renderTable();
  resetForm();
  showToast(`✅ Data berhasil diperbarui!`, "success");
}

function hapusMahasiswa(index) {
  const nama = mahasiswa[index].nama;
  if (!confirm(`Hapus data "${nama}"?`)) return;

  mahasiswa.splice(index, 1);
  if (editIndex === index) resetForm();
  else if (editIndex > index) editIndex--;

  renderTable();
  showToast(`🗑️ Data ${nama} dihapus`, "success");
}

function resetForm() {
  document.getElementById("nim").value = "";
  document.getElementById("nama").value = "";
  document.getElementById("jurusan").value = "";
  document.getElementById("fakultas").value = "";
  editIndex = -1;
  document.getElementById("edit-badge").style.display = "none";
}

function renderTable() {
  const tbody = document.getElementById("table-body");
  const emptyState = document.getElementById("empty-state");
  const statsRow = document.getElementById("stats-row");

  tbody.innerHTML = "";

  if (mahasiswa.length === 0) {
    emptyState.style.display = "block";
    statsRow.innerHTML = "";
    return;
  }

  emptyState.style.display = "none";

  const jurusanCount = {};
  mahasiswa.forEach((m) => {
    jurusanCount[m.jurusan] = (jurusanCount[m.jurusan] || 0) + 1;
  });

  let statsHTML = `<div class="stat-chip">👥 Total: <strong>${mahasiswa.length}</strong></div>`;
  for (const [j, c] of Object.entries(jurusanCount)) {
    statsHTML += `<div class="stat-chip">${j}: <strong>${c}</strong></div>`;
  }
  statsRow.innerHTML = statsHTML;

  mahasiswa.forEach((m, i) => {
    const tr = document.createElement("tr");
    tr.className = "row-new";
    tr.innerHTML = `
      <td style="color:var(--text-muted);font-size:0.8rem;">${i + 1}</td>
      <td class="nim-cell">${m.nim}</td>
      <td>${m.nama}</td>
      <td><span class="jurusan-badge">${m.jurusan}</span></td>
      <td><span class="fakultas-badge">${m.fakultas}</span></td>
      <td class="aksi-cell">
        <button class="btn-sm btn-edit" onclick="editMahasiswa(${i})">✏️ Edit</button>
        <button class="btn-sm btn-hapus" onclick="hapusMahasiswa(${i})">🗑️ Hapus</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  console.log("Array mahasiswa saat ini:", mahasiswa);
}

function showToast(msg, type = "success") {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.className = `show ${type}`;
  setTimeout(() => {
    t.className = "";
  }, 2800);
}

// Jalankan fungsi awal untuk merender tabel kosong saat halaman dimuat
renderTable();
