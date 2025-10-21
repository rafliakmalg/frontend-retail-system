export default function SearchBar({ value, onChange }) {
  return (
    <div className="d-flex justify-content-end mb-2">
      <input
        type="text"
        className="form-control w-25"
        placeholder="Cari..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
