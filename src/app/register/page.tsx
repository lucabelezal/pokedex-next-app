import { AuthPage } from "@/components/auth-page";

export const dynamic = "force-static";

export default function CadastroPage() {
  return <AuthPage mode="register" />;
}
