"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export function LoginForm() {

  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard");

  };

  return (

    <form onSubmit={handleLogin}>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        required
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <button type="submit">
        {loading ? "Loading..." : "Login"}
      </button>

      {error && <p>{error}</p>}

    </form>

  );

}