import { comparePassword } from "../helpers/bcrypt.js";
import { signToken } from "../helpers/jwt.js";
import FollowModel from "../models/FollowModel.js";
import UserModel from "../models/UserModel.js";

const typeDefs = `#graphql
  type User {
    _id: ID
    name: String
    username: String
    email: String
    followers: [User]
    following: [User]
  }

  type Follow {
    _id: ID
    followerId: String
    followingId: String
    createdAt: String
    updatedAt: String
  }

  type LoginResponds {
    accessToken: String
  }

  type Query {
    users(search: String): [User]
    userById(_id: ID) : User
    loggedInUser: User
  }

  type Mutation {
    register(name: String, username: String, email: String, password: String): User
    login(username: String, password: String): LoginResponds
    follow(followingId: ID): Follow
  }
`;

const resolvers = {
    Query: {
        users: async (_, {search}, {auth}) => {
            await auth()
            const users = await UserModel.findAll(search)
            return users
        },
        userById: async (_, {_id}, {auth}) => {
            await auth()
            const user = await UserModel.getUserById(_id)
            return user
        },
        loggedInUser: async (_, __, {auth}) => {
            const payload = await auth()
            const user = await UserModel.getUserById(payload._id)
            return user
        }
    },
    Mutation: {
        register: async (_, {name, username, email, password}) => {
            const newUser = {name, username, email, password}
            const user = await UserModel.create(newUser)

            return user
        },
        login: async (_, {username, password}) => {
            if(!username || !password) throw new Error('Please fill username and password')

            const userData = await UserModel.getUserByUsername(username)

            if(!userData) throw new Error('Invalid username or password')

            if(!comparePassword(password, userData.password)) throw new Error('Invalid username or password')

            const payload = {
                _id: userData._id,
                username: userData.username,
                email: userData.email
            }

            const loginResponds = {
                accessToken: signToken(payload)
            }

            return loginResponds
        },
        follow: async (_, {followingId}, {auth}) => {
            const payload = await auth()

            const newFollow = await FollowModel.create(followingId, payload._id)
            return newFollow
        }
    }
}

export {typeDefs as userTypeDefs, resolvers as userResolvers}