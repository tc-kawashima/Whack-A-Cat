import { Stack } from 'expo-router'

const Layout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="auth/Home" />
            <Stack.Screen name="auth/Game" />
        </Stack>
    )
}

export default Layout
