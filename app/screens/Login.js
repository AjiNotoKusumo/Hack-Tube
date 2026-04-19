import { useNavigation } from "@react-navigation/native";
import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthContext } from "../contexts/AuthContext";
import { useMutation } from "@apollo/client/react";
import {setItem} from "expo-secure-store"
import { LOGIN } from "../queries/user.js";

export default function Login() {
    const navigation = useNavigation()
    const {setIsSignedIn} = useContext(AuthContext)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [login, {loading}] = useMutation(LOGIN)

    const handleLogin = async () => {
        try {
            const result = await login({
                variables: {
                    username,
                    password
                }
            })

            setItem("accessToken", result.data.login.accessToken)
            
            setUsername("");
            setPassword("");

            setIsSignedIn(true)
        } catch (error) {
            Alert.alert("Login Failed", error.message)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f0f0f" />

        {/* Logo */}
        <View style={styles.logoContainer}>
            <Image
            source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg",
            }}
            style={styles.logo}
            resizeMode="contain"
            />
        </View>

        {/* Content */}
        <View style={styles.content}>
            <Text style={styles.title}>Sign in</Text>
            <Text style={styles.subtitle}>
            to continue to HackTube
            </Text>

            {/* Email Input */}
            <View style={styles.inputWrapper}>
            <TextInput
                placeholder="Username"
                placeholderTextColor="#8a8a8a"
                style={styles.input}
                value={username}
                onChangeText={setUsername}
            />
            </View>

            <View style={styles.inputWrapper}>
            <TextInput
                placeholder="Password"
                placeholderTextColor="#8a8a8a"
                secureTextEntry={true}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
            />
            </View>

            {/* Footer Actions */}
            <View style={styles.footer}>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
                <Text style={styles.learnMore}>Create Account</Text>
            </TouchableOpacity>

            {loading ? (
                <View style={styles.loading}>
                    <ActivityIndicator size="large" color="#3ea6ff" />
                </View>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
            )}
            
            </View>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f0f0f",
    },

    logoContainer: {
        alignItems: "center",
        marginTop: 56,
    },

    logo: {
        width: 120,
        height: 40,
        tintColor: "#ffffff",
    },

    content: {
        paddingHorizontal: 24,
        marginTop: 48,
    },

    title: {
        fontSize: 26,
        fontWeight: "600",
        color: "#ffffff",
    },

    subtitle: {
        fontSize: 14,
        color: "#aaaaaa",
        marginTop: 8,
        marginBottom: 32,
    },

    inputWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: "#3c4043",
        marginBottom: 16,
    },

    input: {
        fontSize: 16,
        paddingVertical: 10,
        color: "#ffffff",
    },

    createAccount: {
        color: "#3ea6ff",
        fontSize: 14,
        marginTop: 12,
    },

    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 48,
    },

    learnMore: {
        color: "#3ea6ff",
        fontSize: 14,
    },

    button: {
        backgroundColor: "#3ea6ff",
        paddingHorizontal: 24,
        paddingVertical: 10,
        borderRadius: 4,
    },

    buttonText: {
        color: "#0f0f0f",
        fontSize: 14,
        fontWeight: "600",
    },

    loading: {
        paddingHorizontal: 24,
        paddingVertical: 10,
    }
});
