import { NextAuthOptions, Session } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectToDb from "./db";
import User from "@/models/User";
import { compare } from "bcryptjs";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
        };
    }
}

export const nextAuthOpts: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials : {
                email: { label: "Email", type: "email", placeholder: "Email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                if(!credentials?.email || !credentials.password) {
                    return null
                }

                try {
                    await connectToDb()

                    const user = await User.findOne({ email: credentials.email })

                    if(!user) {
                        throw new Error("User does not exist")
                    }

                    const isValid = await compare(credentials.password, user.password)

                    if(!isValid) {
                        throw new Error("Invalid Credentials")
                    }

                    return {
                        id: user._id.toString(),
                        email: user.email
                    }
                } catch (error) {
                    console.log("Auth Error", error);
                    throw error
                }
            }
        })
    ],
    callbacks : {
        async jwt({ token, user }) {
            if(user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if(session.user) {
                session.user.id = token.id as string
            }
            return session
        }
    },
    pages : {
        signIn: "/login",
        error: "/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}