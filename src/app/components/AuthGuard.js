"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SYSTEM_ID = 2; // novprojetopytonocr
const HUB_URL = "https://api.sbacem.com.br/apicentralizadora";

export function AuthGuard({ children }) {
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // 1. Public routes
        if (pathname.startsWith("/liberar")) {
            setIsAuthorized(true);
            setIsLoading(false);
            return;
        }

        // 2. Check for session cookie
        const hasSession = document.cookie.split("; ").some((row) => row.startsWith("satellite_session="));

        if (!hasSession) {
            // 3. Redirect to Hub
            const returnUrl = window.location.href;
            window.location.href = `${HUB_URL}/auth/verify-session-browser?system_id=${SYSTEM_ID}&redirect_url=${encodeURIComponent(returnUrl)}`;
        } else {
            setIsAuthorized(true);
            setIsLoading(false);
        }
    }, [pathname]);

    if (isLoading) {
        return (
            <div style={{
                display: 'flex',
                height: '100vh',
                width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f8fafc'
            }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                    <div style={{
                        height: '32px',
                        width: '32px',
                        borderRadius: '50%',
                        border: '4px solid #e2e8f0',
                        borderTopColor: '#E30613',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <p style={{ fontSize: '14px', fontWeight: 500, color: '#64748b' }}>Verificando credenciais...</p>
                    <style dangerouslySetInnerHTML={{
                        __html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
                </div>
            </div>
        );
    }

    return <>{isAuthorized && children}</>;
}
