import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../../api/axios";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import { Link } from "react-router-dom";

const fetchPelanggan = async ({ queryKey }) => {
  const [_key, { page, search }] = queryKey;
  const res = await axios.get(`/pelanggan?page=${page}&search=${search}`);
  return res.data;
};

export default function PelangganList() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["pelanggan", { page, search }],
    queryFn: fetchPelanggan,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/pelanggan/${id}`);
    },
    onSuccess: () => queryClient.invalidateQueries(["pelanggan"]),
  });

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus pelanggan ini?")) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <p className="text-center mt-5">Loading...</p>;

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Daftar Pelanggan</h3>
        <Link to="/pelanggan/add" className="btn btn-primary">+ Tambah Pelanggan</Link>
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <table className="table table-bordered mt-3">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Nama</th>
            <th>Domisili</th>
            <th>Jenis Kelamin</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data?.data?.length ? (
            data.data.map((p, i) => (
              <tr key={p.id}>
                <td>{i + 1}</td>
                <td>{p.nama}</td>
                <td>{p.domisili}</td>
                <td>{p.jenis_kelamin}</td>
                <td>
                  <Link
                    to={`/pelanggan/edit/${p.id}`}
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
