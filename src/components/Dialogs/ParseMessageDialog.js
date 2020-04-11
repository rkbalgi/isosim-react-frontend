import React from 'react'
import axios from 'axios'
import {Button, Modal} from "react-bootstrap";
import appProps from "../Utils/Properties";

export default class ParseMessageDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: props.show, traceMsg: ''};
    this.closeDialogSuccess = this.closeDialogSuccess.bind(this);
    this.closeDialogFail = this.closeDialogFail.bind(this);
    this.traceChanged = this.traceChanged.bind(this);
  }

  traceChanged(event) {
    this.setState({traceMsg: event.target.value});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log("smd: componentDidUpdate", this.state);
    if (this.props.show === true && prevState.show === false) {
      this.setState({show: true, traceMsg: ''});
    }
  }

  closeDialogSuccess() {
    this.setState({show: false});
    this.props.setTrace(this.state.traceMsg);
  }

  closeDialogFail() {
    this.setState({show: false});
    //TODO:: also tell the parent that we're done
    //and return the value of the selected saved msg
    this.props.setTrace(null);
  }

  render() {

    let content;

    if (this.state.show) {
      if (this.state.errorMessage) {
        content = <div>{this.state.errorMessage}</div>
      } else {
        content =
            <React.Fragment>
              <label
                  style={{fontFamily: "lato-regular"}}> Trace </label>{'  '}

              <textarea key={"trace_input"} value={this.state.traceMsg}
                        onChange={this.traceChanged}
                        style={{fontFamily: "courier new", width: '100%'}}/>


            </React.Fragment>
      }
    }

    return (

        <Modal show={this.state.show}
               onHide={this.closeDialogFail}>
          <Modal.Header closeButton>
            <Modal.Title>Parse Trace</Modal.Title>
          </Modal.Header>
          <Modal.Body>{content}</Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={this.closeDialogSuccess}>
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