import './config/loadEnv.js';
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { userResolvers, userTypeDefs } from './schemas/user.js';
import { postResolvers, postTypeDefs } from './schemas/post.js';
import { verifyToken } from './helpers/jwt.js';
import UserModel from './models/UserModel.js';

const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs],
    resolvers: [userResolvers, postResolvers],
    introspection: true,
});


const { url } = await startStandaloneServer(server, {
  listen: { port: process.env.PORT || 3000 },
  context: ({req}) => {
    return {
        auth: async () => {
            const authHeader = req.headers.authorization || ''

            if (!authHeader) throw new Error('Please login first')

            const [type, accessToken] = authHeader.split(' ')

            if (type !== 'Bearer' || !accessToken) throw new Error('Please login first')

            try {
                const payload = verifyToken(accessToken)

                const user = await UserModel.getUserById(payload._id)

                if (!user) throw new Error('User not found')

                return user
            } catch (error) {
                throw new Error('Invalid token')
            }
        }
    }
    
  }
});

console.log(`🚀  Server ready at: ${url}`);