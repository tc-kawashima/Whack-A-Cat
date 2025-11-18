import { Stack } from 'expo-router'

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="auth/home" />
            <Stack.Screen name="auth/game" />
        </Stack>
    )
}

export default Layout
