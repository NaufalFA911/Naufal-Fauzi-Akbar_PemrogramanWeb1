let currentModule = "mahasiswa";
let mModal;

document.addEventListener("DOMContentLoaded", () => {
  mModal = new bootstrap.Modal(document.getElementById("modalGlobal"));
  loadData(currentModule);
});

function switchModule(moduleName) {
  currentModule = moduleName;
  loadData(currentModule);
}

// FUNGSI MENAMPILKAN DATA
function loadData(module) {
  fetch(`api.php?module=${module}&action=list`)
    .then((res) => res.json())
    .then((data) => {
      let html = "";
      const tbody = document.getElementById(`tempat-data-${module}`);

      if (data.length === 0) {
        let colSpan = module === "jadwal" ? 7 : module === "mahasiswa" ? 6 : 4;
        html = `<tr><td colspan="${colSpan}" class="text-center text-muted p-4">Belum ada data.</td></tr>`;
      } else {
        data.forEach((row, index) => {
          if (module === "mahasiswa") {
            html += `<tr>
                            <td class="ps-3 align-middle">${index + 1}</td>
                            <td class="align-middle">${row.nim}</td>
                            <td class="align-middle">${row.nama}</td>
                            <td class="align-middle">${row.jurusan}</td>
                            <td class="align-middle">${row.email}</td>
                            <td class="text-center align-middle">
                                <button class="btn btn-warning btn-sm fw-bold me-1" onclick="siapkanForm('mahasiswa', 'edit', ${row.id})">Edit</button>
                                <button class="btn btn-danger btn-sm fw-bold" onclick="hapusDataGlobal('mahasiswa', ${row.id})">Hapus</button>
                            </td>
                        </tr>`;
          } else if (module === "dosen") {
            html += `<tr>
                            <td class="ps-3 align-middle">${index + 1}</td>
                            <td class="align-middle fw-bold text-secondary">${row.nama}</td>
                            <td class="align-middle">${row.alamat}</td>
                            <td class="text-center align-middle">
                                <button class="btn btn-warning btn-sm fw-bold me-1" onclick="siapkanForm('dosen', 'edit', ${row.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusDataGlobal('dosen', ${row.id})">Hapus</button>
                            </td>
                        </tr>`;
          } else if (module === "matkul") {
            html += `<tr>
                            <td class="ps-3 align-middle">${index + 1}</td>
                            <td class="align-middle">${row.matkul}</td>
                            <td class="align-middle"><span class="badge bg-info text-dark fw-bold">${row.sks} SKS</span></td>
                            <td class="text-center align-middle">
                                <button class="btn btn-warning btn-sm fw-bold me-1" onclick="siapkanForm('matkul', 'edit', ${row.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusDataGlobal('matkul', ${row.id})">Hapus</button>
                            </td>
                        </tr>`;
          } else if (module === "jadwal") {
            html += `<tr>
                            <td class="ps-3 align-middle">${index + 1}</td>
                            <td class="align-middle"><strong>${row.nama_matkul}</strong></td>
                            <td class="align-middle">${row.sks} SKS</td>
                            <td class="align-middle text-primary">${row.nama_dosen}</td>
                            <td class="align-middle">${row.waktu}</td>
                            <td class="align-middle"><span class="badge bg-secondary">${row.ruang}</span></td>
                            <td class="text-center align-middle">
                                <button class="btn btn-warning btn-sm fw-bold me-1" onclick="siapkanForm('jadwal', 'edit', ${row.id})">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="hapusDataGlobal('jadwal', ${row.id})">Hapus</button>
                            </td>
                        </tr>`;
          }
        });
      }
      tbody.innerHTML = html;
    });
}

