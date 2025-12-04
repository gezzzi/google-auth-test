import NextAuth, {
  type Account,
  type NextAuthConfig,
  type Profile,
  type Session,
} from "next-auth";
import Google from "next-auth/providers/google";
import type { JWT } from "next-auth/jwt";

const clientId = process.env.AUTH_GOOGLE_ID;
const clientSecret = process.env.AUTH_GOOGLE_SECRET;
const secret = process.env.NEXTAUTH_SECRET;

if (!clientId || !clientSecret) {
  throw new Error("Missing AUTH_GOOGLE_ID or AUTH_GOOGLE_SECRET environment variable.");
}

if (!secret) {
  throw new Error("Missing NEXTAUTH_SECRET environment variable.");
}

const config = {
  secret,
  trustHost: true,
  providers: [
    Google({
      clientId,
      clientSecret,
      authorization: {
        params: {
          scope: "openid email profile",
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: { token: JWT; account?: Account | null; profile?: Profile }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.idToken = account.id_token;
        token.expiresAt = account.expires_at;
        token.user = {
          name: profile?.name ?? token.name ?? null,
          email: profile?.email ?? token.email ?? null,
          picture:
            (profile as { picture?: string | null } | null)?.picture ??
            (token as { picture?: string | null }).picture ??
            null,
        };
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      const nextSession: Session = {
        ...session,
        user: {
          name: token.user?.name ?? session.user?.name ?? null,
          email: token.user?.email ?? session.user?.email ?? null,
          image: token.user?.picture ?? session.user?.image ?? null,
        },
        accessToken: token.accessToken as string | undefined,
        idToken: token.idToken as string | undefined,
        refreshToken: token.refreshToken as string | undefined,
        expiresAt: token.expiresAt as number | undefined,
      };

      return nextSession;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(config);
