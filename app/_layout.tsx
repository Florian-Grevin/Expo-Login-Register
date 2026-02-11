
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { router, Stack, useSegments } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

function RootLayoutNav() {
  const {user, isLoading} = useAuth();
  const segments = useSegments();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0]?.startsWith("/(auth)");

    if(!user && inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }

  }, [user, isLoading, segments]);

  if(isLoading) {
    return (
      <View style= {{ flex : 1, justifyContent : "center", alignItems : "center" }}>
        <ActivityIndicator size="large" color={"#118397ff"}/>
      </View>
    );
  }

  return (
    <Stack screenOptions={{headerShown : false}}>
      <Stack.Screen name="(auth)"/>
      <Stack.Screen name="(tabs)"/>
    </Stack>
  );
}

export default function RootLayout() {

  return (
    <AuthProvider>
      <RootLayoutNav/>
    </AuthProvider>
  );
}
