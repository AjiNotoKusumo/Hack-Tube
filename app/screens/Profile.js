import React, { useContext, useState } from "react";
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
import Animated, { FadeIn, LinearTransition } from "react-native-reanimated";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { deleteItemAsync } from "expo-secure-store";
import { AuthContext } from "../contexts/AuthContext";
import client from "../config/apollo";

export default function Profile() {
    const {data: userData, loading, refetch} = useContext(ProfileContext)
    const {isSignedIn, setIsSignedIn} = useContext(AuthContext)
    const [activeTab, setActiveTab] = useState("Following");
    const navigation = useNavigation()

    const handleLogout = async () => {
        await deleteItemAsync("accessToken")
        await client.clearStore()
        
        setIsSignedIn(false)
    }

    const followData = activeTab === "Following" ? userData?.loggedInUser?.following : userData?.loggedInUser?.followers;

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

        {/* Top Bar */}
        <View style={styles.topBar}>
            <TouchableOpacity onPress={handleLogout}>
                <Feather name="log-out" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Feather name="search" size={24} color="#fff" style={styles.icon} />
            </TouchableOpacity>
        </View>

        {loading && !userData ? (
            <View style={styles.loading}>
                <ActivityIndicator size="large" color="#4285F4" animating={loading} />
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
                    <View style={styles.avatar}><Text style={styles.avatarText}>{userData?.loggedInUser?.username?.charAt(0)?.toUpperCase() || "A"}</Text></View>

                    <View style={styles.profileMeta}>
                        <Text style={styles.name}>
                            {userData?.loggedInUser?.username}
                        </Text>

                        <Text style={styles.username}>{userData?.loggedInUser?.name ? userData?.loggedInUser?.name : userData?.loggedInUser?.email}</Text>

                        <Text style={styles.stats}>
                            {userData?.loggedInUser?.followers?.length || 0} followers · {userData?.loggedInUser?.following?.length || 0} following
                        </Text>
                    </View>
                    
                    </View>

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
                    renderItem={({ item }) => <UserRow user={item} activeTab={activeTab} />}
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
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
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