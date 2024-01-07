import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import Button from "@mui/material/Button"
import { auth } from "../firebase"

export const AppMenuBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Climbing Buddy
          </Typography>
          <Button variant="contained" color="secondary" onClick={() => auth.signOut()}>
            Sign Out
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
