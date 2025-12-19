import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-nunito',
});
import { ToastProvider } from '@/context/ToastContext';

export const metadata = {
    title: "Erwin's Hospital",
    description: 'Medical Support System',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className={`${nunito.variable} font-sans`}>
                <ThemeProvider>
                    <ToastProvider>
                        <AuthProvider>{children}</AuthProvider>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
