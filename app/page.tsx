import { auth, signIn, signOut } from "@/auth";
import Image from "next/image";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-black text-slate-100">
      <div className="mx-auto flex max-w-4xl flex-col gap-10 px-6 py-16">
        <header className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-sm font-medium text-emerald-200/80">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 ring-1 ring-emerald-400/40">
              <Image src="/next.svg" alt="Next.js" width={22} height={22} />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">
                Google OAuth
              </span>
              <span className="text-base text-slate-100">Next.js test bench</span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-semibold tracking-tight">
              Sign in, inspect tokens, repeat.
            </h1>
            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-300">
              Callback: http://localhost:3000/auth/google/callback
            </span>
          </div>
          <p className="text-sm text-slate-300">
            This page wires NextAuth + Google. After consent, you&apos;ll see the profile and
            tokens returned by Google so you can quickly verify scopes and values.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur lg:col-span-2">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.2),transparent_30%),radial-gradient(circle_at_50%_80%,rgba(236,72,153,0.15),transparent_30%)]" />
            <div className="relative flex flex-col gap-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-300/80">
                    Session
                  </p>
                  <h2 className="text-2xl font-semibold">Current state</h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    session
                      ? "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/40"
                      : "bg-white/10 text-slate-200 ring-1 ring-white/20"
                  }`}
                >
                  {session ? "Signed in" : "Signed out"}
                </span>
              </div>

              {session ? (
                <div className="flex flex-col gap-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 shadow-inner">
                    <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                      Profile
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      {user?.image ? (
                        <Image
                          src={user.image}
                          alt={user?.name ?? "User"}
                          width={48}
                          height={48}
                          className="rounded-full border border-white/10"
                        />
                      ) : null}
                      <div className="flex flex-col">
                        <span className="text-lg font-semibold text-white">
                          {user?.name ?? "Unknown user"}
                        </span>
                        <span className="text-sm text-slate-300">
                          {user?.email ?? "No email returned"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 lg:grid-cols-2">
                    <TokenBlock label="Access Token" value={session.accessToken} />
                    <TokenBlock label="ID Token" value={session.idToken} />
                    <TokenBlock label="Refresh Token" value={session.refreshToken} />
                    <TokenBlock
                      label="Expires At (epoch seconds)"
                      value={session.expiresAt?.toString()}
                    />
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/20 bg-slate-900/40 p-6 text-sm text-slate-300">
                  <p className="font-medium text-white">No session yet.</p>
                  <p className="mt-2">
                    Click &ldquo;Sign in with Google&rdquo; to start the OAuth flow. Requested
                    scopes: <code className="rounded bg-black/30 px-2 py-1">openid</code>,{" "}
                    <code className="rounded bg-black/30 px-2 py-1">email</code>,{" "}
                    <code className="rounded bg-black/30 px-2 py-1">profile</code>.
                  </p>
                </div>
              )}
            </div>
          </section>

          <section className="flex h-full flex-col gap-6 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-200 ring-1 ring-emerald-400/40">
                ✓
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Actions</p>
                <p className="text-lg font-semibold">Authenticate</p>
              </div>
            </div>
            {session ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
                className="space-y-3"
              >
                <p className="text-sm text-slate-300">
                  You&apos;re signed in. Sign out to clear the session and try again.
                </p>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-white/15 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:-translate-y-0.5 hover:bg-white/20"
                >
                  Sign out
                </button>
              </form>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await signIn("google", { redirectTo: "/" });
                }}
                className="space-y-3"
              >
                <p className="text-sm text-slate-300">
                  Starts the Google OAuth flow with the configured callback and scopes.
                </p>
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
                >
                  <Image src="/google.svg" alt="Google" width={16} height={16} />
                  Sign in with Google
                </button>
              </form>
            )}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-xs leading-relaxed text-slate-300">
              <p className="font-semibold text-white">Verify in Google Cloud Console</p>
              <ul className="mt-2 space-y-1">
                <li>• Authorized redirect URI: /api/auth/callback/google</li>
                <li>• We also rewrite /auth/google/callback → API route for convenience.</li>
                <li>• Scopes requested: openid, email, profile.</li>
              </ul>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function TokenBlock({
  label,
  value,
}: {
  label: string;
  value: string | undefined;
}) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-slate-200">
      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <pre className="max-h-32 overflow-auto rounded-xl bg-slate-950/70 p-3 text-[11px] leading-relaxed text-emerald-100">
        {value ?? "—"}
      </pre>
    </div>
  );
}
