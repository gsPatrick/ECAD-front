"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Shield } from "lucide-react";

function LiberarContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");
    const nextPath = searchParams.get("next") || "/";

    useEffect(() => {
        if (!token) {
            alert("Token inválido.");
            return;
        }

        const runHandshake = async () => {
            try {
                // Call Satellite Backend via relative path
                const res = await fetch(`/api/liberar?token=${token}&next=${nextPath}`);

                if (res.ok) {
                    router.push(nextPath);
                } else {
                    console.error("Falha no handshake");
                    alert("Falha na validação de acesso.");
                }
            } catch (err) {
                console.error("Erro de conexão", err);
            }
        };

        runHandshake();
    }, [token, nextPath, router]);

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0f172a] text-white overflow-hidden font-sans">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                    backgroundSize: '30px 30px',
                    transformOrigin: 'center',
                }}>
            </div>

            {/* Radial Glow */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#152341]/30 to-[#0f172a]" />

            <div className="relative flex flex-col items-center">
                <div className="relative w-64 h-64 flex items-center justify-center mb-12">
                    {/* Concentric Rings (Animated) */}
                    <div className="absolute border border-[#c11e3c]/30 border-dashed rounded-full w-48 h-48 animate-[spin_10s_linear_infinite]" />
                    <div className="absolute border border-slate-700/50 rounded-full w-64 h-64 animate-[pulse-custom_4s_ease-in-out_infinite]" />

                    {/* Central Shield */}
                    <div className="relative z-10 flex items-center justify-center w-24 h-24 bg-[#152341] rounded-3xl border-2 border-[#c11e3c] shadow-[0_0_50px_-12px_rgba(193,30,60,0.5)]">
                        <Shield className="h-12 w-12 text-[#c11e3c] animate-pulse" />
                    </div>
                </div>

                <div className="text-center space-y-4 px-4 w-full max-w-md">
                    <h2 className="text-xl md:text-2xl font-black uppercase tracking-widest text-white drop-shadow-2xl">
                        Sincronizando Acesso
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-slate-700" />
                        <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em] uppercase">Protocolo Seguro v2.5</span>
                        <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-slate-700" />
                    </div>
                </div>

                {/* Progress bar simulation */}
                <div className="w-64 h-1.5 bg-slate-800/50 rounded-full mt-12 overflow-hidden border border-slate-700/30">
                    <div className="h-full bg-gradient-to-r from-[#c11e3c] to-[#f43f5e] animate-[progress_3s_ease-in-out_infinite]" />
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes progress {
                    0% { transform: translateX(-100%); }
                    50% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                @keyframes pulse-custom {
                    0%, 100% { opacity: 0.5; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.05); }
                }
            `}} />
        </div>
    );
}

export default function LiberarScreen() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a] z-50">
                <div className="h-10 w-10 border-2 border-slate-800 border-t-[#c11e3c] rounded-full animate-spin" />
            </div>
        }>
            <LiberarContent />
        </Suspense>
    );
}
