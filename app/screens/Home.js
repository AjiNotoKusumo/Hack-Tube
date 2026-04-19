import React, { useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import PostCard from "../components/PostCard.js";
import ImageCard from "../components/ImageCard.js";
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "@apollo/client/react";
import { GET_POSTS } from "../queries/post.js"
import Animated, { LinearTransition } from "react-native-reanimated";
import splash from "../assets/splash-v3-icon.png"

export default function Home({route}) {
    const navigation = useNavigation()
    const {data, loading, error, refetch} = useQuery(GET_POSTS, {
        fetchPolicy: "cache-and-network"
    })

    return (
        <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>

            {/* Top Bar */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <Image source={splash} style={styles.logoImage} />
                    <Text style={styles.logo}>HackTube</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                    <Text style={styles.icon}><Feather name="search" size={24} color="#ffffff" /></Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Feed */}
            {loading && !data ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#4285F4" animating={loading} />
                </View>
            ) : (
                <Animated.FlatList
                    data={data?.posts || []}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item, index }) => item?.imgUrl ? <ImageCard post={item} index={index} refetch={refetch} /> : <PostCard post={item} index={index} refetch={refetch} />}
                    itemLayoutAnimation={LinearTransition} 
                />
            )}
        
        
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#272727",
    },

    logoContainer: {
        flexDirection: "row",
        alignItems: "center",
    },

    logo: {
        color: "#ffffff",
        fontSize: 20,
        fontWeight: "700",
    },

    logoImage: {
        width: 30,
        height: 30,
    },

    headerIcons: {
        flexDirection: "row",
        alignItems: "center",
    },

    icon: {
        color: "#ffffff",
        fontSize: 18,
        marginRight: 16,
    },

    profile: {
        width: 28,
        height: 28,
        borderRadius: 14,
    },
    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});