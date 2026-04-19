import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import Home from '../screens/Home';
import CreatePost from '../screens/CreatePost';
import Profile from '../screens/Profile';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

export default function Tabs() {
    const navigation = useNavigation()
  return (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            
            tabBarStyle: {
                backgroundColor: "#000",
                borderTopColor: "#222",
                borderTopWidth: 0.5,
            },

            tabBarLabelStyle: {
                fontSize: 11,
                marginBottom: 6,
            },

            tabBarActiveTintColor: "#fff",
            tabBarInactiveTintColor: "#888",

            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === "Home") {
                    iconName = focused ? "home" : "home-outline";
                }  else if (route.name === "Profile") {
                    iconName = focused ? "person" : "person-outline";
                }

                return (
                <Ionicons name={iconName} size={22} color={color} />
                );
            },
        })}
    >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen 
            name="Add" 
            component={View}
            listeners={({navigation}) => ({
                tabPress: (e) => {
                    e.preventDefault();
                    navigation.getParent().navigate("Create")
                }
            })}
            options={{
                tabBarLabel: "",
                tabBarIcon: ({ focused }) => (
                    <View
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 24,
                        backgroundColor: "#222",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop:8
                    }}
                    >
                        <Ionicons name="add" size={24} color="#fff" />
                    </View>
                ),
            }} 
        />
        <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}