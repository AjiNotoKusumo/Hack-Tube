import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UserRow from "../components/UserRow";
import { ProfileContext } from "../contexts/ProfileContext";
import { useMutation, useQuery } from "@apollo/client/react";
import { FOLLOW, GET_USER_BY_ID } from "../queries/user";
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Account({route}) {
    const {userId} = route.params;
    const {data: userData, refetch: profileRefetch} = useContext(ProfileContext)
    const navigation = useNavigation()
    
    const {data: userIdData, loading: pageLoading} = useQuery(GET_USER_BY_ID, {
        variables: {
            "id": userId
        },
        fetchPolicy: "cache-and-network"
    })

    const [addFollow, { loading: followLoading }] = useMutation(FOLLOW, {
            variables: {
                'followingId': userId,
            },
            awaitRefetchQueries: true,
            refetchQueries: ['UserById']
    })

    const [isFollowing, setIsFollowing] = useState(userData?.loggedInUser?.following?.some(follow => String(follow._id) === String(userIdData?.userById?._id)))
    
    const [activeTab, setActiveTab] = useState("Following");

    const followData = activeTab === "Following" ? userIdData?.userById?.following : userIdData?.userById?.followers;
    
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
        setIsFollowing(userData?.loggedInUser?.following?.some(follow => String(follow._id) === String(userIdData?.userById?._id)))
    }, [userData?.loggedInUser?.following, userIdData?.userById?._id])

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

        {/* Top Bar */}
        <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-sharp" size={24} color="#fff" style={styles.icon}/>
            </TouchableOpacity>
            <Text style={styles.topTitle}>{userIdData?.userById?.username}</Text>
        </View>

        {pageLoading && !userIdData ? (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#4285F4" animating={pageLoading} />
            </View>
        ) : (
            <>
            <Animated.View entering={FadeIn.delay(100).duration(200)}>
                {/* Banner */}
                <Image
                    source={{ uri: "https://picsum.photos/800/300" }}
                    style={styles.banner}
                />

                {/* Profile Info */}
                <View style={styles.profileHeader}>
                    <View style={styles.avatar}><Text style={styles.avatarText}>{userIdData?.userById?.username?.charAt(0)?.toUpperCase() || "A"}</Text></View>

                    <View style={styles.profileMeta}>
                        <Text style={styles.name}>
                            {userIdData?.userById?.username}
                        </Text>

                        <Text style={styles.username}>{userIdData?.userById?.name ? userIdData?.userById?.name : userIdData?.userById?.email}</Text>

                        <Text style={styles.stats}>
                        {userIdData?.userById?.followers?.length || 0} followers · {userIdData?.userById?.following?.length || 0} following
                        </Text>
                    </View>
                    
                    </View>

                    {userIdData?.userById?._id !== userData?.loggedInUser?._id && (
                        <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
                            {followLoading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <Text style={styles.followText}>{isFollowing ? "Unfollow" : "Follow"}</Text>
                            )}
                        </TouchableOpacity>
                    )}
                {/* Tabs */}
                <View style={styles.tabs}>
                    <Tab
                    label="Following"
                    active={activeTab === "Following"}
                    onPress={() => setActiveTab("Following")}
                    />
                    <Tab
                    label="Followers"
                    active={activeTab === "Followers"}
                    onPress={() => setActiveTab("Followers")}
                    />
                </View>

                {/* List */}
                <Animated.FlatList
                    data={followData}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => <UserRow user={item} />}
                    itemLayoutAnimation={LinearTransition}
                />
                </Animated.View>
            </>
        )}
        </SafeAreaView>
    );
}

function Tab({ label, active, onPress }) {
    return (
        <TouchableOpacity style={styles.tab} onPress={onPress}>
            <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {label}
            </Text>
            {active && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
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

    icon: {
        color: "#fff",
        marginHorizontal: 8,
    },

    banner: {
        width: "100%",
        height: 140,
        backgroundColor: "#222",
    },

    profileHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        marginTop: 12,
    },

    avatar: {
        width: 64,
        height: 64,
        borderRadius: 32,
        marginRight: 12,
        backgroundColor: "#ff5722",
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "350",
    },

    name: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "600",
    },

    verified: {
        color: "#3ea6ff",
        fontSize: 16,
    },

    username: {
        color: "#aaa",
        fontSize: 14,
        marginTop: 2,
    },

    stats: {
        color: "#aaa",
        fontSize: 13,
        marginTop: 4,
    },

    profileMeta: {
        flex: 1,
    },

    bio: {
        color: "#ddd",
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
    },

    followingBtn: {
        marginTop: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 22,
        paddingVertical: 8,
        borderRadius: 20,
    },

    followText: {
        color: "#000",
        fontWeight: "600",
    },

    tabs: {
        flexDirection: "row",
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
        marginTop: 16,
    },

    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 12,
    },

    tabText: {
        color: "#aaa",
        fontSize: 14,
    },

    tabTextActive: {
        color: "#fff",
        fontWeight: "600",
    },

    tabIndicator: {
        position: "absolute",
        bottom: 0,
        height: 2,
        width: "60%",
        backgroundColor: "#fff",
        borderRadius: 2,
    },

    followButton: {
        marginHorizontal: 16,
        marginTop: 12,
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderRadius: 24,
        alignItems: "center",
    },

    followingText: {
        color: "#000",
        fontWeight: "600",
        fontSize: 12,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});