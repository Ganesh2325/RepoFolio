import { NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    ...(process.env.GITHUB_ID && process.env.GITHUB_SECRET
      ? [
          GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
            profile(profile) {
              return {
                id: profile.id.toString(),
                name: profile.name || profile.login,
                email: profile.email || `${profile.login}@users.noreply.github.com`,
                image: profile.avatar_url,
                github_username: profile.login,
              };
            },
          }),
        ]
      : []),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    // Instant One-Click Demo & Guest login provider
    CredentialsProvider({
      id: "guest-login",
      name: "Demo / Guest Access",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "demo@repofolio.dev" },
        name: { label: "Display Name", type: "text", placeholder: "Alex Rivers" },
        github_username: { label: "GitHub Username", type: "text", placeholder: "alexrivers" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim().toLowerCase() || "demo.builder@repofolio.dev";
        const name = credentials?.name?.trim() || "Alex Rivers (Demo Builder)";
        const githubUsername = credentials?.github_username?.trim() || "alexrivers-dev";

        // Find or create the user in the database
        let user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              name,
              avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(githubUsername)}`,
              github_username: githubUsername,
            },
          });
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.avatar_url,
          github_username: user.github_username,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user.email) return false;

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        const githubUsername =
          (profile as { login?: string })?.login ||
          (user as { github_username?: string })?.github_username ||
          null;

        if (!existingUser) {
          const newUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "RepoFolio Developer",
              avatar_url: user.image || null,
              github_username: githubUsername,
            },
          });
          user.id = newUser.id;
        } else {
          user.id = existingUser.id;
          if (githubUsername && !existingUser.github_username) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { github_username: githubUsername },
            });
          }
        }
        return true;
      } catch (err) {
        console.error("Error in NextAuth signIn callback:", err);
        return true; // Still allow session creation
      }
    },
    async session({ session, token }) {
      if (session?.user && token?.sub) {
        // Ensure user ID is the Prisma User ID
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: session.user.email || "" },
          });
          if (dbUser) {
            (session.user as { id?: string }).id = dbUser.id;
            (session.user as { github_username?: string | null }).github_username =
              dbUser.github_username;
          } else {
            (session.user as { id?: string }).id = token.sub;
          }
        } catch {
          (session.user as { id?: string }).id = token.sub;
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "repofolio-default-dev-secret-key-32-chars",
};
