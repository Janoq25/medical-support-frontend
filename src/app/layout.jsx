import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';

export const metadata = {
    title: "Erwin's Hospital",
    description: 'Medical Support System',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body>
                <ThemeProvider>
                    <AuthProvider>{children}</AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
