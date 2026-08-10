import { signIn } from "@/auth";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50">
      <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm text-center">
        <h1 className="mb-2 text-2xl font-semibold text-neutral-900">
          Oila Shajarasi
        </h1>
        <p className="mb-8 text-sm text-neutral-500">
          Davom etish uchun Google hisobingiz bilan kiring
        </p>

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/" });
          }}
        >
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50"
          >
            <svg width="18" height="18" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.7-1.57 2.68-3.88 2.68-6.64z"/>
              <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.81.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.71H.96v2.34C2.44 15.98 5.48 18 9 18z"/>
              <path fill="#FBBC05" d="M3.97 10.7c-.18-.54-.28-1.11-.28-1.7s.1-1.16.28-1.7V4.96H.96C.35 6.17 0 7.55 0 9s.35 2.83.96 4.04l3.01-2.34z"/>
              <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.59-2.59C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.34C4.68 5.16 6.66 3.58 9 3.58z"/>
            </svg>
            Google bilan kirish
          </button>
        </form>
      </div>
    </div>
  );
}
