# Dokumentasi Sistem Modal & Toast UI (Vanilla JS + TailwindCSS)

Sistem notifikasi dan modal yang ringan, modern, dan mudah digunakan tanpa dependencies framework (React/Vue/Alpine). Hanya membutuhkan **TailwindCSS** dan **Vanilla JavaScript**.

## 🚀 Instalasi

1. **Include TailwindCSS** (Bisa via CDN atau Build process).
2. **Include `ui-system.js`** sebelum penutup tag `</body>`.

```html
<!-- Pada <head> -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Sebelum </body> -->
<script src="ui-system.js"></script>
```

---

## 🍞 Toast Notification

Menampilkan notifikasi popup di pojok kanan atas.

### Penggunaan Dasar

```javascript
UISystem.showToast({
    type: 'success', // Opsional: success, error, warning, info (default)
    message: 'Operasi berhasil!'
});
```

### Fitur Lanjutan (Judul & Progress Bar)

```javascript
UISystem.showToast({
    type: 'error',
    title: 'Gagal Menyimpan',          // Judul tebal di atas pesan
    message: 'Koneksi internet terputus.',
    duration: 5000,                    // Durasi dalam milidetik (default 3000)
    showProgress: true                 // Tampilkan progress bar berjalan
});
```

### API Reference: `showToast(options)`
| Option | Type | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `type` | string | `'info'` | Jenis toast: `'success'`, `'error'`, `'warning'`, `'info'`. |
| `message` | string | `''` | Teks pesan utama. |
| `title` | string | `''` | (Opsional) Judul tebal di atas pesan. |
| `duration` | number | `3000` | Waktu tampil dalam milidetik. Set `0` untuk unlimitted. |
| `showProgress`| boolean| `false` | Menampilkan animasi progress bar di bawah toast. |

---

## 🪟 Modal System

Menampilkan dialog popup di tengah layar dengan backdrop blur.

### Modal Informasi Sederhana

```javascript
UISystem.openModal({
    title: 'Selamat Datang',
    content: 'Ini adalah modal informasi sederhana.',
    confirmText: 'Tutup'
});
```

### Modal Konfirmasi (Ya/Tidak)

```javascript
UISystem.openModal({
    title: 'Hapus Data?',
    content: 'Tindakan ini tidak dapat dikembalikan.',
    showCancel: true,                 // Tampilkan tombol Batal
    confirmText: 'Hapus',
    cancelText: 'Batal',
    onConfirm: () => {
        console.log('Data dihapus!');
        // Return true akan menutup modal otomatis
        // Return false akan membiarkan modal tetap terbuka
        return true; 
    },
    onCancel: () => {
        console.log('Dibatalkan');
    }
});
```

### Modal dengan Form Custom (HTML)

Anda bisa memasukkan HTML string atau DOM Node ke dalam `content`.

```javascript
const formHTML = `
    <div class="space-y-3">
        <input id="email" class="border p-2 w-full rounded" placeholder="Email">
        <input id="pass" type="password" class="border p-2 w-full rounded" placeholder="Password">
    </div>
`;

UISystem.openModal({
    title: 'Login',
    content: formHTML,
    confirmText: 'Masuk',
    showCancel: true,
    onConfirm: () => {
        const email = document.getElementById('email').value;
        if (!email) {
            // Tampilkan error toast dan jangan tutup modal
            UISystem.showToast({ type: 'error', message: 'Email wajib diisi!' });
            return false; 
        }
        
        UISystem.showToast({ type: 'success', message: 'Login berhasil!' });
        return true; // Tutup modal
    }
});
```

### API Reference: `openModal(options)`
| Option | Type | Default | Deskripsi |
| :--- | :--- | :--- | :--- |
| `title` | string | `'Info'` | Judul modal. |
| `content` | string/Node| `''` | Isi modal. Bisa berupa teks, HTML string, atau elemen HTML. |
| `showCancel` | boolean | `false` | Tampilkan tombol cancel. |
| `confirmText` | string | `'Konfirmasi'` | Teks tombol konfirmasi (tombol utama). |
| `cancelText` | string | `'Batal'` | Teks tombol cancel. |
| `onConfirm` | function | `() => {}` | Callback saat konfirmasi. Return `false` untuk mencegah modal tertutup. |
| `onCancel` | function | `() => {}` | Callback saat dibatalkan (klik tombol batal, klik backdrop, atau ESC). |

### Metode Lain
- `UISystem.closeModal()`: Menutup modal yang sedang aktif secara programatik.
