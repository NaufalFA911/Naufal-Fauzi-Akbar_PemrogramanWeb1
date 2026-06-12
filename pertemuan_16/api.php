<?php
session_start();
header('Content-Type: application/json');

if (!isset($_SESSION['login'])) {
   echo json_encode(['status' => 'error', 'message' => 'Sesi habis.']);
   exit;
}

include 'koneksi.php';

$module = $_GET['module'] ?? 'mahasiswa';
$action = $_GET['action'] ?? 'list';

if (!in_array($module, ['mahasiswa', 'dosen', 'matkul', 'jadwal'])) {
    echo json_encode(['status' => 'error', 'message' => 'Modul tidak valid.']);
    exit;
}

// 1. READ LIST DATA
if ($action == 'list') {
    if ($module == 'mahasiswa') {
        $query = mysqli_query($conn, "SELECT * FROM mahasiswa ORDER BY id DESC");
    } elseif ($module == 'dosen') {
        $query = mysqli_query($conn, "SELECT * FROM dosen ORDER BY id DESC");
    } elseif ($module == 'matkul') {
        $query = mysqli_query($conn, "SELECT * FROM matkul ORDER BY id DESC");
    } elseif ($module == 'jadwal') {
        $query = mysqli_query($conn, "SELECT j.*, d.nama AS nama_dosen, m.matkul AS nama_matkul, m.sks 
                                      FROM jadwal j 
                                      JOIN dosen d ON j.id_dosen = d.id 
                                      JOIN matkul m ON j.id_matkul = m.id 
                                      ORDER BY j.id DESC");
    }
    
    $data = [];
    while ($row = mysqli_fetch_assoc($query)) { $data[] = $row; }
    echo json_encode($data);
    exit;
}

// 2. GET SINGLE DATA (FOR EDIT)
if ($action == 'get_single') {
    $id = intval($_GET['id']);
    $query = mysqli_query($conn, "SELECT * FROM $module WHERE id = $id");
    echo json_encode(mysqli_fetch_assoc($query));
    exit;
}

// 3. GET OPTIONS FOR DROPDOWN JADWAL
if ($action == 'get_options') {
    $dosenQ = mysqli_query($conn, "SELECT id, nama FROM dosen ORDER BY nama ASC");
    $matkulQ = mysqli_query($conn, "SELECT id, matkul FROM matkul ORDER BY matkul ASC");
    
    $dosen = []; while($r = mysqli_fetch_assoc($dosenQ)) $dosen[] = $r;
    $matkul = []; while($r = mysqli_fetch_assoc($matkulQ)) $matkul[] = $r;
    
    echo json_encode(['dosen' => $dosen, 'matkul' => $matkul]);
    exit;
}

// 4. SAVE DATA (INSERT & UPDATE)
if ($action == 'save') {
    $id = $_POST['id'] ?? '';
    
    if ($module == 'mahasiswa') {
        $nim = mysqli_real_escape_string($conn, $_POST['nim']);
        $nama = mysqli_real_escape_string($conn, $_POST['nama']);
        $jurusan = mysqli_real_escape_string($conn, $_POST['jurusan']);
        $email = mysqli_real_escape_string($conn, $_POST['email']);
        $sql = empty($id) ? "INSERT INTO mahasiswa VALUES (NULL, '$nim', '$nama', '$jurusan', '$email')" : "UPDATE mahasiswa SET nim='$nim', nama='$nama', jurusan='$jurusan', email='$email' WHERE id=$id";
    } 
    elseif ($module == 'dosen') {
        $nama = mysqli_real_escape_string($conn, $_POST['nama']);
        $alamat = mysqli_real_escape_string($conn, $_POST['alamat']);
        $sql = empty($id) ? "INSERT INTO dosen VALUES (NULL, '$nama', '$alamat')" : "UPDATE dosen SET nama='$nama', alamat='$alamat' WHERE id=$id";
    } 
    elseif ($module == 'matkul') {
        $matkul = mysqli_real_escape_string($conn, $_POST['matkul']);
        $sks = intval($_POST['sks']);
        $sql = empty($id) ? "INSERT INTO matkul VALUES (NULL, '$matkul', $sks)" : "UPDATE matkul SET matkul='$matkul', sks=$sks WHERE id=$id";
    } 
    elseif ($module == 'jadwal') {
        $id_dosen = intval($_POST['id_dosen']);
        $id_matkul = intval($_POST['id_matkul']);
        $waktu = mysqli_real_escape_string($conn, $_POST['waktu']);
        $ruang = mysqli_real_escape_string($conn, $_POST['ruang']);
        $sql = empty($id) ? "INSERT INTO jadwal VALUES (NULL, $id_dosen, $id_matkul, '$waktu', '$ruang')" : "UPDATE jadwal SET id_dosen=$id_dosen, id_matkul=$id_matkul, waktu='$waktu', ruang='$ruang' WHERE id=$id";
    }

    if (mysqli_query($conn, $sql)) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit;
}

// 5. DELETE DATA
if ($action == 'delete') {
    $id = intval($_POST['id']);
    if (mysqli_query($conn, "DELETE FROM $module WHERE id = $id")) {
        echo json_encode(['status' => 'success']);
    } else {
        echo json_encode(['status' => 'error', 'message' => mysqli_error($conn)]);
    }
    exit;
}
?>