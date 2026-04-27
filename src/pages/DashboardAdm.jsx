import React from "react";
import "./DashboardAdm.module.css";
import { Film, Ticket, CircleDollarSign, Settings, Search } from "lucide-react";

export default function DashboardAdm() {
    const registros = [
        { nome: "SESSÕES" },
        { nome: "CLIENTES" },
        { nome: "FILMES" },
        { nome: "SALAS" },
        { nome: "PROMOÇÕES" },
        { nome: "BANNER" },
    ];


    const relatorios = [
        { titulo: "FILMES MAIS ASSISTIDOS", icon: <Film size={18} /> },
        { titulo: "SESSÕES COM MAIOR OCUPAÇÃO", icon: <Ticket size={18} /> },
        { titulo: "RESERVAS REALIZADAS", icon: <CircleDollarSign size={18} /> },
    ];

    const grafico = [
        { dia: "Domingo", valor: 150 },
        { dia: "Segunda", valor: 90 },
        { dia: "Terça", valor: 70 },
        { dia: "Quarta", valor: 160 },
        { dia: "Quinta", valor: 95 },
        { dia: "Sexta", valor: 80 },
        { dia: "Sábado", valor: 120 },
    ];

    const valorMaximo = 200;

    return (
        <div className="dashboard">
            <div className="topLine"></div>

            <header className="dashboardHeader">
                <div></div>
                <div className="tituloArea">
                    <h1>DASHBOARD</h1>
                    <h2>ADMINISTRADOR</h2>
                </div>
                <button className="iconButton">
                    <Settings size={16} />
                </button>
            </header>

            <section className="section">
                <h3 className="sectionTitle">
                    ESTATÍSTICAS DO ADM <span>- Dados diários</span>
                </h3>

                <div className="statsGrid">
                    <div className="statCard">
                        <p>FILMES NO CARTAZ</p>
                        <strong>8</strong>
                    </div>

                    <div className="statCard">
                        <p>INGRESSOS VENDIDOS</p>
                        <strong>24</strong>
                    </div>

                    <div className="statCard">
                        <p>SESSÕES ATIVAS</p>
                        <strong>4</strong>
                    </div>

                    <div className="statCard">
                        <p>TOTAL DE CLIENTES</p>
                        <strong>24</strong>
                    </div>
                </div>
            </section>

            <section className="section">
                <h3 className="sectionTitle">REGISTROS GERAIS</h3>

                <div className="registrosLista">
                    {registros.map((item, index) => (
                        <div className="registroItem" key={index}>
                            <span>{item.nome}</span>
                            <button className="searchBtn">
                                <Search size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <h3 className="sectionTitle">RELATÓRIOS</h3>

                <div className="relatoriosGrid">
                    {relatorios.map((item, index) => (
                        <div className="relatorioCard" key={index}>
                            <p>{item.titulo}</p>
                            <button className="relatorioBtn">{item.icon}</button>
                        </div>
                    ))}
                </div>
            </section>

            <section className="section">
                <h3 className="sectionTitle">GRÁFICO</h3>

                <div className="graficoBox">
                    <h4>Fluxo de Público Diário</h4>

                    <div className="graficoArea">
                        <div className="eixoY">
                            <span>200</span>
                            <span>100</span>
                            <span>50</span>
                            <span>30</span>
                            <span>10</span>
                        </div>

                        <div className="graficoConteudo">
                            <div className="linhasHorizontais">
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>


                            <div className="barras">
                                {grafico.map((item, index) => (
                                    <div className="barraItem" key={index}>
                                        <div
                                            className="barra"
                                            style={{ height: `${(item.valor / valorMaximo) * 220}px` }}
                                        ></div>
                                        <span>{item.dia}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="labelVertical">Total de público</div>
                </div>
            </section>
        </div>
    );
}