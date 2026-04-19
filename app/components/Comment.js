import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Animated, { FadeInDown, FadeInUp} from "react-native-reanimated";


export default function Comment({ comment }) {
    return (
        <Animated.View entering={FadeInUp.delay(50).duration(200)}>
        <View style={styles.comment}>
        <View style={styles.commentHeader}>
            <Ionicons name="person-circle-sharp" size={27} color="#aaa" style={styles.commentAvatarSmall} />
            <Text style={styles.commentUser}>
            {comment?.username} · {new Date(Number(comment?.createdAt)).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
            </Text>
        </View>

        <Text style={styles.commentText}>{comment?.content}</Text>

        </View>
        </Animated.View>
    );
}

const styles = StyleSheet.create({

    comment: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },

    commentHeader: {
        flexDirection: "row",
        alignItems: "center",
    },

    commentAvatarSmall: {
        borderRadius: 18,
        backgroundColor: "#333",
        marginRight: 8,
    },

    commentUser: {
        color: "#aaa",
        fontSize: 12,
    },

    commentText: {
        color: "#fff",
        fontSize: 14,
        lineHeight: 20,
        marginVertical: 6,
    },
});