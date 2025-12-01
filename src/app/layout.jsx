import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
    title: "Erwin's Hospital",
    description: 'Medical Support System',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <AuthProvider>{children}</AuthProvider>
            </body>
        </html>
    );
}
