import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useMutation } from "@apollo/client/react";
import { FOLLOW, GET_PROFILE } from "../queries/user";
import { ProfileContext } from "../contexts/ProfileContext";
import Animated, { FadeIn } from "react-native-reanimated";

export default function UserRow({ user, activeTab }) {
    const [addFollow, { loading }] = useMutation(FOLLOW, {
            variables: {
                'followingId': user._id,
            },
            awaitRefetchQueries: true,
            refetchQueries: [{query: GET_PROFILE}]
    })
    
    const handleFollow = async () => {
        try {
            await addFollow()
        } catch (error) {
            Alert.alert("Follow Failed", error.message)
        }
    }

    return (
        <Animated.View entering={FadeIn.delay(100).duration(200)}>
            <View style={styles.userRow}>
                <Ionicons name="person-circle-sharp" size={40} color="#aaa" style={styles.userAvatar} />

                <View style={{ flex: 1 }}>
                    <Text style={styles.userName}>{user.username}</Text>
                    {user.name && <Text style={styles.userUsername}>{user.name}</Text>}
                </View>


                {activeTab === "Following" && (
                    <TouchableOpacity style={styles.followingBtn} onPress={handleFollow}>
                        {loading ? (
                            <ActivityIndicator size="small" color="#000" />
                        ) : (
                            <Text style={styles.followingText}>Unfollow</Text>
                        )}
                    </TouchableOpacity>
                )}
            </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        padding: 16,
    },

    userAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 12,
    },

    userName: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "500",
    },

    userUsername: {
        color: "#aaa",
        fontSize: 12,
        marginTop: 2,
    },

    followingBtn: {
        marginTop: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 20,
    },

    followingText: {
        color: "#000",
        fontWeight: "600",
        fontSize: 12,
    },
});