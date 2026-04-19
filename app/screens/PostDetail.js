import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Comment from "../components/Comment";
import { useMutation, useQuery } from "@apollo/client/react";
import { CREATE_COMMENT, CREATE_LIKE, GET_POST_DETAIL } from "../queries/post";
import Ionicons from '@expo/vector-icons/Ionicons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { ProfileContext } from "../contexts/ProfileContext";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PostDetail({ route }) {
    const insets = useSafeAreaInsets();
    const [offset, setOffset] = useState(0)
    const {postId} = route.params
    const navigation = useNavigation()
    const {data, loading, error, refetch} = useQuery(GET_POST_DETAIL, {
        variables: {
            'id': postId
        },
        fetchPolicy: 'cache-and-network'
    })
    
    const [addLike] = useMutation(CREATE_LIKE)
    const [addComment, { loading: commentLoading }] = useMutation(CREATE_COMMENT)
    const {data: userData, refetch: refetchUserData} = useContext(ProfileContext)
    const [comment, setComment] = useState("")
    const [isLiked, setIsLiked] = useState(data?.postById?.likes?.some(like => like.username === userData?.loggedInUser?.username))

    const handleLike = async () => {
        try {
            const result = await addLike({
                variables: {
                    postId
                }
            })
            setIsLiked((prev) => !prev)
            await refetch()
            await refetchUserData()
        } catch (error) {
            console.log(error.message)
        }
    }

    const handleComment = async () => {
        try {
            const result = await addComment({
                variables: {
                    postId,
                    content: comment,
                }
            })
            setComment("")
            await refetch()
        } catch (error) {
            console.log(error.message)
        }
    }

    useEffect(() => {
        if(insets.top>0) {
            setOffset(insets.top)
        }
    }, [insets.top])

    useEffect(() => {
        setIsLiked(data?.postById?.likes?.some(like => like.username === userData?.loggedInUser?.username))
    }, [data?.postById?.likes, userData?.loggedInUser?.username])


    let commentData = [...(data?.postById?.comments || [])].reverse() || [];

    return (
        <SafeAreaView style={styles.container}>

            {/* Top Bar */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back-sharp" size={24} color="#fff" style={styles.icon}/>
                </TouchableOpacity>
                <Text style={styles.topTitle}>Post</Text>
            </View>

            {loading && !data ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#4285F4" animating={loading} />
                </View>
            ) : (
                <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }} keyboardVerticalOffset={offset}>
                    <Animated.View entering={FadeIn.delay(100).duration(200)}>
                    <Animated.FlatList
                        data={commentData}
                        keyExtractor={(item, index) => item?.createdAt}
                        renderItem={({item}) => <Comment comment={item} />}
                        itemLayoutAnimation={LinearTransition}
                        ListHeaderComponent={
                            <>
                                <View style={styles.postHeader}>
                                    <Ionicons name="person-circle-sharp" size={39} color="#aaa" style={styles.avatar} />
                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.channel}>{data?.postById?.author?.username}</Text>
                                        <Text style={styles.time}>{new Date(Number(data?.postById?.createdAt)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                                    </View>
                                </View>

                                    {/* Post Text */}
                                <Text style={styles.postText}>
                                    {data?.postById?.content}
                                </Text>

                                {data?.postById?.tags?.length > 0 && (
                                    <View style={styles.tagsContainer}>
                                        {data?.postById?.tags?.map((tag) => (
                                        <TouchableOpacity
                                            key={tag}
                                            style={styles.tag}
                                        >
                                            <Text style={styles.tagText}>#{tag}</Text>
                                        </TouchableOpacity>
                                        ))}
                                    </View>
                                )}


                                    {/* Post Image */}
                                {data?.postById?.imgUrl && (
                                    <Image
                                        source={{
                                            uri: data?.postById?.imgUrl,
                                        }}
                                        style={styles.postImage}
                                    />
                                )}
                                {/* Actions */}
                                <View style={styles.actions}>
                                    <TouchableOpacity onPress={handleLike} style={styles.action}>
                                        {isLiked ? (
                                            <Ionicons name="thumbs-up-sharp" size={17} color="white" style={styles.actionIcon} />
                                        ) : (
                                            <SimpleLineIcons name="like" size={17} color="#ffffff" style={styles.actionIcon} />
                                        )}
                                        <Text style={styles.actionText}>{data?.postById?.likes?.length || 0}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Comments Header */}
                                <View style={styles.commentsHeader}>
                                    <Text style={styles.commentsTitle}>Comments {data?.postById?.comments?.length || 0}</Text>
                                </View>

                                {/* Add Comment */}
                                <View style={styles.addComment}>
                                    <View style={styles.commentAvatar}>
                                        <MaterialCommunityIcons name="comment-text-outline" size={15} color="#ffffff" />
                                    </View>

                                    <TextInput
                                        placeholder="Add a comment..."
                                        placeholderTextColor="#888"
                                        style={styles.commentInput}
                                        value={comment}
                                        onChangeText={setComment}
                                    />

                                    <TouchableOpacity onPress={handleComment} style={styles.commentUpload}>
                                        {commentLoading ? (
                                            <ActivityIndicator size="small" color="#F2F2F2" animating={commentLoading} />
                                        ) : (
                                            <AntDesign name="send" size={15} color="#ffffff" />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                
                            </>
                        }
                    />
                    </Animated.View>
                </KeyboardAvoidingView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
    },

    topBar: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
    },

    topTitle: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "500",
        marginLeft: 12,
        flex: 1,
    },

    topActions: {
        flexDirection: "row",
    },

    icon: {
        color: "#fff",
        marginHorizontal: 8,
    },

    postHeader: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },

    channel: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
    },

    time: {
        color: "#aaa",
        fontSize: 12,
    },

    postText: {
        color: "#fff",
        fontSize: 15,
        lineHeight: 22,
        paddingHorizontal: 16,
        marginBottom: 12,
    },

    postImage: {
        width: "100%",
        height: 240,
        backgroundColor: "#222",
    },

    actions: {
        flexDirection: "row",
        padding: 16,
    },

    action: {
        flexDirection: "row",
        alignItems: "center",
        marginRight: 24,
    },

    actionIcon: {
        fontSize: 17,
        marginRight: 6,
    },

    actionText: {
        color: "#aaa",
        fontSize: 13,
    },

    channelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: "#272727",
    },

    subscribers: {
        color: "#aaa",
        fontSize: 12,
    },

    subscribe: {
        color: "#ff0000",
        fontWeight: "600",
        fontSize: 14,
    },

    commentsHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 16,
        borderTopWidth: 1,
        borderColor: "#272727"
    },

    commentsTitle: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "500",
    },

    addComment: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingBottom: 12,
    },

    commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#ff5722",
        justifyContent: "center",
        alignItems: "center",
        marginRight: 12,
    },

    commentUpload: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "#333",
        justifyContent: "center",
        alignItems: "center",
        marginLeft: 12,
    },

    commentInput: {
        color: "#fff",
        flex: 1,
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        paddingVertical: 6,
    },

    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        paddingHorizontal: 16,
    },

    tag: {
        backgroundColor: "#222",
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },

    tagText: { color: "#fff", fontSize: 13 },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});