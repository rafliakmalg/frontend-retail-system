import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";
import { Link } from "react-router-dom";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";

const fetchPenjualan = async ({ queryKey }) => {
  const [_key, { page, search }] = queryKey;
  const res = await axios.get(`/penjualan?page=${page}&search=${search}`);
  return res.data;
};

export default function PenjualanList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["penjualan", { page, search }],
    queryFn: fetchPenjualan,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => axios.delete(`/penjualan/${id}`),
    onSuccess: () => queryClient.invalidateQueries(["penjualan"]),
  });

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus penjualan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Data Penjualan</h3>
        <Link to="/penjualan/add" className="btn btn-primary">
          + Tambah Penjualan
        </Link>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Tanggal</th>
            <th>Pelanggan</th>
            <th>Sub Total</th>
            <th>Detail Barang</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length ? (
            data.data.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.tanggal}</td>
                <td>{p.pelanggan?.nama}</td>
                <td>Rp {parseFloat(p.sub_total).toLocaleString()}</td>
                <td>
                  <ul className="mb-0">
                    {p.item_penjualans.map((item) => (
                      <li key={item.id}>
                        {item.barang?.nama} ({item.qty}x)
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <Link
                    to={`/penjualan/edit/${p.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        current={data?.pagination?.current_page}
        total={data?.pagination?.last_page}
        onPageChange={setPage}
      />
    </div>
  );
}
