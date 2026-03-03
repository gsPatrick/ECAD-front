"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

const HUB_VERIFY_URL = "https://api.sbacem.com.br/apicentralizadora/auth/verify-session-browser";
const SYSTEM_ID = "2";

export function SessionExpiredModal() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const handleSessionExpired = () => setOpen(true);
        window.addEventListener("session-expired", handleSessionExpired);
        return () => window.removeEventListener("session-expired", handleSessionExpired);
    }, []);

    const handleVerify = () => {
        const currentUrl = window.location.href;
        window.location.href = `${HUB_VERIFY_URL}?system_id=${SYSTEM_ID}&redirect_url=${encodeURIComponent(currentUrl)}`;
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md">
            <div className="w-full max-w-md bg-[#1a1a1a] rounded-xl shadow-2xl p-8 border border-purple-500/30">
                <div className="flex flex-col items-center text-center">
                    <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-6 text-purple-400">
                        <AlertTriangle className="h-8 w-8" />
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-3">Sessão Expirada</h2>
                    <p className="text-gray-400 mb-8 text-sm leading-relaxed">
                        A conexão segura com o Núcleo de Inteligência foi interrompida. Revalide suas credenciais.
                    </p>

                    <button
                        onClick={handleVerify}
                        className="w-full py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-lg transition-all transform hover:scale-[1.02] uppercase text-xs tracking-widest shadow-lg shadow-purple-900/20"
                    >
                        Reconectar Sistema
                    </button>
                </div>
            </div>
        </div>
    );
}
