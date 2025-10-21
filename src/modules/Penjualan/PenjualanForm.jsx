import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";

export default function PenjualanForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    pelanggan_id: "",
    tanggal: "",
    items: [],
  });

  const { data: pelangganList } = useQuery({
    queryKey: ["pelangganAll"],
    queryFn: async () => (await axios.get("/pelanggan?all=1")).data.data,
  });

  const { data: barangList } = useQuery({
    queryKey: ["barangAll"],
    queryFn: async () => (await axios.get("/barang?all=1")).data.data,
  });

  const { data } = useQuery({
    queryKey: ["penjualan", id],
    queryFn: async () => {
      if (!id) return null;
      const res = await axios.get(`/penjualan/${id}`);
      return res.data.data;
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (data) {
      setForm({
        pelanggan_id: data.pelanggan_id,
        tanggal: data.tanggal,
        items: data.item_penjualans.map((item) => ({
          barang_id: item.barang_id,
          qty: item.qty,
        })),
      });
    }
  }, [data]);

  const mutation = useMutation({
    mutationFn: async (payload) => {
      if (id) return axios.put(`/penjualan/${id}`, payload);
      return axios.post("/penjualan", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["penjualan"]);
      navigate("/penjualan");
    },
  });

  const addItem = () => {
    setForm({
      ...form,
      items: [...form.items, { barang_id: "", qty: 1 }],
    });
  };

  const removeItem = (index) => {
    setForm({
      ...form,
      items: form.items.filter((_, i) => i !== index),
    });
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...form.items];
    updatedItems[index][key] = value;
    setForm({ ...form, items: updatedItems });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="container mt-4">
      <h3>{id ? "Edit Penjualan" : "Tambah Penjualan"}</h3>
      <form onSubmit={handleSubmit} className="mt-3">
        <div className="mb-3">
          <label className="form-label">Pelanggan</label>
          <select
            className="form-select"
            value={form.pelanggan_id}
            onChange={(e) => setForm({ ...form, pelanggan_id: e.target.value })}
            required
          >
            <option value="">-- Pilih Pelanggan --</option>
            {pelangganList?.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nama}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">Tanggal</label>
          <input
            type="date"
            className="form-control"
            value={form.tanggal}
            onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
            required
          />
        </div>

        <h5 className="mt-4">Item Penjualan</h5>
        {form.items.map((item, i) => (
          <div key={i} className="row align-items-end mb-3">
            <div className="col-md-6">
              <label className="form-label">Barang</label>
              <select
                className="form-select"
                value={item.barang_id}
                onChange={(e) =>
                  handleItemChange(i, "barang_id", e.target.value)
                }
                required
              >
                <option value="">-- Pilih Barang --</option>
                {barangList?.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.nama}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label">Qty</label>
              <input
                type="number"
                className="form-control"
                min="1"
                value={item.qty}
                onChange={(e) => handleItemChange(i, "qty", e.target.value)}
                required
              />
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeItem(i)}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          className="btn btn-secondary mb-3"
          onClick={addItem}
        >
          + Tambah Item
        </button>

        <div>
          <button type="submit" className="btn btn-success me-2">
            Simpan
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => navigate("/penjualan")}
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}
