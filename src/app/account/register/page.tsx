"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/auth-provider";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("Wypełnij wszystkie pola.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Hasła nie są takie same.");
      return;
    }
    if (password.length < 6) {
      setError("Hasło musi mieć co najmniej 6 znaków.");
      return;
    }

    await register({ email, password, firstName, lastName });
    router.push("/account");
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">Strona główna</Link>
        <span className="mx-1.5">/</span>
        <Link href="/account" className="hover:text-charcoal transition-colors">Konto</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Załóż konto</span>
      </nav>

      <h1 className="text-2xl font-light text-charcoal mb-8 text-center">Załóż konto</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p className="text-red-600 text-[13px] text-center">{error}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5">
              Imię
            </label>
            <input
              id="firstName"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5">
              Nazwisko
            </label>
            <input
              id="lastName"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
            />
          </div>
        </div>
        <div>
          <label htmlFor="email" className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
            placeholder="ty@przyklad.pl"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5">
            Hasło
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
            placeholder="Co najmniej 6 znaków"
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-[11px] font-medium uppercase tracking-[0.8px] text-charcoal mb-1.5">
            Potwierdź hasło
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-black/15 rounded px-3 py-2.5 text-[14px] text-charcoal outline-none focus:border-charcoal transition-colors"
          />
        </div>
        <button type="submit" className="btn-cta w-full text-[12px]">
          UTWÓRZ KONTO
        </button>
      </form>

      <p className="text-center text-[13px] text-warm-gray mt-8">
        Masz już konto?{" "}
        <Link href="/account/login" className="text-charcoal underline hover:opacity-60 transition-opacity">
          Zaloguj się
        </Link>
      </p>
    </div>
  );
}
