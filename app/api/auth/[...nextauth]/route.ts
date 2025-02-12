import { nextAuthOpts } from "@/lib/auth";
import NextAuth from "next-auth";

const handler = NextAuth(nextAuthOpts);

export { handler as GET, handler as POST };