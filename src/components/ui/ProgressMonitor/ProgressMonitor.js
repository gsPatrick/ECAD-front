"use client";

import React from 'react';
import { Loader2, CheckCircle2, AlertCircle, Clock, Database } from 'lucide-react';
import styles from './ProgressMonitor.module.css';

/**
 * ProgressMonitor - Monitor de Processamento Inteligente
 * 
 * Visualiza o ciclo de vida da extração com sobriedade institucional.
 */
const ProgressMonitor = ({ batchData }) => {
    if (!batchData) return null;

    const {
        total = 0,
        concluidos = 0,
        erros = 0,
        processando = 0,
        pendentes = 0,
        jobs = []
    } = batchData;

    const progressPercent = total > 0 ? ((concluidos + erros) / total) * 100 : 0;

    return (
        <div className={styles.monitorPanel}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <Database size={18} />
                    <span>Monitor de Inteligência Robusta</span>
                </div>
                <div className={styles.statusIndicator}>
                    <span>Processando Inteligência Financeira...</span>
                </div>
            </div>

            <div className={styles.content}>
                <div className={styles.statsGrid}>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Unidades Totais</span>
                        <span className={styles.statValue}>{total}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Processados com Sucesso</span>
                        <span className={styles.statValue}>{concluidos}</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statLabel}>Falhas Detectadas</span>
                        <span className={styles.statValue} style={{ color: erros > 0 ? 'var(--accent-red)' : 'inherit' }}>
                            {erros}
                        </span>
                    </div>
                </div>

                <div className={styles.progressBarContainer}>
                    <div className={styles.progressBarLabel}>
                        <span>Sintetizando Dados Financeiros</span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                    <div className={styles.progressBarBg}>
                        <div
                            className={styles.progressBarFill}
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                </div>

                <div className={styles.jobList}>
                    {jobs.map((job) => (
                        <div key={job.id} className={styles.jobItem}>
                            {job.status === 'concluido' && <CheckCircle2 size={16} className={styles.statusCompleted} />}
                            {job.status === 'erro' && <AlertCircle size={16} className={styles.statusError} />}
                            {job.status === 'processando' && <Loader2 size={16} className={`${styles.statusProcessing} ${styles.loader}`} />}
                            {job.status === 'pendente' && <Clock size={16} className={styles.statusPending} />}

                            <span className={styles.jobName}>{job.filename}</span>

                            <span className={`${styles.jobStatus} ${job.status === 'concluido' ? styles.statusCompleted :
                                    job.status === 'erro' ? styles.statusError :
                                        job.status === 'processando' ? styles.statusProcessing :
                                            styles.statusPending
                                }`}>
                                {job.status === 'concluido' ? 'Concluído' :
                                    job.status === 'erro' ? 'Erro' :
                                        job.status === 'processando' ? 'Processando' : 'Pendente'}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProgressMonitor;
