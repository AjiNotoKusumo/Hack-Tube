import { ObjectId } from "mongodb";
import database from "../config/mongodb.js";

export default class FollowModel {
    static collection() {
        return database.collection('follows');
    }

    static async create(followingId, followerId) {
        const followExist = await this.collection().findOne({
            followingId: new ObjectId(followingId),
            followerId: new ObjectId(followerId)
        })

        if (followExist) {
            return await this.collection().deleteOne({
                followingId: new ObjectId(followingId),
                followerId: new ObjectId(followerId)
            })
        }

        const newFollow = {
            followingId: new ObjectId(followingId),
            followerId: new ObjectId(followerId),
            createdAt: new Date(),
            updatedAt: new Date()
        }

        await this.collection().insertOne(newFollow)

        return newFollow
    }
}