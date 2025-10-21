import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";

const fetchBarang = async ({ queryKey }) => {
  const [_key, { page, search }] = queryKey;
  const res = await axios.get(`/barang?page=${page}&search=${search}`);
  return res.data;
};

export default function BarangList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["barang", { page, search }],
    queryFn: fetchBarang,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/barang/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(["barang"]),
  });

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus barang ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Daftar Barang</h3>
        <Link to="/barang/add" className="btn btn-primary">+ Tambah Barang</Link>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length ? (
            data.data.map((b, i) => (
              <tr key={b.id}>
                <td>{i + 1}</td>
                <td>{b.nama}</td>
                <td>{b.kategori_label}</td>
                <td>Rp {parseFloat(b.harga).toLocaleString()}</td>
                <td>
                  <Link
                    to={`/barang/edit/${b.id}`}
                    className="btn btn-sm btn-warning me-2"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(b.id)}
                    className="btn btn-sm btn-danger"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
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
