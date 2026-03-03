import './globals.css';
import Header from '@/components/layout/Header/Header';
import ThreeScene from '@/components/ThreeScene/ThreeScene';
import { SessionExpiredModal } from './SessionExpiredModal';
import { AuthGuard } from './components/AuthGuard';

export const metadata = {
  title: 'Intelligence Core | Data Extraction Platform',
  description: 'Enterprise Data Intelligence Engine for ECAD/SBACEM PDF Analysis',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthGuard>
          <ThreeScene />
          <Header />
          <div className="layout-root">
            {children}
          </div>
          <SessionExpiredModal />
        </AuthGuard>
      </body>
    </html>
  );
}
