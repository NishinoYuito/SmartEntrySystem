import React from "react";
import { Slot, Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerTitle: "Smart Entry System",
      }}
    >
      <Slot />
    </Stack>
  );
}
