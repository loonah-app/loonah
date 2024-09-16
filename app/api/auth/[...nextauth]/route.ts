import { connectToDB } from "@/db/connection";
import User from "@/db/models/User";
import NextAuth, { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"

export const authOptions: NextAuthOptions = {
    providers: [
        GithubProvider({
            clientId: process.env.NEXT_PUBLIC_GITHUB_ID!,
            clientSecret: process.env.NEXT_PUBLIC_GITHUB_SECRET!,
            authorization: {
                params: {
                    scope: 'repo'
                }
            }
        }),
    ],
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    jwt: {
        secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET
    },
    callbacks: {
        async session({ session, token }) {
            session.accessToken = token.accessToken as string;
            session.userId = token.userId as string; // Add MongoDB user ID to session
            return session;
        },
        async jwt({ token, account, user }) {
            if (account) {
                token.accessToken = account.access_token;
            }

            if (user) {
                await connectToDB();
                const existingUser = await User.findOne({ githubId: account?.providerAccountId });
                if (existingUser) {
                    token.userId = existingUser._id.toString(); // Store MongoDB user ID in token
                }
            }

            return token;
        },
        async signIn({ user, account, profile }) {
            await connectToDB();

            const existingUser = await User.findOne({ githubId: account?.providerAccountId });

            if (!existingUser) {
                await User.create({
                    name: profile?.name || user.name,
                    email: user.email,
                    image: user.image,
                    githubId: account?.providerAccountId,
                });
            }

            return true;
        },
        async redirect({ baseUrl }) {
            return `${baseUrl}/app/projects`
        },
    },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }