import mongoose, { model, models, Schema } from "mongoose";

export const VIDEO_DEMENSIONS = {
    width: 1080,
    height: 1920
}
export interface IVideo {
    _id? : mongoose.Types.ObjectId;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    controls: boolean;
    ownerId?: mongoose.Types.ObjectId;
    transformation? : {
        width: number;
        height: number;
        quality?: number;
    }
    createdAt?: Date;
    updatedAt?: Date; 
}

const videoSchema = new Schema<IVideo>({
    title: { type: String, required: true},
    description: { type: String, required: true},
    controls : { type: Boolean, default: false},
    thumbnailUrl: { type: String, required: true},
    videoUrl: { type: String, required: true},
    transformation : {
        height: { type: Number, default: VIDEO_DEMENSIONS.height },
        width: { type: Number, default: VIDEO_DEMENSIONS.width },
        quality: { type: Number, min: 1, max: 100 },
    },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true }
},{
    timestamps: true
})

const Video = models?.Video || model<IVideo>('Video', videoSchema)

export default Video