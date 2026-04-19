import { gql } from "@apollo/client";

//queries
export const GET_POSTS = gql`
    query Posts {
        posts {
            _id
            content
            tags
            imgUrl
            comments {
                content
            }
            likes {
                username
            }
            createdAt
            author {
                username
            }
        }
    }
`

export const GET_POST_DETAIL = gql`
    query PostById($id: ID) {
        postById(_id: $id) {
            _id
            content
            tags
            imgUrl
            comments {
                content
                createdAt
                username
            }
            likes {
                createdAt
                username
            }
            createdAt
            author {
                name
                username
            }
        }
    }
`

//mutations
export const CREATE_POST = gql`
    mutation CreatePost($content: String, $tags: [String], $imgUrl: String) {
        createPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
            _id
            authorId
            createdAt
        }
    }
`


export const CREATE_LIKE = gql`
    mutation CreateLike($postId: ID) {
        createLike(postId: $postId) {
            createdAt
            updatedAt
            username
        }
    }
`

export const CREATE_COMMENT = gql`
    mutation Mutation($postId: ID, $content: String) {
        createComment(postId: $postId, content: $content) {
            content
            createdAt
            username
        }
    }
`