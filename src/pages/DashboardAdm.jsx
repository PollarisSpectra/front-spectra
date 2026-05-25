import React, { useEffect, useState } from "react";
import {
    Film,
    Ticket,
    CircleDollarSign,
    Settings,
    Search,
    SquarePen
} from 'lucide-react';
import css from './DashboardAdm.module.css';
import { Link } from "react-router-dom";

export default function DashboardAdm() {
    const [idEmpresa, setIdEmpresa] = useState(null);

    // DASHBOARD
    const [totalFilmes, setTotalFilmes] = useState(0);
    const [totalUsuarios, setTotalUsuarios] = useState(0);
    const [totalSessoes, setTotalSessoes] = useState(0);
    const [totalIngressos, setTotalIngressos] = useState(0);
    useEffect(() => {

        buscarEmpresa();
        buscarDashboard();

    }, []);

    async function buscarEmpresa() {

        try {

            const resposta = await fetch(
                "http://localhost:5000/empresa/verificar_empresa"
            );

            const dados = await resposta.json();

            if (dados.tem_empresa) {
                setIdEmpresa(dados.id_empresa);
            }

        } catch (error) {

            console.log("Erro ao buscar empresa:", error);

        }
    }

    async function buscarDashboard() {

        try {

            // FILMES
            const resFilmes = await fetch(
                "http://localhost:5000/filmes/total_cartaz"
            );

            const dadosFilmes = await resFilmes.json();

            setTotalFilmes(dadosFilmes.total);


            // USUÁRIOS
            const resUsuarios = await fetch(
                "http://localhost:5000/usuarios/total"
            );

            const dadosUsuarios = await resUsuarios.json();

            setTotalUsuarios(dadosUsuarios.total);


            // SESSÕES
            const resSessoes = await fetch(
                "http://localhost:5000/sessao/total_ativas"
            );

            const dadosSessoes = await resSessoes.json();

            setTotalSessoes(dadosSessoes.total);


            // INGRESSOS
            const resIngressos = await fetch(
                "http://localhost:5000/reservas/total_ingressos"
            );

            const dadosIngressos = await resIngressos.json();

            setTotalIngressos(dadosIngressos.total);

        } catch (error) {

            console.log("Erro dashboard:", error);

        }
    }

    const registros = [
        { nome: "SESSÕES", rota: "/app/sessoes" },
        { nome: "CLIENTES" },
        { nome: "FILMES", rota: "/app/filmes" },
        { nome: "SALAS", rota: "/app/salas" },
        { nome: "EMPRESA", rota: idEmpresa ? `/app/editar_empresa/${idEmpresa}` : "#" },
        { nome: "BANNER", rota: "/app/banners" },
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
        <div className={"container " + css.dashboard}>
            <div className={css.topLine}></div>

            <header className={css.dashboardHeader}>
                <div></div>

                <div className={css.tituloArea}>
                    <h1>DASHBOARD</h1>
                    <h2>ADMINISTRADOR</h2>
                </div>

                <div className="d-flex gap-2">
                    <button className={css.iconButton}>
                        <Settings size={16} />
                    </button>

                    {idEmpresa && (
                        <Link
                            to={`/app/editar_empresa/${idEmpresa}`}
                            className={css.iconButton}
                            title="Editar empresa"
                        >
                            <SquarePen size={16} />
                        </Link>
                    )}
                </div>
            </header>

            <section className={css.section}>
                <h3 className={css.sectionTitle}>
                    ESTATÍSTICAS DO ADM <span>- Dados diários</span>
                </h3>

                <div className={css.statsGrid}>
                    <div className={css.statCard}>
                        <p>FILMES NO CARTAZ</p>
                        <strong>{totalFilmes}</strong>
                    </div>

                    <div className={css.statCard}>
                        <p>INGRESSOS VENDIDOS</p>
                        <strong>{totalIngressos}</strong>
                    </div>

                    <div className={css.statCard}>
                        <p>SESSÕES ATIVAS</p>
                        <strong>{totalSessoes}</strong>
                    </div>

                    <div className={css.statCard}>
                        <p>TOTAL DE CLIENTES</p>
                        <strong>{totalUsuarios}</strong>
                    </div>
                </div>
            </section>

            <section className={css.section}>
                <h3 className={css.sectionTitle}>
                    REGISTROS GERAIS
                </h3>

                <div className={css.registrosLista}>
                    {registros.map((item, index) => (
                        <Link
                            to={item.rota || "#"}
                            className={css.registroItem}
                            key={index}
                        >
                            <span>{item.nome}</span>

                            <button className={css.searchBtn}>
                                <Search size={16} />
                            </button>
                        </Link>
                    ))}
                </div>
            </section>

            <section className={css.section}>
                <h3 className={css.sectionTitle}>
                    RELATÓRIOS
                </h3>

                <div className={css.relatoriosGrid}>
                    {relatorios.map((item, index) => (
                        <div className={css.relatorioCard} key={index}>
                            <p>{item.titulo}</p>

                            <button className={css.relatorioBtn}>
                                {item.icon}
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            <section className={css.section}>
                <h3 className={css.sectionTitle}>
                    GRÁFICO
                </h3>

                <div className={css.graficoBox}>
                    <h4>Fluxo de Público Diário</h4>

                    <div className={css.graficoArea}>
                        <div className={css.eixoY}>
                            <span>200</span>
                            <span>100</span>
                            <span>50</span>
                            <span>30</span>
                            <span>10</span>
                        </div>

                        <div className={css.graficoConteudo}>
                            <div className={css.linhasHorizontais}>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>

                            <div className={css.barras}>
                                {grafico.map((item, index) => (
                                    <div
                                        className={css.barraItem}
                                        key={index}
                                    >
                                        <div
                                            className={css.barra}
                                            style={{
                                                height: `${(item.valor / valorMaximo) * 220}px`
                                            }}
                                        ></div>

                                        <span>{item.dia}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={css.labelVertical}>
                        Total de público
                    </div>
                </div>
            </section>
        </div>
    );
}