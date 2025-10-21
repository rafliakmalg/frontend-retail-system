import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";

export default function BarangForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    nama: "",
    kategori: "",
    harga: "",
  });

  // ✅ Ambil daftar kategori dari API
  const { data: kategoriList } = useQuery({
    queryKey: ["kategoriBarang"],
    queryFn: async () => {
      const res = await axios.get("/barang/kategori/list");
      return res.data.data;
    },
  });

  // ✅ Ambil data barang jika sedang edit
  const { data } = useQuery({
    queryKey: ["barang", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`/barang/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (id) return axios.put(`/barang/${id}`, payload);
      return axios.post("/barang", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["barang"]);
      navigate("/barang");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="container mt-4">
      <h3>{id ? "Edit Barang" : "Tambah Barang"}</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nama Barang</label>
          <input
            type="text"
            className="form-control"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            required
          />
        </div>

        {/* ✅ Dropdown kategori */}
        <div className="mb-3">
          <label className="form-label">Kategori</label>
          <select
            className="form-select"
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value })}
            required
          >
            <option value="">-- Pilih Kategori --</option>
            {kategoriList &&
              Object.entries(kategoriList).map(([key, value]) => (
                <option key={key} value={key}>
                  {value}
                </option>
              ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Harga</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={form.harga}
            onChange={(e) => setForm({ ...form, harga: e.target.value })}
            required
          />
        </div>

        <button type="submit" className="btn btn-success me-2">
          Simpan
        </button>
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={() => navigate("/barang")}
        >
          Batal
        </button>
      </form>
    </div>
  );
}
