import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  const menu = [
    { path: "/barang", label: "Barang" },
    { path: "/pelanggan", label: "Pelanggan" },
    { path: "/penjualan", label: "Penjualan" },
  ];

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          POS System
        </Link>
        <ul className="navbar-nav ms-auto">
          {menu.map((item) => (
            <li key={item.path} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link ${
                  location.pathname.startsWith(item.path) ? "active" : ""
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
