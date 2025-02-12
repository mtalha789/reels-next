import connectToDb from "@/lib/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        if(!email || !password) {
            return NextResponse.json({ error: "Missing email or password" }, { status: 400 })
        }
        await connectToDb()

        const existingUser = await User.findOne({ email })

        if(existingUser) {
            return NextResponse.json({ error: 'User Already Exists'}, { status: 400 })
        }

        await User.create({ email, password })

        return NextResponse.json({ message: 'User Registered Successfully'}, { status: 201})
    } catch (error) {
        console.log('Registration Error', error);
        return NextResponse.json({ error:'Error Resgistering User' }, { status: 500 })
    }
}