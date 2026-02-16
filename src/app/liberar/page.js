import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

const SATELLITE_API = "http://localhost:8002"; // Satellite 3 is port 8002

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
                const res = await fetch(`${SATELLITE_API}/api/liberar?token=${token}&next=${nextPath}`);

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
