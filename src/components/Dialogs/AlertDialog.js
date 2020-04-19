import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

export default class AlertDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: props.show};

    this.handleClose = this.handleClose.bind(this);
  }

  handleClose() {
    this.setState({show: false})
    this.props.onClose();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log("smd: componentDidUpdate", this.state);
    if (this.props.show === true && prevState.show === false) {
      this.setState({show: true})
    }
  }

  render() {

    return (<Dialog
        open={this.state.show}
        onClose={this.handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
      <DialogTitle
          id="alert-dialog-title">{"Error"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {this.props.msg}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={this.handleClose} color="primary">
          OK
        </Button>
      </DialogActions>
    </Dialog>);

  }
}