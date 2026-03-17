import '../index.css';
import logo from "/logo-branca.png";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Lado Esquerdo, Logo */}
                <div className="footer-logo">
                    <img src={logo} alt="Spectra Logo" />
                </div>

                {/* Lado Direito, Informações de Contato */}
                <div className="footer-info">
                    <p>Avenida João Cernach, 2180, Vila Troncoso</p>
                    <p>(18) 3643-1700</p>
                    <p>SPECTRA@gmail.com</p>
                </div>
            </div>

            {/* Linha de Copyright */}
            <div className="footer-bottom">
                <p>&copy; 2026 Spectra. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
}