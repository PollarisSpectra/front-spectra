import { useEffect, useState } from 'react';
import '../index.css';

export default function Footer() {

    const [empresa, setEmpresa] = useState(null);
    const [cores, setCores] = useState(null);

    useEffect(() => {

        async function buscarDados() {

            try {

                const respostaEmpresa = await fetch("http://localhost:5000/empresa/verificar_empresa");
                const dadosEmpresa = await respostaEmpresa.json();

                if (dadosEmpresa.tem_empresa) {
                    setEmpresa(dadosEmpresa);
                }

                const respostaCores = await fetch("http://localhost:5000/empresa/buscar_cores");
                const dadosCores = await respostaCores.json();

                setCores(dadosCores);

            } catch (error) {

                console.log("Erro ao buscar dados:", error);

            }

        }

        buscarDados();

    }, []);

    return (
        <footer
            className="container-fluid footer overflow-hidden py-4"
            style={{
                backgroundColor: cores?.COR_PRINCIPAL || "#000",
                color: cores?.COR_TEXTO || "#fff"
            }}
        >

            <div className="container d-flex flex-column">

                <div className="row mb-4 gy-4 align-items-center">

                    <div className="col-12 col-md-6 d-flex justify-content-center justify-content-md-start footer-logo">

                        {empresa && (
                            <img
                                src={`http://localhost:5000/empresa/logo/${empresa.id_empresa}`}
                                alt="Logo Empresa"
                                style={{
                                    maxWidth: '90px',
                                    height: 'auto'
                                }}
                            />
                        )}

                    </div>

                    <div className="col-12 col-md-6 d-flex flex-column align-items-center align-items-md-end text-center text-md-end">

                        <span className="fw-light">
                            {empresa?.nome_fantasia}
                        </span>

                        <span className="fw-light">
                            {empresa?.telefone}
                        </span>

                        <span className="fw-light">
                            {empresa?.endereco}
                        </span>

                    </div>

                </div>

                <hr
                    className="opacity-25 d-md-none"
                    style={{
                        borderColor: cores?.COR_LINHA || "#666"
                    }}
                />

                <div className="row mt-2">

                    <div className="col-12 text-center">

                        <small
                            style={{
                                color: cores?.COR_TEXTO || "#ccc"
                            }}
                        >
                            &copy; 2026 {empresa?.nome_fantasia || "Spectra"}. Todos os direitos reservados.
                        </small>

                    </div>

                </div>

            </div>

        </footer>
    );
}