import React from 'react'
import axios from 'axios'
import {Button, Modal} from "react-bootstrap";
import appProps from "../Utils/Properties";
import {TextField} from "@material-ui/core";

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
        % 2 === 0
        && trace.match("^[0-9,a-f,A-F]+$")));

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

    let content =
        <React.Fragment>

          <TextField key={"trace_input"} variant={"outlined"}
                     label={"Hex Trace"}
                     fullWidth={true} value={this.state.traceMsg}
                     error={this.state.errorMessage !== null}
                     onChange={this.traceChanged} rows={20}
                     helperText={this.state.errorMessage}
                     multiline={true}/>

        </React.Fragment>

    return (

        <Modal show={this.state.show}
               onHide={this.closeDialogFail}>
          <Modal.Header closeButton>
            <Modal.Title>Parse Hex Trace</Modal.Title>
          </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeDialogSuccess}
                    disabled={this.state.errorMessage !== null}>
              OK
            </Button>
            <Button variant="secondary" onClick={this.closeDialogFail}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

    );
  }

}