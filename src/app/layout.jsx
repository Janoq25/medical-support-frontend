import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ToastProvider } from '@/context/ToastContext';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({ 
    subsets: ['latin'],
    weight: ['400', '500', '600', '700'],
    variable: '--font-montserrat',
})

export const metadata = {
    title: "Erwin's Hospital",
    description: 'Medical Support System',
};

export default function RootLayout({ children }) {
    return (
        <html lang="es">
            <body className={montserrat.variable}>
                <ThemeProvider>
                    <ToastProvider>
                        <AuthProvider>{children}</AuthProvider>
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
