import AuthLayout from "@/components/layout/AuthLayout";
import RegisterForm from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <AuthLayout>
            <RegisterForm />
        </AuthLayout>
    );
}
