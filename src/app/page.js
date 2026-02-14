"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import styles from './page.module.css';
import UploadZone from '@/components/ui/UploadZone/UploadZone';
import ProgressMonitor from '@/components/ui/ProgressMonitor/ProgressMonitor';
import IntelligenceGrid from '@/components/ui/IntelligenceGrid/IntelligenceGrid';

const API_BASE = 'https://api.sbacem.com.br/apidois/api/extractor';

// Estados do Fluxo Institucional
const STAGES = {
  IDLE: 'IDLE',
  PROCESSING: 'PROCESSING',
  SUCCESS: 'SUCCESS'
};

export default function Home() {
  const [stage, setStage] = useState(STAGES.IDLE);
  const [batchId, setBatchId] = useState(null);
  const [batchData, setBatchData] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const resultsRef = useRef(null);
  const monitorRef = useRef(null);

  // 1. Monitoramento Inteligente (Polling)
  useEffect(() => {
    let intervalId;

    if (batchId && stage === STAGES.PROCESSING) {
      intervalId = setInterval(async () => {
        try {
          const response = await axios.get(`${API_BASE}/batch/${batchId}`);
          const status = response.data;

          setBatchData(status);

          if (status.all_done) {
            console.log("Análise concluída. Iniciando síntese final para batch:", batchId);
            setStage(STAGES.SUCCESS);
            clearInterval(intervalId);
            fetchFinalData(batchId);
          }
        } catch (error) {
          console.error("Link de análise interrompido.", error);
          setStage(STAGES.IDLE);
          clearInterval(intervalId);
        }
      }, 2000);
    }

    return () => clearInterval(intervalId);
  }, [batchId, stage]);

  // 2. Navegação Inteligente (Scroll Suave)
  useEffect(() => {
    if (stage === STAGES.PROCESSING && monitorRef.current) {
      setTimeout(() => {
        monitorRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
    if (stage === STAGES.SUCCESS && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [stage]);

  const fetchFinalData = async (id) => {
    setIsSynthesizing(true);
    try {
      const response = await axios.get(`${API_BASE}/batch/${id}`);
      const successfulJobs = response.data.jobs.filter(j => j.status === 'concluido');

      const allRows = [];
      for (const job of successfulJobs) {
        const dataRes = await axios.get(`${API_BASE}/data/${job.id}`);
        allRows.push(...dataRes.data.data);
      }

      console.log(`Dados consolidados: ${allRows.length} registros encontrados.`);
      setExtractedData(allRows);
    } catch (error) {
      console.error("Falha ao sintetizar grade de inteligência.", error);
    } finally {
      setIsSynthesizing(false);
    }
  };

  // 3. Orquestração de Ingestão
  const handleUpload = async (files) => {
    setStage(STAGES.PROCESSING);
    setBatchId(null);
    setBatchData(null);
    setExtractedData([]);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      const response = await axios.post(`${API_BASE}/upload`, formData);
      setBatchId(response.data.batch_id);
    } catch (error) {
      console.error("Falha na ingestão de dados.", error);
      setStage(STAGES.IDLE);
    }
  };

  // 4. Reiniciar Sistema
  const resetAnalysis = () => {
    setStage(STAGES.IDLE);
    setBatchId(null);
    setBatchData(null);
    setExtractedData([]);
  };

  const handleExport = () => {
    if (!batchId) return;
    window.open(`${API_BASE}/export-consolidated/${batchId}`, '_blank');
  };

  return (
    <main className={styles.page}>
      {stage === STAGES.IDLE && (
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Motor de Extração<br />ECAD & SBACEM</h1>
          <p className={styles.heroSubtitle}>
            Plataforma proprietária de alta precisão para análise de documentos de direitos autorais.
            Arquitetura desenhada para auditoria financeira e inteligência de dados sênior.
          </p>
        </section>
      )}

      <div className={styles.contentRow}>
        {stage === STAGES.IDLE && (
          <UploadZone onUpload={handleUpload} isProcessing={false} />
        )}

        {stage === STAGES.PROCESSING && (
          <div ref={monitorRef} className={styles.fullWidthSection}>
            <ProgressMonitor batchData={batchData} />
          </div>
        )}

        {stage === STAGES.SUCCESS && (
          <div ref={resultsRef} className={styles.fullWidthSection}>
            {isSynthesizing ? (
              <div className={styles.synthesizeLoader}>
                <RefreshCw className={styles.spin} size={32} />
                <p>Sintetizando inteligência final... <br /><span>Consolidando auditoria de alta precisão</span></p>
              </div>
            ) : (
              <IntelligenceGrid
                data={extractedData}
                onExportConsolidated={handleExport}
                onReset={resetAnalysis}
              />
            )}
          </div>
        )}
      </div>

      <footer className={styles.footer}>
        <a
          href="https://figa.app.br"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.footerBranding}
        >
          figa<span>.app.br</span>
        </a>
      </footer>
    </main>
  );
}
