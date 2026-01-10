import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

export default function _Guidelayout() {
  return (
      <Stack>
        <Stack.Screen
          name="backup"
              options={{
                headerShown: false,
              }}
          />
          
        <Stack.Screen
          name="deleted"
              options={{
                headerShown: false,
              }}
          />

        <Stack.Screen
          name="lists"
              options={{
                headerShown: false,
              }}
          />

          <Stack.Screen
              name="notes"
              options={{
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="tasks"
                options={{
                  headerShown: false,
                }}
          />

          <Stack.Screen
              name="private"
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="security"
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="theme"
              options={{
                  headerShown: false,
              }}
            />
    </Stack>
  )
}