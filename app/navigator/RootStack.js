import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Tabs from './Tabs';
import Login from '../screens/Login';
import PostDetail from '../screens/PostDetail';
import Search from '../screens/Search';
import Register from '../screens/Register';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import CreatePost from '../screens/CreatePost';
import Account from '../screens/Account';


const Stack = createNativeStackNavigator();

export default function RootStack() {
    const {isSignedIn} = useContext(AuthContext)
  return (
    <Stack.Navigator screenOptions={{headerShown: false, animation: "slide_from_right"}}>
        
        {isSignedIn ? (
            <>
                <Stack.Screen name="Main" component={Tabs} />
                <Stack.Screen name="PostDetail" component={PostDetail} />
                <Stack.Screen name="Search" component={Search} />
                <Stack.Screen name="Create" component={CreatePost} options={{ animation: "slide_from_bottom" }} />
                <Stack.Screen name="Account" component={Account} />
            </>
        ) : (
            <>
                <Stack.Screen name="Login" component={Login} options={{ animationTypeForReplace: 'pop' }}/>
                <Stack.Screen name="Register" component={Register} />
            </>
        )}
        
        
    </Stack.Navigator>
  );
}