import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from '@expo/vector-icons/Feather';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client/react";
import { CREATE_POST, GET_POSTS } from "../queries/post";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ProfileContext } from "../contexts/ProfileContext";

export default function CreatePost() {
    const insets = useSafeAreaInsets();
    const [offset, setOffset] = useState(0)
    const [content, setContent] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [tagInput, setTagInput] = useState("");
    const [tags, setTags] = useState([]);
    const navigation = useNavigation()
    const {data: userData} = useContext(ProfileContext)

    const [addPost,{loading}] = useMutation(CREATE_POST, {
        refetchQueries: [{ query: GET_POSTS }],
        onCompleted: () => {
            navigation.navigate("Main", { screen: "Home"})
        }
    })
    
    const addTag = () => {
        if (!tagInput.trim()) return;
        if (tags.includes(tagInput)) return;

        setTags([...tags, tagInput]);
        setTagInput("");
    };

    const removeTag = (tag) => {
        setTags(tags.filter((t) => t !== tag));
    };

    const handleSubmit = async () => {
        try {
            const result = await addPost({
                variables: {
                    content,
                    imgUrl: imgUrl.trim() ? imgUrl : null,
                    tags,
                }
            })

        } catch (error) {
            Alert.alert("Failed to create post", error.message)
        }
    }
    
    useEffect(() => {
        if(insets.top>0) {
            setOffset(insets.top)
        }
     }, [insets.top])

    return (
        <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <KeyboardAvoidingView behavior={"padding"} style={{ flex: 1 }} keyboardVerticalOffset={offset}>
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Feather name="x" size={24} color="white" style={styles.close} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Create post</Text>
                </View>

                <TouchableOpacity
                    style={[
                        styles.postButton,
                        content.length === 0 && styles.disabled,
                    ]}
                    disabled={content.length === 0}
                    onPress={handleSubmit}
                >
                    {loading ? (
                        <ActivityIndicator size="small" color="#F2F2F2" />
                    ) : (
                        <Text style={styles.postText}>Post</Text>
                    )}
                </TouchableOpacity>
            </View>

            <View style={styles.profileRow}>
                <Ionicons name="person-circle-sharp" size={40} color="#aaa" style={styles.avatar} />

                <View>
                    <Text style={styles.name}>{userData?.loggedInUser?.username || "Guest"}</Text>
                    <Text style={styles.visibility}><Fontisto name="world-o" size={10} color="#fff" /> Public</Text>
                </View>
            </View>

            <TextInput
                style={styles.caption}
                placeholder="Share something with your followers..."
                placeholderTextColor="#777"
                multiline
                value={content}
                onChangeText={setContent}
            />

            <TextInput
                style={styles.input}
                placeholder="Image URL (optional)"
                placeholderTextColor="#777"
                value={imgUrl}
                onChangeText={setImgUrl}
            />

            {imgUrl.length > 0 && (
                <Image
                source={{ uri: imgUrl }}
                style={styles.imagePreview}
                />
            )}

            <View style={styles.tagsSection}>
                <Text style={styles.sectionTitle}>Tags</Text>

                <View style={styles.tagsContainer}>
                {tags.map((tag) => (
                    <TouchableOpacity
                    key={tag}
                    style={styles.tag}
                    onPress={() => removeTag(tag)}
                    >
                    <Text style={styles.tagText}>#{tag} ✕</Text>
                    </TouchableOpacity>
                ))}
                </View>

                <View style={styles.tagInputRow}>
                    <TextInput
                        style={styles.tagInput}
                        placeholder="Add tag"
                        placeholderTextColor="#777"
                        value={tagInput}
                        onChangeText={setTagInput}
                        onSubmitEditing={addTag}
                    />

                    <TouchableOpacity onPress={addTag}>
                        <Text style={styles.addTag}>＋</Text>
                    </TouchableOpacity>
                </View>
            </View>

            </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#000",
    },

    container: {
        flex: 1,
        backgroundColor: "#000",
        paddingHorizontal: 16,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 12,
    },

    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
    },

    title: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 12,
    },

    close: { color: "#fff", fontSize: 20 },

    title: { color: "#fff", fontSize: 18, fontWeight: "600" },

    postButton: {
        backgroundColor: "#444",
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 20,
    },

    disabled: { opacity: 0.4 },

    postText: { color: "#fff", fontWeight: "600" },

    profileRow: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 16,
    },

    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: "#333",
        marginRight: 12,
    },

    name: { color: "#fff", fontWeight: "600" },

    visibility: { color: "#aaa", fontSize: 12 },

    caption: {
        color: "#fff",
        fontSize: 16,
        minHeight: 100,
        textAlignVertical: "top",
    },

    input: {
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        color: "#fff",
        paddingVertical: 8,
        marginTop: 16,
    },

    imagePreview: {
        width: "100%",
        height: 200,
        borderRadius: 12,
        marginTop: 12,
        backgroundColor: "#111",
    },

    tagsSection: { marginTop: 20 },

    sectionTitle: {
        color: "#aaa",
        marginBottom: 8,
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

    tagInputRow: {
        flexDirection: "row",
        alignItems: "center",
    },

    tagInput: {
        flex: 1,
        color: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        paddingVertical: 6,
    },

    addTag: {
        color: "#fff",
        fontSize: 22,
        marginLeft: 12,
    },
});