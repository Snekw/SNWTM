import mongoose, { Schema, Model } from "mongoose";
import { v4 as uuidV4 } from "uuid";
import { generate } from "short-uuid";
export interface User {
    _id: string
    map: string
    token: string
    viewToken: string
    texts: [string]
    expireAt: Date | null
}

export type UserModel = Model<User>

const userSchema = new Schema<User, UserModel>({
    _id: {
        type: String, required: true, default: uuidV4
    },
    map: {
        type: String
    },
    token: {
        type: String, required: true, default: uuidV4
    },
    viewToken: {
        type: String, required: true, default: generate
    },
    texts: {
        type: [String], required: true
    },
    expireAt: {
        type: Date, expires: 0, default: () => new Date(Date.now() + 1000 * 60 * 60 * 24)
    }
})

export const UserModel = mongoose.models.User || mongoose.model<User, UserModel>('User', userSchema)
