import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";

export default function PelangganForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    nama: "",
    domisili: "",
    jenis_kelamin: "",
  });

  const { data } = useQuery({
    queryKey: ["pelanggan", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`/pelanggan/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (id) {
        return axios.put(`/pelanggan/${id}`, payload);
      } else {
        return axios.post("/pelanggan", payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pelanggan"]);
      navigate("/pelanggan");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="container mt-4">
      <h3>{id ? "Edit Pelanggan" : "Tambah Pelanggan"}</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Nama</label>
          <input
            type="text"
            className="form-control"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Domisili</label>
          <input
            type="text"
            className="form-control"
            value={form.domisili}
            onChange={(e) => setForm({ ...form, domisili: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Jenis Kelamin</label>
          <select
            className="form-select"
            value={form.jenis_kelamin}
            onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
            required
          >
            <option value="">Pilih</option>
            <option value="Pria">Pria</option>
            <option value="Perempuan">Perempuan</option>
          </select>
        </div>

        <button type="submit" className="btn btn-success me-2">
          Simpan
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate("/pelanggan")}
        >
          Batal
        </button>
      </form>
    </div>
  );
}
