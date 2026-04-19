
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";
import { NavigationContainer } from '@react-navigation/native';
import { ApolloProvider } from "@apollo/client/react";
import RootStack from './navigator/RootStack';
import client from './config/apollo';
import AuthProvider, { AuthContext } from './contexts/AuthContext';
import ProfileProvider from './contexts/ProfileContext';
import { KeyboardProvider } from "react-native-keyboard-controller";

export default function App() {

  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        <ProfileProvider>
          <SafeAreaProvider initialWindowMetrics={initialWindowMetrics}>
            <KeyboardProvider>
            <View style={{flex: 1, backgroundColor: "#0f0f0f"}}> 
              <NavigationContainer >
                <RootStack/>
              </NavigationContainer>
            </View>
            </KeyboardProvider>
          </SafeAreaProvider>
        </ProfileProvider>
      </ApolloProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
