import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useMutation } from "@apollo/client/react";
import { CREATE_LIKE } from "../queries/post";
import { ProfileContext } from "../contexts/ProfileContext";

export default function PostCard({ post, index, refetch }) {
    const navigation = useNavigation()

    const [addLike] = useMutation(CREATE_LIKE)
    
    const {data: userData, refetch: refetchUserData} = useContext(ProfileContext)
    const [isLiked, setIsLiked] = useState(post?.likes?.some(like => like.username === userData?.loggedInUser?.username))

    const handleLike = async () => {
        try {
            const result = await addLike({
                variables: {
                    postId: post._id
                }
            })
            setIsLiked((prev) => !prev)
            await refetch()
            await refetchUserData()
        } catch (error) {
            Alert.alert("Failed to like post", error.message)
        }
    }

    return (
        <Animated.View entering={FadeInUp.delay(index * 100).duration(300)}>
            <Pressable onPress={() => navigation.navigate("PostDetail", { postId: post._id })}>
                <View style={styles.card}>
                {/* Header */}
                <View style={styles.header}>
                    <Ionicons name="person-circle-sharp" size={39} color="#aaa" style={styles.avatar} />
                    <View style={{ flex: 1 }}>
                    <Text style={styles.channel}>{post?.author?.username}</Text>
                    <Text style={styles.time}>{new Date(isNaN(Number(post?.createdAt)) ? post?.createdAt : Number(post?.createdAt)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</Text>
                    </View>
                </View>
                
                {/* Post Text */}
                <Text style={styles.text}>{post?.content}</Text>

                    {post?.tags?.length > 0 && (
                        <View style={styles.tagsContainer}>
                            {post?.tags?.map((tag) => (
                            <TouchableOpacity
                                key={tag}
                                style={styles.tag}
                            >
                                <Text style={styles.tagText}>#{tag}</Text>
                            </TouchableOpacity>
                            ))}
                        </View>
                    )}

                {/* Actions */}
                <View style={styles.actions}>
                    <TouchableOpacity style={styles.action} onPress={handleLike}>
                        {isLiked ? (
                            <Ionicons name="thumbs-up-sharp" size={17} color="white" style={styles.actionIcon} />
                        ) : (
                            <SimpleLineIcons name="like" size={17} color="#ffffff" style={styles.actionIcon} />
                        )}
                        <Text style={styles.actionText}> {post?.likes?.length || 0}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.action}>
                    <MaterialCommunityIcons name="comment-text-outline" size={17} color="#ffffff" style={styles.actionIcon} />
                    <Text style={styles.actionText}> {post?.comments?.length || 0}</Text>
                    </TouchableOpacity>
                </View>
                </View>
            </Pressable>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        marginRight: 12,
    },

    channel: {
        color: "#ffffff",
        fontSize: 14,
        fontWeight: "600",
    },

    time: {
        color: "#aaaaaa",
        fontSize: 12,
        marginTop: 2,
    },

    more: {
        color: "#aaaaaa",
        fontSize: 18,
    },
    
    text: {
        color: "#ffffff",
        fontSize: 15,
        lineHeight: 22,
        marginBottom: 12,
    },

    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },

    action: {
        marginRight: 20,
        flexDirection: "row",
        alignItems: "center",
    },

    actionText: {
        color: "#aaaaaa",
        fontSize: 13,
    },

    actionIcon: {
        fontSize: 17,
        marginRight: 6,
    },

    tagsContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
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
});