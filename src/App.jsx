import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Dashboard from "./modules/Dashboard/Dashboard";
import BarangList from "./modules/Barang/BarangList";
import BarangForm from "./modules/Barang/BarangForm";
import PelangganList from "./modules/Pelanggan/PelangganList";
import PelangganForm from "./modules/Pelanggan/PelangganForm";
import PenjualanList from "./modules/Penjualan/PenjualanList";
import PenjualanForm from "./modules/Penjualan/PenjualanForm";

export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Navigate to="/penjualan" />} />

          <Route path="/barang" element={<BarangList />} />
          <Route path="/barang/add" element={<BarangForm />} />
          <Route path="/barang/edit/:id" element={<BarangForm />} />

          <Route path="/pelanggan" element={<PelangganList />} />
          <Route path="/pelanggan/add" element={<PelangganForm />} />
          <Route path="/pelanggan/edit/:id" element={<PelangganForm />} />

          <Route path="/penjualan" element={<PenjualanList />} />
          <Route path="/penjualan/add" element={<PenjualanForm />} />
          <Route path="/penjualan/edit/:id" element={<PenjualanForm />} />
        </Routes>
      </div>
    </Router>
  );
}
