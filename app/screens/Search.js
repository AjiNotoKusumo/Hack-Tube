import React, { use, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchItem from "../components/SearchItem";
import { useQuery } from "@apollo/client/react";
import { GET_USERS } from "../queries/user";
import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";

export default function Search() {
    const navigation = useNavigation()
    const [search, setSearch] = useState("")
    const {data, loading, error, refetch} = useQuery(GET_USERS, {
        variables: {
            search,
        },
        skip: search.length === 0,
    })

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

        {/* Search Header */}
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back-sharp" size={24} color="black" style={styles.icon}/>
            </TouchableOpacity>

            <View style={styles.searchBar}>
            <TextInput
                placeholder="Search User"
                placeholderTextColor="#9e9e9e"
                style={styles.input}
                value={search}
                onChangeText={setSearch}
            />
            </View>

            <View style={styles.mic}>
            <Text style={styles.icon}><Feather name="search" size={18} color="#ffffff" /></Text>
            </View>
        </View>
            {loading && !data ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#4285F4" animating={loading} />
                </View>
            ) : (
                search.length === 0 ? (
                    <View style={styles.loading}>
                        <Text style={styles.placeholder}>Search for User and Username</Text>
                    </View>
                ) : (
                    <FlatList
                        data={search.length > 0 ? data?.users : []}
                        keyExtractor={(item) => item._id}
                        renderItem={({ item, index }) => <SearchItem item={item} index={index} refetch={refetch} />}
                    />
                )
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
        paddingHorizontal: 12,
        paddingVertical: 10,
    },

    icon: {
        color: "#fff",
    },

    searchBar: {
        flex: 1,
        backgroundColor: "#222",
        borderRadius: 24,
        paddingHorizontal: 16,
        marginHorizontal: 12,
        height: 40,
        justifyContent: "center",
    },

    input: {
        color: "#fff",
        fontSize: 15,
    },

    mic: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: "#222",
        alignItems: "center",
        justifyContent: "center",
    },

    textContainer: {
        flex: 1,
    },

    placeholder: {
        color: "#9e9e9e",
        fontSize: 15,
    },

    loading: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    }
});