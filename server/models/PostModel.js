import { ObjectId } from "mongodb";
import database from "../config/mongodb.js";

export default class PostModel {
    static collection() {
        return database.collection('posts');
    }

    static async create(newPost) {
        if (!newPost.content) throw new Error('Content is required')
        
        if(!newPost.authorId) throw new Error('Author is required')
        
        newPost.authorId = new ObjectId(newPost.authorId)

        await this.collection().insertOne({
            ...newPost,
            comments: [],
            likes: [],
            createdAt: new Date(),
            updatedAt: new Date()
        })

        return newPost
    }


    static async createComment(postId, content, username) {
        if(!content) throw new Error('Content is required')

        if(!username) throw new Error('Username is required')

        postId = new ObjectId(postId)

        const commentData = {
            content,
            username,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const newComment = await this.collection().updateOne(
            {_id: postId},
            {$push : {comments: commentData}}
        )

        return commentData
    }

    static async createLike(postId, username) {
        if(!username) throw new Error('Username is required')

        postId = new ObjectId(postId)

        const likeExist = await this.collection().findOne({
            _id: postId,
            'likes.username': username
        })

        if (likeExist) {
            await this.collection().updateOne(
                {_id: postId},
                {$pull : {likes: {username}}}
            )
            return;
        }

        const likeData = {
            username,
            createdAt: new Date(),
            updatedAt: new Date()
        }

        const newLike = await this.collection().updateOne(
            {_id: postId},
            {$push : {likes: likeData}}
        )

        return likeData
    }

    static async findAll() {
        const posts = await this.collection().aggregate(
            [
                {
                    '$lookup': {
                        'from': 'users', 
                        'localField': 'authorId', 
                        'foreignField': '_id', 
                        'as': 'author'
                    }
                }, {
                    '$unwind': {
                        'path': '$author', 
                        'preserveNullAndEmptyArrays': true
                    }
                }, {
                    '$sort': {
                        'createdAt': -1
                    }
                }
            ]
        ).toArray()

        return posts
    }

    static async findById(_id) {
        _id = new ObjectId(_id)

        const post = await this.collection().aggregate(
            [
                {
                    '$match': {
                        '_id': _id
                    }
                },
                {
                    '$lookup': {
                        'from': 'users', 
                        'localField': 'authorId', 
                        'foreignField': '_id', 
                        'as': 'author'
                    }
                }, {
                    '$unwind': {
                        'path': '$author', 
                        'preserveNullAndEmptyArrays': true
                    }
                }
            ]
        ).next()

        return post
    }
}  