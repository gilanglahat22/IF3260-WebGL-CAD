# IF3260-WebGL-CAD
>Implementasi WebGL dalam bentuk program CAD berbasis _web_
>
>Tugas Besar I IF3260 Grafika Komputer Sem. 2 2022/2023

## Requirements
1. _Web browser_ favorit Anda
2. **[RECOMMENDED]** _Extension_ **_Live Server_** pada _Visual Studio Code_
3. **[RECOMMENDED]** _Python v3.X.X_ (untuk menjalankan server)

## Cara Menjalankan
_Fork_ repository ini ke komputer Anda terlebih dahulu. Ada 3 cara untuk menjalankan aplikasi:
1. **Membuka file index.html**
2. **Menggunakan Visual Studio Code**
3. **Menggunakan Python HTTP Server**

## Membuka `index.html`
1. Pastikan _repository_ ini sudah di-fork
2. Buka direktori `src`, lalu buka file `index.html` pada _browser_ Anda

### Menggunakan Visual Studio Code
1. Pastikan _extension_ **_Live Server_** sudah terpasang
> Klik menu '_Extensions_' > cari **_Live Server_** > klik _Install_
2. Buka dokumen `index.html` dari _Visual Studio Code_
3. Klik kanan, lalu pilih opsi '**_Open with Live Server_**
4. Akan muncul _link_ menuju aplikasi (biasanya akan di-_redirect_ atau Anda dapat membuka langsung _link tersebut_)

### Menggunakan Python HTTP Server
1. Pastikan _interpreter Python_ sudah terpasang pada komputer Anda
2. Buka program terminal Anda, lalu navigasi ke folder `src`
3. Jalankan perintah berikut:
```python3 -m http.server```
Akan muncul _link_ menuju aplikasi, silahkan membuka _link_ tersebut pada _browser_ anda
4. Akan muncul direktori dengan opsi `index.html`. Klik `index.html`
5. Aplikasi sudah siap dijalankan.


## Cara Menggunakan
### Garis

#### Menggambar Garis

1.  Klik tombol "Line" pada sidebar
2.  Pilih titik bebas pada canvas, lalu klik kiri mouse
3.  Pilih titik bebas lainnya, lalu klik kiri mouse
4.  Garis  baru akan terbentuk

#### Mengubah Panjang Garis

1.  Klik salah satu vertex pada garis hingga indikator berubah warna
2.  Gerakkan mouse Anda ke posisi baru
3.  Lepaskan tombol mouse apabila kursor / vertex sudah berada di posisi yang diinginkan

### Persegi dan Persegi Panjang

#### Menggambar Persegi / Persegi Panjang
1.  Klik tombol "Square" / "Rectangle" pada sidebar
2.  Pilih titik bebas pada canvas, lalu klik kiri mouse
3.  Persegi baru akan terbentuk

#### Mengubah Panjang Sisi

Mengubah panjang sisi dapat dilakukan dengan menggerakkan vertex atau mengisikan field

Melalui menggerakan vertex,

1.  Klik salah satu vertex pada garis hingga indikator berubah warna
2.  Gerakkan mouse Anda dan ukuran persegi akan berubah
> Untuk persegi panjang, ukuran panjang dan lebar akan berubah sesuai kursor, sementara untuk persegi, ukuran sisi akan tetap sama

Melalui field,

1.  Double-click persegi / persegi panjang yang ingin diubah
2.  Akan muncul field untuk resize pada sidebar, lalu isikan persentase pertambahan panjang / lebar yang diinginkan (misal. '10' menandakan menambahkan panjang sepanjang 10%)
3.  Untuk persegi, akan ada 1 field yang muncul untuk menandakan pergantian sisi, sementara untuk persegi panjang, akan ada 2 field untuk menandakan pergantian panjang (length) dan lebar (width)

### Polygon

#### Menggambar Polygon
1.  Terdapat field di bawah tombol untuk menandakan jumlah vertex; pastikan field sudah terisi (secara default berisi 6)
2.  Klik tombol "Polygon" pada sidebar
3.  Pilih titik bebas pada canvas lalu klik
4.  Ulangi proses 3 hingga semua vertex sudah tergambar

#### Menambah Titik Sudut

1.  Double-click polygon hingga semua indikator vertex berwarna putih
2.  Klik titik bebas di luar polygon
3.  Vertex baru akan tergambar

#### Menghapus Titik Sudut
1.  Double-click polygon hingga semua indikator vertex berwarna putih
2.  Klik kanan vertex yang ingin dihapus
3.  Vertex tersebut akan dihapus

### Semua Model

#### Unselect Model

Untuk batal memilih model, klik kanan pada canvas bagian manapun, atau double click model lainnya
> Untuk polygon, hanya terbatas untuk klik kanan, karena mengklik kiri pada objek polygon berfungsi untuk menambahkan vertex baru

#### Translasi
1.  Double-click polygon hingga semua indikator vertex berwarna putih
2.  Tahan mouse, lalu gerakkan model yang diinginkan
3.  Model akan bergerak ke koordinat baru

#### Rotasi
1.  Double-click polygon hingga semua indikator vertex berwarna putih
2.  Akan muncul slider pada sidebar, gerakkan slider untuk memutar model
3.  Model akan berputar sesuai sudut yang diinginkan

#### Menggerakan Vertex

1.  Klik vertex hingga indikator berwarna putih
2.  Tahan mouse pada vertex, lalu gerakkan mouse
3.  Vertex akan bergerak ke posisi yang diinginkan
    -   Untuk model garis, panjang garis akan berubah secara langsung
    -   Untuk model persegi, sisi persegi akan berubah secara langsung, namun panjang keempat sisi akan dipertahankan
    -   Untuk model persegi panjang, panjang dan lebar akan berubah secara langsung tergantung gerakan mouse
    -   Untuk model polygon, akan muncul preview dari convex hull yang terbentuk secara langsung

#### Mengubah Warna Salah Satu Titik Sudut
1.  Klik vertex hingga indikator berwarna putih
2.  Klik color picker di sidebar, lalu pilih warna baru
3.  Warna vertex tersebut akan berubah

#### Mengubah Warna Semua Titik Sudut

1.  Double--click polygon hingga semua indikator vertex berwarna putih
2.  Klik color picker di sidebar, lalu pilih warna baru
3.  Warna model akan berubah
> Untuk mengubah warna model sebelum digambar, pilih warna color picker sebelum memilih model yang ingin digambar

#### Save Keseluruhan Canvas
1.  Isikan field nama file sebelum menyimpan
2.  Klik tombol Save File

#### Save  Salah Satu Model

1.  Double click model yang ingin di-save
2.  Isikan field nama file sebelum menyimpan
3.  Klik tombol Save Model

#### Load Save File

1.  Klik tombol Upload File
2.  Pilih file yang telah di-save sebelumnya (dapat berupa file model atau file canvas)
3.  Canvas akan di-load

    -   Contoh savefile model dapat dilihat pada file test-polygon.json dan test-square.json

    -   Contoh savefile  canvas dapat dilihat pada file test-canvas.json dan test-amongus.json
    Contoh savefile canvas dapat dilihat pada file test-canvas.json dan test-amongus.json


