import { StatusBar } from "expo-status-bar";
import { useWindowDimensions, SafeAreaView } from "react-native";
import Welcome from "./Screens/Welcome";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { GluestackProvider } from '@gluestack/ui';
// import { theme } from '@gluestack-ui/themed';

const Stack = createNativeStackNavigator();

export default function App() {
  const { height, width } = useWindowDimensions();

  return (
    // <GluestackProvider theme={theme}>
    <SafeAreaView style={styles.container}>
      <StatusBar />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Welcome"
            component={Welcome}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
    // </GluestackProvider>
  );
}

const styles = {
  container: {
    flex: 1
  },
};
