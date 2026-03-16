import logo from '../assets/logo.svg';
import Vector from '../assets/Vector.png'
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className="container-fluid bg-black d-flex">
            <div className="container py-2">
                <img src={logo} width={100} alt="" />
            </div>
            <div className={styles["header-actions"] + " d-flex align-items-center justify-content-between"}>
                <button className={styles["header-cadastrar"]}>
                    CADASTRAR
                </button>

                <button className={styles["header-login"]}>
                    LOGIN
                    <img src={Vector} alt="login" className={styles["Vector"]} />
                </button>
            </div>
        </header>
    )
}