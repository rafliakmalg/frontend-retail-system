export default function ItemPenjualanForm({ items, setItems, barangList }) {
  const handleChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addItem = () => setItems([...items, { barang_id: "", qty: 1 }]);
  const removeItem = index => setItems(items.filter((_, i) => i !== index));

  return (
    <div>
      <h5>Item Penjualan</h5>
      {items.map((item, index) => (
        <div key={index} className="row mb-2">
          <div className="col-md-6">
            <select
              className="form-select"
              value={item.barang_id}
              onChange={e => handleChange(index, "barang_id", e.target.value)}
            >
              <option value="">Pilih Barang</option>
              {barangList?.map(b => (
                <option key={b.id} value={b.id}>{b.nama}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="number"
              className="form-control"
              value={item.qty}
              onChange={e => handleChange(index, "qty", e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>Hapus</button>
          </div>
        </div>
      ))}
      <button type="button" className="btn btn-secondary mt-2" onClick={addItem}>+ Tambah Item</button>
    </div>
  );
}
