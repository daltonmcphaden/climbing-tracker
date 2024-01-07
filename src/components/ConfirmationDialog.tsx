import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"

interface Props {
  dialogTitle: string
  open: boolean
  handleClose: () => void
  handleConfirm: () => void
}

export default function ConfirmationDialog(props: Props) {
  const handleConfirm = () => {
    handleClose()
    props.handleConfirm()
  }

  const handleClose = () => {
    props.handleClose()
  }

  return (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>{props.dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText>Are you sure?</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose} color="error">
          Cancel
        </Button>
        <Button onClick={handleConfirm} color="success">
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
