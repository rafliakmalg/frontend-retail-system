export default function Dashboard() {
  return (
    <div className="container mt-4">
      <div className="text-center">
        <h2>Selamat Datang di POS System</h2>
        <p className="text-muted mt-3">
          Kelola data barang, pelanggan, dan transaksi penjualan dengan mudah.
        </p>
        <hr className="my-4" />
        <p>
          Gunakan menu di atas untuk mulai mengelola data.  
          Semua perubahan tersimpan otomatis melalui API <b>http://localhost:8012/api</b>.
        </p>
      </div>
    </div>
  );
}
