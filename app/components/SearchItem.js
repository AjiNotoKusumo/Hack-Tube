import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import Animated, { FadeIn } from "react-native-reanimated";
import { useContext, useEffect, useState } from "react";
import { ProfileContext } from "../contexts/ProfileContext";
import { FOLLOW } from "../queries/user";
import { useMutation } from "@apollo/client/react";

export default function SearchItem({ item, index }) {
    const [addFollow, { loading }] = useMutation(FOLLOW, {
        variables: {
            'followingId': item._id,
        },
    })
    const {data: userData, refetch: profileRefetch} = useContext(ProfileContext)
    const navigation = useNavigation()
    const [isFollowing, setIsFollowing] = useState(userData?.loggedInUser?.following?.some(follow => String(follow._id) === String(item._id)))

    const handleFollow = async () => {
        try {
            await addFollow()

            setIsFollowing((prev) => !prev)

            await profileRefetch()
        } catch (error) {
            Alert.alert("Follow Failed", error.message)
        }
    }

    useEffect(() => {
        setIsFollowing(userData?.loggedInUser?.following?.some(follow => String(follow._id) === String(item._id)))
    }, [userData?.loggedInUser?.following])

    return (
        <Animated.View entering={FadeIn.delay(50).duration(200)}>
        <TouchableOpacity style={styles.row} onPress={() => navigation.navigate("Account", { userId: item._id })}>
        {/* Left icon */}
        <Ionicons name="person-circle-sharp" size={32} color="#aaa" style={styles.profileIcon} />

        {/* Text */}
        <View style={styles.textContainer}>
            <Text style={styles.searchText}>{item?.username}</Text>

            {item?.name && (
            <View style={styles.newRow}>
                <Text style={styles.name}>{item?.name}</Text>
            </View>
            )}
        </View>

        {/* Fill arrow */}
        {userData?.loggedInUser?._id !== item._id && (
            <TouchableOpacity style={styles.followingBtn} onPress={handleFollow}>
                {loading ? (
                    <ActivityIndicator size="small" color="#000" />
                ) : (
                    <Text style={styles.followingText}>{isFollowing ? "Unfollow" : "Follow"}</Text>
                )}
            </TouchableOpacity>
        )}
        </TouchableOpacity>
        </Animated.View>
    );
}


const styles = StyleSheet.create({

    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    profileIcon: {
        width: 32,
        height: 32,
        borderRadius: 18,
        marginRight: 16,
    },

    textContainer: {
        flex: 1,
    },

    searchText: {
        color: "#fff",
        fontSize: 15,
    },

    newRow: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 4,
    },

    name: {
        color: "#aaa",
        fontSize: 12,
    },

    fillIcon: {
        color: "#aaa",
        fontSize: 16,
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