"use client";

import React, { useState } from 'react';
import { Download, Table as TableIcon, Database, FileSpreadsheet, RefreshCw, ChevronDown, ChevronUp, User } from 'lucide-react';
import styles from './IntelligenceGrid.module.css';

/**
 * IntelligenceGrid - Camada de Apresentação Agrupada
 * 
 * Organiza dados por Titular com seções colapsáveis.
 */
const IntelligenceGrid = ({ data, onExportConsolidated, onReset }) => {
    const [expandedGroups, setExpandedGroups] = useState({});
    const [isExporting, setIsExporting] = useState(false);

    if (!data || data.length === 0) {
        return (
            <div className={styles.emptyState}>
                <Database size={24} opacity={0.5} />
                <p>Nenhum dado de inteligência carregado. Verifique os fontes ou aguarde a sincronização final.</p>
            </div>
        );
    }

    // Agrupamento por Titular
    const groupedData = data.reduce((acc, row) => {
        const key = row.titular || 'Titular Não Identificado';
        if (!acc[key]) acc[key] = [];
        acc[key].push(row);
        return acc;
    }, {});

    const toggleGroup = (key) => {
        setExpandedGroups(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const columns = [
        { key: "titular", label: "Titular" },
        { key: "obra_referencia", label: "Obra" },
        { key: "rubrica", label: "Rubrica" },
        { key: "periodo", label: "Período" },
        { key: "rendimento", label: "Rendimento" },
        { key: "valor_rateio", label: "Rateio" },
        { key: "isrc_iswc", label: "ISRC/ISWC" },
        { key: "arquivo_origem", label: "Fonte" }
    ];

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.globalHeader}>
                <div className={styles.titleGroup}>
                    <TableIcon size={20} className={styles.mainIcon} />
                    <h2 className={styles.mainTitle}>Dataset de Inteligência Extraído</h2>
                </div>

                <div className={styles.headerActions}>
                    <button className={styles.resetMain} onClick={onReset}>
                        <RefreshCw size={16} />
                        Nova Análise
                    </button>
                    <button className={styles.exportMain} onClick={onExportConsolidated}>
                        <FileSpreadsheet size={16} />
                        Exportar Consolidado
                    </button>
                </div>
            </div>

            <div className={styles.groupsContainer}>
                {Object.entries(groupedData).map(([titular, rows]) => {
                    const isExpanded = expandedGroups[titular];
                    const totalRows = rows.length;
                    const totalValue = rows.reduce((sum, r) => sum + (parseFloat(r.valor_rateio) || 0), 0);

                    return (
                        <div key={titular} className={`${styles.groupCard} ${isExpanded ? styles.cardExpanded : ''}`}>
                            <div className={styles.groupHeader} onClick={() => toggleGroup(titular)}>
                                <div className={styles.groupInfo}>
                                    <div className={styles.userIconWrapper}>
                                        <User size={18} />
                                    </div>
                                    <div>
                                        <h3 className={styles.titularName}>{titular}</h3>
                                        <p className={styles.titularMeta}>{totalRows} registros identificados</p>
                                    </div>
                                </div>

                                <div className={styles.groupActions}>
                                    <div className={styles.groupTotal}>
                                        {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                    </div>
                                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                            </div>

                            {isExpanded && (
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                {columns.map(col => (
                                                    <th key={col.key}>{col.label}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {rows.map((row, idx) => (
                                                <tr key={idx}>
                                                    <td className={styles.mainCell}>{row.titular}</td>
                                                    <td>
                                                        <span className={styles.badgeObra}>
                                                            {row.obra_referencia || 'N/A'}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={styles.badgeRubrica}>
                                                            {row.rubrica}
                                                        </span>
                                                    </td>
                                                    <td>{row.periodo}</td>
                                                    <td className={styles.numeric}>
                                                        {row.rendimento?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                    <td className={styles.numeric}>
                                                        {row.valor_rateio?.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                    <td>
                                                        <code className={styles.codeCell}>{row.isrc_iswc || '---'}</code>
                                                    </td>
                                                    <td>
                                                        <div className={styles.filename} title={row.arquivo_origem}>
                                                            {row.arquivo_origem}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default IntelligenceGrid;
