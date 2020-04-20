import React from 'react'
import {Button} from "react-bootstrap";
import {TextField} from "@material-ui/core";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";

export default class ParseMessageDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: props.show, traceMsg: '', errorMessage: null};
    this.closeDialogSuccess = this.closeDialogSuccess.bind(this);
    this.closeDialogFail = this.closeDialogFail.bind(this);
    this.traceChanged = this.traceChanged.bind(this);
    this.isValidTrace = this.isValidTrace.bind(this);
  }

  isValidTrace(trace) {
    return !!(trace.trim() !== "" && (trace.length
        % 2 === 0 && trace.match("^[0-9,a-f,A-F]+$")));

  }

  traceChanged(event) {

    let updatedTrace = event.target.value;

    if (!this.isValidTrace(updatedTrace)) {
      this.setState({
        traceMsg: updatedTrace,
        errorMessage: "Input is not valid hex"
      });
    } else {
      this.setState({traceMsg: updatedTrace, errorMessage: null});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if (this.props.show === true && prevState.show === false) {
      this.setState({show: true, traceMsg: ''});
    }
  }

  closeDialogSuccess() {
    if (this.isValidTrace(this.state.traceMsg)) {
      this.setState({show: false})
      this.props.setTrace(this.state.traceMsg);
    }
  }

  closeDialogFail() {
    this.setState({show: false});
    this.props.setTrace(null);
  }

  render() {

    return (

        <div>
          <Dialog open={this.state.show} onClose={this.closeDialogFail}
                  aria-labelledby="form-dialog-title" fullWidth={true}
                  maxWidth={"md"}>
            <DialogTitle id="form-dialog-title" onClose={this.closeDialogFail}>Parse
              Trace</DialogTitle>
            <DialogContent>
              <div>
                <Grid container={true} spacing={2}>

                  <Grid container>
                    <Grid item lg={12} xl={12}>
                      <TextField key={"trace_input"} variant={"outlined"}
                                 label={"Hex Trace"} margin={"dense"}
                                 fullWidth={true} value={this.state.traceMsg}
                                 error={this.state.errorMessage !== null}
                                 onChange={this.traceChanged} rows={10}
                                 helperText={this.state.errorMessage}
                                 multiline={true}/>

                    </Grid>
                  </Grid>

                </Grid>
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeDialogSuccess} color="primary">
                OK
              </Button>
              <Button onClick={this.closeDialogFail} color="primary">
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </div>

    );
  }

}