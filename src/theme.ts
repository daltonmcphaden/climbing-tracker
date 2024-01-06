import { ThemeOptions, createTheme } from "@mui/material"

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      danger: string
    }
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    status?: {
      danger?: string
    }
  }
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: "light",
    primary: {
      main: "#e47723",
    },
    secondary: {
      main: "#1272e2",
    },
  },
}

export const theme = createTheme(themeOptions)
