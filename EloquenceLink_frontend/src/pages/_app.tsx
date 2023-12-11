
import "@/styles/globals.css";

import { useState } from "react";
import type { AppProps } from "next/app";
import {
  MantineProvider,
  ColorSchemeProvider,
  ColorScheme,
} from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { UserProvider } from "@/contexts/UserContext"; // 引入我们之前创建的UserProvider

export default function App({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
  const toggleColorScheme = (value?: ColorScheme) => {
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  };

  return (
    <UserProvider> {/* 添加 UserProvider */}
      <ColorSchemeProvider
        colorScheme={colorScheme}
        toggleColorScheme={toggleColorScheme}
      >
        <MantineProvider
          theme={{ colorScheme, primaryColor: "green" }}
          withNormalizeCSS
          withGlobalStyles
        >
          <Notifications position="top-right" zIndex={2077}></Notifications>
          <Component {...pageProps} />
        </MantineProvider>
      </ColorSchemeProvider>
    </UserProvider>
  );
}
