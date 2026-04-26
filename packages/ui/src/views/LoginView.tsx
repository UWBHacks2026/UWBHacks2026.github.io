"use client"; // Required if consuming directly in Next.js App Router

import { useState } from "react";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";

function Field({ id, label, type = "text", placeholder, error, value, onChange, onSubmit }: any) {
  return (
    <div className="mb-4.5">
      <label htmlFor={id} className="block text-[13px] font-medium text-[#57534E] mb-1.5">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        className={`h-11 bg-brand-card border ${error ? "border-brand-orange" : "border-brand-border"} shadow-none`}
      />
      {error && (
        <p className="mt-1 text-xs text-brand-orange">{error}</p>
      )}
    </div>
  );
}

export function LoginPage({ onLogin }: { onLogin: (user: any) => void }) {
  const [mode, setMode] = useState("signin");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs: any = {};
    if (mode === "signup" && !form.name.trim()) errs.name = "Name is required";
    if (!form.email.includes("@")) errs.email = "Enter a valid email";
    if (form.password.length < 6) errs.password = "At least 6 characters";
    if (mode === "signup" && form.password !== form.confirm) errs.confirm = "Passwords do not match";
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    setTimeout(() => {
      onLogin({
        name: mode === "signup" ? form.name : form.email.split("@")[0],
        email: form.email,
        password: form.password,
        mode,
      });

      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col md:flex-row">
      {/* LEFT PANEL - Hidden on mobile */}
      <div className="hidden md:flex flex-1 flex-col justify-between p-12 lg:p-14 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -bottom-30 -left-20 w-[420px] h-[420px] rounded-full bg-brand-green/10 border border-brand-green/20" />
        <div className="absolute top-20 -right-15 w-[240px] h-[240px] rounded-full bg-brand-gold/5 border border-brand-gold/20" />

        <div className="flex items-center gap-2.5 z-10">
          <div className="w-9 h-9 bg-brand-green rounded-xl" />
          <span className="font-serif text-[22px] text-brand-bg">Skill Bridge</span>
        </div>

        <div className="z-10 max-w-lg">
          <p className="text-[11px] font-bold text-brand-gold tracking-widest uppercase mb-5">
            Your next opportunity begins here
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-brand-bg leading-tight">
            Every person deserves a <em className="text-brand-green not-italic"> chance</em> to thrive.
          </h1>
        </div>
      </div>

      {/* RIGHT PANEL - Form */}
      <div className="w-full md:max-w-md lg:max-w-[480px] bg-brand-bg flex flex-col justify-center px-6 py-12 md:p-12 shrink-0 min-h-screen md:min-h-0">
        
        {/* Mobile Logo (Only visible on small screens) */}
        <div className="md:hidden flex items-center gap-2.5 mb-10">
          <div className="w-8 h-8 bg-brand-green rounded-lg" />
          <span className="font-serif text-xl text-text-main">Skill Bridge</span>
        </div>

        {/* Toggle */}
        <div className="flex bg-[#EDE8DF] rounded-xl p-1 mb-8">
          {["signin", "signup"].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setErrors({}); }}
              className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${
                mode === m ? "bg-brand-card text-text-main font-semibold shadow-sm" : "text-text-muted hover:text-text-main"
              }`}
            >
              {m === "signin" ? "Sign In" : "Create Account"}
            </button>
          ))}
        </div>

        {/* Form */}
        {mode === "signup" && (
          <Field id="name" label="Full Name" placeholder="Your full name" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} onSubmit={handleSubmit} error={errors.name} />
        )}
        <Field id="email" label="Email Address" type="email" placeholder="you@email.com" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} onSubmit={handleSubmit} error={errors.email} />
        <Field id="password" label="Password" type="password" placeholder="••••••••" value={form.password} onChange={(e: any) => setForm({ ...form, password: e.target.value })} onSubmit={handleSubmit} error={errors.password} />
        {mode === "signup" && (
          <Field id="confirm" label="Confirm Password" type="password" placeholder="••••••••" value={form.confirm} onChange={(e: any) => setForm({ ...form, confirm: e.target.value })} onSubmit={handleSubmit} error={errors.confirm} />
        )}

        <Button onClick={handleSubmit} disabled={loading} className="w-full py-3.5 mt-2 text-base">
          {loading ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
        </Button>
      </div>
    </div>
  );
}