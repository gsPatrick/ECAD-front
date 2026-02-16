"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

// In production, the backend is usually proximated under /api or same domain
const SATELLITE_API = ""; // Empty string for relative calls or use window.location.origin

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
                // Use relative path to hit the same domain where backend is proximated
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
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
            <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
            <h2 className="text-xl font-bold text-slate-800 uppercase tracking-widest">
                Conexão Segura
            </h2>
            <p className="text-sm text-slate-500 mt-2">
                Sincronizando com Hub Central...
            </p>
        </div>
    );
}

export default function LiberarScreen() {
    return (
        <Suspense fallback={
            <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
                <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
                <p className="text-sm text-slate-500 mt-2 italic">Iniciando handshake seguro...</p>
            </div>
        }>
            <LiberarContent />
        </Suspense>
    );
}
