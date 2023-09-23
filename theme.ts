import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(config, {
  fonts: {
    heading: `'Recoleta-Bold', sans-serif`,
    body: `'Inter-Regular', sans-serif`,
  },
});

theme.styles.global = (props: any) => ({
  "html, body": {
    backgroundColor: mode("white", "gray.800")(props),
    color: mode("gray.800", "white")(props),
  },
  a: {
    color: "teal.500",
  },
});

export default theme;
