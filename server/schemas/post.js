import PostModel from "../models/PostModel.js";
import redis from "../config/redis.js";

const typeDefs = `#graphql
  type Post {
    _id: ID
    content: String
    tags: [String]
    imgUrl: String
    authorId: String
    author: User
    comments: [Comment]
    likes: [Like]
    createdAt: String
    updatedAt: String
  }

  type Comment {
    content: String
    username: String
    createdAt: String
    updatedAt: String
  }

  type Like {
    username: String
    createdAt: String 
    updatedAt: String
  }

  type Query {
    posts: [Post]
    postById(_id: ID) : Post
  }

  type Mutation {
    createPost(content: String, tags: [String], imgUrl: String): Post
    createComment(postId: ID, content: String): Comment
    createLike(postId: ID): Like
  }
`;

const resolvers = {
    Query: {
        posts: async (_, __, {auth}) => {
            await auth()
            
            const cachedPosts = await redis.get('posts:all')

            if(cachedPosts) {
                return JSON.parse(cachedPosts)
            }

            const posts = await PostModel.findAll()
            await redis.set('posts:all', JSON.stringify(posts))

            return posts
        },
        postById: async (_, { _id }, {auth}) => {
            await auth()

            const post = await PostModel.findById(_id)

            return post
        }
    },
    Mutation: {
        createPost: async (_, {content, tags, imgUrl}, {auth}) => {
            const payload = await auth()

            const newPost = await PostModel.create({
                content,
                tags,
                imgUrl,
                authorId: payload._id
            })
            
            await redis.del('posts:all')

            return newPost
        },
        createComment: async (_, {postId, content}, {auth}) => {
            const payload = await auth()

            const newComment = await PostModel.createComment(postId, content, payload.username)

            await redis.del('posts:all')

            return newComment
        },
        createLike: async (_, {postId}, {auth}) => {
            const payload = await auth()

            const newLike = await PostModel.createLike(postId, payload.username)

            await redis.del('posts:all')

            return newLike
        }
    }
}

export {typeDefs as postTypeDefs, resolvers as postResolvers}