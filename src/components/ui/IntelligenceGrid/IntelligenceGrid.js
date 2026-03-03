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
    const [selectedTitulars, setSelectedTitulars] = useState({});
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

    const toggleSelection = (e, titular) => {
        e.stopPropagation();
        setSelectedTitulars(prev => ({
            ...prev,
            [titular]: !prev[titular]
        }));
    };

    const toggleSelectAll = (e) => {
        const allTitulars = Object.keys(groupedData);
        const allSelected = allTitulars.every(t => selectedTitulars[t]);

        const nextSelection = {};
        if (!allSelected) {
            allTitulars.forEach(t => nextSelection[t] = true);
        }
        setSelectedTitulars(nextSelection);
    };

    const handleExport = () => {
        const selectedList = Object.keys(selectedTitulars).filter(t => selectedTitulars[t]);
        onExportConsolidated(selectedList.length > 0 ? selectedList : null);
    };

    const selectedCount = Object.keys(selectedTitulars).filter(t => selectedTitulars[t]).length;
    const allSelected = Object.keys(groupedData).length > 0 &&
        Object.keys(groupedData).every(t => selectedTitulars[t]);

    const columns = [
        { key: "titular", label: "Titular" },
        { key: "obra_referencia", label: "Obra" },
        { key: "rubrica", label: "Rubrica" },
        { key: "periodo_inicial", label: "Início" },
        { key: "periodo_final", label: "Fim" },
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
                    <div className={styles.globalSelection}>
                        <input
                            type="checkbox"
                            id="selectAll"
                            className={styles.checkbox}
                            checked={allSelected}
                            onChange={toggleSelectAll}
                        />
                        <label htmlFor="selectAll">
                            {selectedCount > 0 ? `${selectedCount} Selecionado(s)` : 'Selecionar Todos'}
                        </label>
                    </div>
                    <button className={styles.resetMain} onClick={onReset}>
                        <RefreshCw size={16} />
                        Nova Análise
                    </button>
                    <button className={styles.exportMain} onClick={handleExport}>
                        <FileSpreadsheet size={16} />
                        {selectedCount > 0 ? 'Exportar Seleção' : 'Exportar Consolidado'}
                    </button>
                </div>
            </div>

            <div className={styles.groupsContainer}>
                {Object.entries(groupedData).map(([titular, rows]) => {
                    const isExpanded = expandedGroups[titular];
                    const totalRows = rows.length;
                    const totalValue = rows.reduce((sum, r) => sum + (parseFloat(r.valor_rateio) || 0), 0);

                    return (
                        <div key={titular} className={`${styles.groupCard} ${isExpanded ? styles.cardExpanded : ''} ${selectedTitulars[titular] ? styles.cardSelected : ''}`}>
                            <div className={styles.groupHeader} onClick={() => toggleGroup(titular)}>
                                <div className={styles.groupInfo}>
                                    <div className={styles.selectionWrapper}>
                                        <input
                                            type="checkbox"
                                            className={styles.checkbox}
                                            checked={!!selectedTitulars[titular]}
                                            onChange={(e) => toggleSelection(e, titular)}
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    </div>
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
                                                    <td>{row.periodo_inicial || row.periodo?.split(' - ')[0]}</td>
                                                    <td>{row.periodo_final || row.periodo?.split(' - ')[1] || row.periodo}</td>
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
