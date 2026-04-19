import { gql } from "@apollo/client";

//mutations
export const LOGIN = gql`
    mutation Login($username: String, $password: String) {
        login(username: $username, password: $password) {
            accessToken
        }
    }
`

export const REGISTER = gql`
    mutation Register($name: String, $username: String, $email: String, $password: String) {
        register(name: $name, username: $username, email: $email, password: $password) {
            email
            name
            username
        }
    }
`

export const FOLLOW = gql`
    mutation Follow($followingId: ID) {
        follow(followingId: $followingId) {
            _id
            followerId
            followingId
            createdAt
        }
    }
`

//queries
export const GET_USERS = gql`
    query Users($search: String) {
        users(search: $search) {
            _id
            name
            username
        }
    }
`

export const GET_PROFILE = gql`
    query LoggedInUser {
        loggedInUser {
            _id
            email
            name
            username
            followers {
                _id
                name
                username
            }
            following {
                _id
                name
                username
            }
        }
    }
`

export const GET_USER_BY_ID = gql`
    query UserById($id: ID) {
        userById(_id: $id) {
            _id
            email
            name
            username
            followers {
                name
                username
                _id
            }
            following {
                name
                username
                _id
            }
        }
    }
`