// FUNGSI GENERATOR FORM MODAL
function siapkanForm(module, type, id = null) {
  const title = document.getElementById("modalTitle");
  const container = document.getElementById("modalFormBody");

  let label =
    module === "matkul"
      ? "Matakuliah"
      : module.charAt(0).toUpperCase() + module.slice(1);
  title.innerText = (type === "tambah" ? "Tambah " : "Ubah ") + label;

  let formHTML = `<input type="hidden" id="global_id" name="id">`;

  if (module === "mahasiswa") {
    formHTML += `
            <div class="mb-3"><label class="form-label fw-bold">NIM</label><input type="text" class="form-control" name="nim" id="nim" required autocomplete="off"></div>
            <div class="mb-3"><label class="form-label">Nama Lengkap</label><input type="text" class="form-control" name="nama" id="nama" required autocomplete="off"></div>
            <div class="mb-3"><label class="form-label">Jurusan</label><input type="text" class="form-control" name="jurusan" id="jurusan" required autocomplete="off"></div>
            <div class="mb-3"><label class="form-label">Email</label><input type="email" class="form-control" name="email" id="email" required autocomplete="off"></div>`;
    container.innerHTML = formHTML;
    mModal.show();
    if (type === "edit") isiDataLama(module, id);
  } else if (module === "dosen") {
    formHTML += `
            <div class="mb-3"><label class="form-label fw-bold">Nama Dosen</label><input type="text" class="form-control" name="nama" id="nama" required autocomplete="off"></div>
            <div class="mb-3"><label class="form-label">Alamat Lengkap</label><textarea class="form-control" name="alamat" id="alamat" rows="3" required></textarea></div>`;
    container.innerHTML = formHTML;
    mModal.show();
    if (type === "edit") isiDataLama(module, id);
  } else if (module === "matkul") {
    formHTML += `
            <div class="mb-3"><label class="form-label fw-bold">Nama Mata Kuliah</label><input type="text" class="form-control" name="matkul" id="matkul" required autocomplete="off"></div>
            <div class="mb-3"><label class="form-label">Jumlah SKS</label><input type="number" class="form-control" name="sks" id="sks" min="1" max="6" required></div>`;
    container.innerHTML = formHTML;
    mModal.show();
    if (type === "edit") isiDataLama(module, id);
  } else if (module === "jadwal") {
    fetch("api.php?action=get_options")
      .then((res) => res.json())
      .then((opt) => {
        let optDosen = '<option value="">-- Pilih Dosen --</option>';
        opt.dosen.forEach((d) => {
          optDosen += `<option value="${d.id}">${d.nama}</option>`;
        });
        let optMatkul = '<option value="">-- Pilih Matakuliah --</option>';
        opt.matkul.forEach((m) => {
          optMatkul += `<option value="${m.id}">${m.matkul}</option>`;
        });

        formHTML += `
                    <div class="mb-3"><label class="form-label fw-bold">Mata Kuliah</label><select class="form-select" name="id_matkul" id="id_matkul" required>${optMatkul}</select></div>
                    <div class="mb-3"><label class="form-label fw-bold">Dosen Pengampu</label><select class="form-select" name="id_dosen" id="id_dosen" required>${optDosen}</select></div>
                    <div class="mb-3"><label class="form-label">Waktu</label><input type="text" class="form-control" name="waktu" id="waktu" placeholder="Contoh: Senin, 08:00 - 10:00" required autocomplete="off"></div>
                    <div class="mb-3"><label class="form-label">Ruang Kelas</label><input type="text" class="form-control" name="ruang" id="ruang" placeholder="Contoh: Lab 03" required autocomplete="off"></div>`;
        container.innerHTML = formHTML;
        mModal.show();
        if (type === "edit") isiDataLama(module, id);
      });
  }
}

function isiDataLama(module, id) {
  fetch(`api.php?module=${module}&action=get_single&id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      document.getElementById("global_id").value = data.id;
      if (module === "mahasiswa") {
        document.getElementById("nim").value = data.nim;
        document.getElementById("nama").value = data.nama;
        document.getElementById("jurusan").value = data.jurusan;
        document.getElementById("email").value = data.email;
      } else if (module === "dosen") {
        document.getElementById("nama").value = data.nama;
        document.getElementById("alamat").value = data.alamat;
      } else if (module === "matkul") {
        document.getElementById("matkul").value = data.matkul;
        document.getElementById("sks").value = data.sks;
      } else if (module === "jadwal") {
        document.getElementById("id_matkul").value = data.id_matkul;
        document.getElementById("id_dosen").value = data.id_dosen;
        document.getElementById("waktu").value = data.waktu;
        document.getElementById("ruang").value = data.ruang;
      }
    });
}

// FUNGSI SIMPAN (CREATE / UPDATE)
function simpanDataGlobal(event) {
  event.preventDefault();
  const form = document.getElementById("formGlobal");
  const formData = new FormData(form);

  fetch(`api.php?module=${currentModule}&action=save`, {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.status === "success") {
        alert("Data berhasil disimpan!");
        mModal.hide();
        loadData(currentModule);
      } else {
        alert("Gagal menyimpan: " + res.message);
      }
    });
}

// FUNGSI HAPUS
function hapusDataGlobal(module, id) {
  if (confirm("Yakin ingin menghapus data ini secara permanen?")) {
    const formData = new FormData();
    formData.append("id", id);
    fetch(`api.php?module=${module}&action=delete`, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.status === "success") {
          alert("Data terhapus!");
          loadData(module);
        } else {
          alert("Gagal menghapus: " + res.message);
        }
      });
  }
}
