import { ObjectId } from "mongodb";
import database from "../config/mongodb.js";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";

export default class UserModel {
    static collection() {
        return database.collection('users');
    }

    static async create(newUser) {
        let {name, username, email, password} = newUser

        if(!username?.trim()) throw new Error('Username is required');

        if(!email?.trim()) throw new Error('Email is required');

        if(!password?.trim()) throw new Error('Password is required');
        
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if(!emailRegex.test(email)) throw new Error("Invalid email format");
        
        if(password.length < 5) throw new Error("Password length must be at least 5");
       
        const existingUser = await this.collection().findOne({
            $or: [{username}, {email}]
        });
        
        if(existingUser) throw new Error('Username or email already exist')

        password = hashPassword(password)

        await this.collection().insertOne({name, username, email, password})

        return {name, username, email, password}
    }

    static async getUserByUsername(username) {

        const userData = await this.collection().findOne({username})

        return userData
    }

    static async findAll(search = "") {

        const users = await this.collection().find({
            $or : [
                {name: {$regex: search, $options: "i"}},
                {username: {$regex: search, $options: "i"}}
            ]
        }).toArray()

        return users
    }

    static async getUserById(_id) {
        _id = new ObjectId(_id)

        const user = await this.collection().aggregate(
            [
                {
                    '$match': {
                        '_id': _id
                    }
                }, {
                    '$lookup': {
                        'from': 'follows', 
                        'let' : {'userId': '$_id'},
                        'pipeline': [
                            {'$match': { '$expr' : {'$eq': ['$followerId', '$$userId']}}},
                            {
                                '$lookup': {
                                    'from': 'users',
                                    'localField': 'followingId',
                                    'foreignField': '_id',
                                    'as': 'followingUser'
                                }
                            },
                            {'$unwind': '$followingUser'},
                            {
                                '$project': {
                                    '_id': '$followingUser._id',
                                    'name': '$followingUser.name',
                                    'username': '$followingUser.username',
                                    'email': '$followingUser.email'
                                }
                            }
                        ],
                        'as': 'following'
                    }
                }, {
                    '$lookup': {
                        'from': 'follows', 
                        'let' : {'userId': '$_id'},
                        'pipeline': [
                            {'$match': { '$expr' : {'$eq': ['$followingId', '$$userId']}}},
                            {
                                '$lookup': {
                                    'from': 'users',
                                    'localField': 'followerId',
                                    'foreignField': '_id',
                                    'as': 'followerUser'
                                }
                            },
                            {'$unwind': '$followerUser'},
                            {
                                '$project': {
                                    '_id': '$followerUser._id',
                                    'name': '$followerUser.name',
                                    'username': '$followerUser.username',
                                    'email': '$followerUser.email'
                                }
                            }
                        ],
                        'as': 'followers'
                    }
                }, {
                    '$project': {
                        'password': 0
                    }
                }
            ]
        ).next()

        return user
    }
}
