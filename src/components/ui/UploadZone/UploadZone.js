"use client";

import React, { useState, useCallback } from 'react';
import { Upload, X, FileText, Cpu } from 'lucide-react';
import styles from './UploadZone.module.css';

/**
 * UploadZone - Interface de Ingestão de Dados
 * 
 * Zona de drop institucional para fontes de inteligência em PDF.
 */
const UploadZone = ({ onUpload, isProcessing }) => {
    const [dragActive, setDragActive] = useState(false);
    const [files, setFiles] = useState([]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files).filter(
                file => file.type === "application/pdf"
            );
            setFiles(prev => [...prev, ...newFiles]);
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const newFiles = Array.from(e.target.files).filter(
                file => file.type === "application/pdf"
            );
            setFiles(prev => [...prev, ...newFiles]);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const triggerUpload = () => {
        if (files.length === 0) return;
        onUpload(files);
    };

    return (
        <div className={styles.container}>
            <div
                className={`${styles.uploadArea} ${dragActive ? styles.uploadAreaActive : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput').click()}
            >
                <div className={styles.glow} />
                <input
                    id="fileInput"
                    type="file"
                    multiple
                    accept=".pdf"
                    className="hidden"
                    hidden
                    onChange={handleFileChange}
                />

                <div className={styles.iconWrapper}>
                    <Upload size={32} strokeWidth={1.5} />
                </div>

                <div className={styles.textGroup}>
                    <h3 className={styles.title}>Ingestão de Fontes de Dados</h3>
                    <p className={styles.subtitle}>
                        Arraste e solte documentos de inteligência ECAD/SBACEM<br />
                        ou clique para explorar o diretório local.
                    </p>
                </div>

                {files.length > 0 && (
                    <div className={styles.fileList} onClick={(e) => e.stopPropagation()}>
                        {files.map((file, idx) => (
                            <div key={idx} className={styles.fileItem}>
                                <FileText size={16} className={styles.fileIcon} />
                                <span className={styles.fileName}>{file.name}</span>
                                <span className={styles.fileSize}>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                                <button
                                    className={styles.removeBtn}
                                    onClick={() => removeFile(idx)}
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                className={styles.actionButton}
                disabled={files.length === 0 || isProcessing}
                onClick={triggerUpload}
            >
                <Cpu size={18} />
                {isProcessing ? 'Sintetizando Dados...' : 'Iniciar Análise Institucional'}
            </button>
        </div>
    );
};

export default UploadZone;
