import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import styles from "./Grafico.module.css";

// ─── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className={styles.tooltip}>
        <p className={styles.tooltipLabel}>{label}</p>
        <p className={styles.tooltipValue}>
          {payload[0].value} <span>pessoa{payload[0].value !== 1 ? "s" : ""}</span>
        </p>
      </div>
    );
  }
  return null;
};

// ─── Formatador de data ────────────────────────────────────────────────────────
const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
};

// ─── Componente principal ──────────────────────────────────────────────────────
export default function Grafico() {
  const [dados, setDados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/reservas/relatorio_publico")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setErro(json.error);
        } else {
          const sorted = [...json.dados].sort(
            (a, b) => new Date(a.data_reserva) - new Date(b.data_reserva)
          );
          const formatted = sorted.map((item) => ({
            data: formatDate(item.data_reserva),
            publico: item.publico,
          }));
          setDados(formatted);
        }
      })
      .catch(() => setErro("Não foi possível conectar ao servidor."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`container-fluid ${styles.card}`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h6 className={styles.title}>Público diário</h6>
          <p className={styles.subtitle}>Últimos 30 dias</p>
        </div>
        {!loading && !erro && dados.length > 0 && (
          <div className={styles.badge}>
            {dados.reduce((acc, d) => acc + d.publico, 0)} total
          </div>
        )}
      </div>

      {/* Body */}
      <div className={styles.body}>
        {loading && (
          <div className={styles.state}>
            <div className={`spinner-border spinner-border-sm ${styles.spinner}`} role="status" />
            <span>Carregando dados…</span>
          </div>
        )}

        {erro && !loading && (
          <div className={styles.state}>
            <span className={styles.errorIcon}>⚠</span>
            <span className={styles.errorText}>{erro}</span>
          </div>
        )}

        {!loading && !erro && dados.length === 0 && (
          <div className={styles.state}>
            <span className={styles.emptyText}>Nenhum dado encontrado.</span>
          </div>
        )}

        {!loading && !erro && dados.length > 0 && (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart
              data={dados}
              margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
              barCategoryGap="35%"
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--gc-grid)"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="data"
                tick={{ fontSize: 11, fill: "var(--gc-muted)" }}
                axisLine={false}
                tickLine={false}
                interval="preserveStartEnd"
              />
              <YAxis
                tick={{ fontSize: 11, fill: "var(--gc-muted)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={false}
              />
              <Bar
                dataKey="publico"
                radius={[4, 4, 0, 0]}
                onMouseEnter={(_, index) => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {dados.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      hoveredIndex === index
                        ? "var(--gc-bar-hover)"
                        : "var(--gc-bar)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}