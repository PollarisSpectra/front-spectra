import '../index.css';
import logo from "/logo-branca.png";

export default function Footer() {
    return (
        <footer className="container-fluid footer overflow-hidden py-4">
            <div className="container d-flex flex-column">
                <div className="row mb-4 gy-4 align-items-center">
                    <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start footer-logo">
                        <img src={logo} alt="Spectra Logo" style={{ maxWidth: '180px', height: 'auto' }} />
                    </div>
                    <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end text-center text-md-end">
                        <span className="fw-light">Avenida João Cernach, 2180, Vila Troncoso</span>
                        <span className="fw-light">(18) 3643-1700</span>
                        <span className="fw-light">SPECTRA@gmail.com</span>
                    </div>
                </div>

                <hr className="border-secondary opacity-25 d-md-none" />

                <div className="row mt-2">
                    <div className="col-12 text-center">
                        <small className="text-white-50">
                            &copy; 2026 Spectra. Todos os direitos reservados.
                        </small>
                    </div>
                </div>
            </div>
        </footer>
    );
}