export default function Pagination({ current, total, onPageChange }) {
  if (!total || total <= 1) return null;

  const pages = Array.from({ length: total }, (_, i) => i + 1);

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination">
        {pages.map((page) => (
          <li
            key={page}
            className={`page-item ${current === page ? "active" : ""}`}
          >
            <button
              onClick={() => onPageChange(page)}
              className="page-link"
              style={{ cursor: "pointer" }}
            >
              {page}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
