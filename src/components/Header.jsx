import logo from '../assets/logo.svg';

export default function Header() {
    return (
        <header className="container-fluid bg-black">
            <div className="container py-2">
                <img src={logo} width={100} alt="" />
            </div>
        </header>
    )
}