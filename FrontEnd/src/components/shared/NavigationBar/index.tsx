import { Link } from "react-router-dom";
import { useEffect } from "react"; // Import useEffect hook
import "./index.css";

export default function NavigationBar() {
  useEffect(() => {
    const dropdownToggle = document.querySelector(".navbar-toggler");
    const dropdownMenu = document.querySelector(".navbar-collapse");
    dropdownToggle?.addEventListener("click", function () {
      dropdownMenu?.classList.toggle("show");
    });
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-5">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-house primarys"></i>
          <span className="brand-text">HOME</span>
        </Link>
        <button
          className="navbar-toggler "
          type="button"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/create-brand">
                Create Brand
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/compare">
                Compare
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
