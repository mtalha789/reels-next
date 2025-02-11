import mongoose, { model, models, Schema } from 'mongoose';
import { hash } from 'bcryptjs'

interface IUser {
    _id?: mongoose.Types.ObjectId;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const UserSchema = new Schema<IUser>({
    email: { type: String, required: true, unique: true, },
    password: { type: String, required: true },
},{
    timestamps: true
})

UserSchema.pre('save', async function (next) {
    if(this.isModified("password")){
        this.password = await hash(this.password, 10)
    }
    next();
})

const User = models?.User || model('User', UserSchema)

export default User