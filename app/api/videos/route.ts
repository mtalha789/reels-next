import { nextAuthOpts } from "@/lib/auth";
import connectToDb from "@/lib/db";
import Video, { IVideo, VIDEO_DEMENSIONS } from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        await connectToDb()
        const videos = await Video.find({}).sort({createdAt: -1})

        if(!videos || videos.length === 0) {
            return NextResponse.json([], { status: 200 })
        }

        return NextResponse.json(videos, { status: 200 })
    } catch (error) {
        return NextResponse.json({ error: 'Error Fetching Videos' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(nextAuthOpts)

        if(!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body: IVideo = await req.json()

        if(!body.title || !body.description || !body.thumbnailUrl || !body.videoUrl) {
            return NextResponse.json({ error: 'Missing Fields' }, { status: 400 })
        }

        const video = await Video.create({
            ...body,
            controls: body.controls ?? true,
            transformation: {
                height: body.transformation?.height ?? VIDEO_DEMENSIONS.height,
                width: body.transformation?.width ?? VIDEO_DEMENSIONS.width,
                quality: body.transformation?.quality ?? 100
            },
            ownerId: session.user.id
        })

        return NextResponse.json(video, { status: 201 })

        await connectToDb()
    } catch (error) {
        return NextResponse.json({ error: 'Error Creating Video' }, { status: 500 })
    }
}