<?php
session_start();
if (!isset($_SESSION['login'])) {
   header("Location: login.php");
   exit;
}
?>
<!DOCTYPE html>
<html lang="id">
<head>
   <meta charset="UTF-8">
   <meta name="viewport" content="width=device-width, initial-scale=1.0">
   <title>Dashboard SIAKAD</title>
   <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light">

   <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
       <div class="container">
           <a class="navbar-brand fw-bold" href="#">SIAKAD UNIVERSITAS</a>
           <div class="d-flex align-items-center">
               <span class="text-white me-3">Selamat Datang, <strong><?= htmlspecialchars($_SESSION['username']); ?></strong></span>
               <a href="logout.php" class="btn btn-light btn-sm fw-bold text-danger" onclick="return confirm('Keluar dari sistem?')">Logout</a>
           </div>
       </div>
   </nav>

   <div class="container my-5">
       <h2 class="mb-4 text-secondary fw-bold">Panel Manajemen Informasi Akademik</h2>
       
       <ul class="nav nav-pills mb-4 shadow-sm p-2 bg-white rounded-3" id="siakadTab" role="tablist">
           <li class="nav-item">
               <button class="nav-link active fw-bold" id="mahasiswa-tab" data-bs-toggle="tab" data-bs-target="#mahasiswa-pane" type="button" role="tab" onclick="switchModule('mahasiswa')">Data Mahasiswa</button>
           </li>
           <li class="nav-item">
               <button class="nav-link fw-bold" id="dosen-tab" data-bs-toggle="tab" data-bs-target="#dosen-pane" type="button" role="tab" onclick="switchModule('dosen')">Data Dosen</button>
           </li>
           <li class="nav-item">
               <button class="nav-link fw-bold" id="matkul-tab" data-bs-toggle="tab" data-bs-target="#matkul-pane" type="button" role="tab" onclick="switchModule('matkul')">Data Matakuliah</button>
           </li>
           <li class="nav-item">
               <button class="nav-link fw-bold" id="jadwal-tab" data-bs-toggle="tab" data-bs-target="#jadwal-pane" type="button" role="tab" onclick="switchModule('jadwal')">Jadwal Kuliah</button>
           </li>
       </ul>

       <div class="tab-content" id="siakadTabContent">
           <div class="tab-pane fade show active" id="mahasiswa-pane" role="tabpanel">
               <div class="d-flex justify-content-between align-items-center mb-3">
                   <h4>Daftar Mahasiswa</h4>
                   <button class="btn btn-primary fw-bold" onclick="siapkanForm('mahasiswa', 'tambah')">Tambah Mahasiswa</button>
               </div>
               <div class="card shadow-sm border-0 rounded-3">
                   <table class="table table-hover mb-0">
                       <thead class="table-primary">
                           <tr>
                               <th class="ps-3">No</th>
                               <th>NIM</th>
                               <th>Nama</th>
                               <th>Jurusan</th>
                               <th>Email</th>
                               <th class="text-center">Aksi</th>
                           </tr>
                       </thead>
                       <tbody id="tempat-data-mahasiswa"></tbody>
                   </table>
               </div>
           </div>

           <div class="tab-pane fade" id="dosen-pane" role="tabpanel">
               <div class="d-flex justify-content-between align-items-center mb-3">
                   <h4>Daftar Dosen</h4>
                   <button class="btn btn-primary fw-bold" onclick="siapkanForm('dosen', 'tambah')">Tambah Dosen</button>
               </div>
               <div class="card shadow-sm border-0 rounded-3">
                   <table class="table table-hover mb-0">
                       <thead class="table-primary">
                           <tr>
                               <th class="ps-3">No</th>
                               <th>Nama Dosen</th>
                               <th>Alamat</th>
                               <th class="text-center">Aksi</th>
                           </tr>
                       </thead>
                       <tbody id="tempat-data-dosen"></tbody>
                   </table>
               </div>
           </div>

           <div class="tab-pane fade" id="matkul-pane" role="tabpanel">
               <div class="d-flex justify-content-between align-items-center mb-3">
                   <h4>Daftar Matakuliah</h4>
                   <button class="btn btn-primary fw-bold" onclick="siapkanForm('matkul', 'tambah')">Tambah Matakuliah</button>
               </div>
               <div class="card shadow-sm border-0 rounded-3">
                   <table class="table table-hover mb-0">
                       <thead class="table-primary">
                           <tr>
                               <th class="ps-3">No</th>
                               <th>Mata Kuliah</th>
                               <th>SKS</th>
                               <th class="text-center">Aksi</th>
                           </tr>
                       </thead>
                       <tbody id="tempat-data-matkul"></tbody>
                   </table>
               </div>
           </div>

           <div class="tab-pane fade" id="jadwal-pane" role="tabpanel">
               <div class="d-flex justify-content-between align-items-center mb-3">
                   <h4>Jadwal Perkuliahan</h4>
                   <button class="btn btn-primary fw-bold" onclick="siapkanForm('jadwal', 'tambah')">Tambah Jadwal</button>
               </div>
               <div class="card shadow-sm border-0 rounded-3">
                   <table class="table table-hover mb-0">
                       <thead class="table-primary">
                           <tr>
                               <th class="ps-3">No</th>
                               <th>Matakuliah</th>
                               <th>SKS</th>
                               <th>Dosen Pengampu</th>
                               <th>Waktu</th>
                               <th>Ruang</th>
                               <th class="text-center">Aksi</th>
                           </tr>
                       </thead>
                       <tbody id="tempat-data-jadwal"></tbody>
                   </table>
               </div>
           </div>
       </div>
   </div>

   <div class="modal fade" id="modalGlobal" tabindex="-1" aria-hidden="true">
       <div class="modal-dialog">
           <div class="modal-content border-0 shadow">
               <div class="modal-header bg-primary text-white">
                   <h5 class="modal-title fw-bold" id="modalTitle">Form Input</h5>
                   <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
               </div>
               <form id="formGlobal" onsubmit="simpanDataGlobal(event)">
                   <div class="modal-body" id="modalFormBody"></div>
                   <div class="modal-footer bg-light">
                       <button type="button" class="btn btn-secondary text-white fw-bold" data-bs-dismiss="modal">Batal</button>
                       <button type="submit" class="btn btn-primary fw-bold" id="btnSimpan">Simpan Data</button>
                   </div>
               </form>
           </div>
       </div>
   </div>

   <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
   <script src="script.js"></script>
</body>
</html>