import { useEffect, useState } from 'react';
import '../index.css';

export default function Footer() {
    const [idEmpresa, setIdEmpresa] = useState(null);

    useEffect(() => {
        async function buscarEmpresa() {
            try {
                const resposta = await fetch("http://localhost:5000/empresa/verificar_empresa");

                const dados = await resposta.json();

                if (dados.tem_empresa) {
                    setIdEmpresa(dados.id_empresa);
                }

            } catch (error) {
                console.log("Erro ao buscar empresa:", error);
            }
        }

        buscarEmpresa();
    }, []);

    return (
        <footer className="container-fluid footer overflow-hidden py-4">
            <div className="container d-flex flex-column">

                <div className="row mb-4 gy-4 align-items-center">
                    <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start footer-logo">

                        {idEmpresa && (
                            <img
                                src={`http://localhost:5000/empresa/logo/${idEmpresa}`}
                                alt="Logo Empresa"
                                style={{
                                    maxWidth: '90px',
                                    height: 'auto'
                                }}
                            />
                        )}

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