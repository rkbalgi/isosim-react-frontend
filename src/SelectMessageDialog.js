import React from 'react'
import axios from 'axios'
import {Button, Modal} from "react-bootstrap";
import appProps from "./Properties";

export default class SelectMessageDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: props.show, selectedMsg: ''};
    this.closeDialogSuccess = this.closeDialogSuccess.bind(this);
    this.closeDialogFail = this.closeDialogFail.bind(this);
    this.selectedMsgChanged = this.selectedMsgChanged.bind(this);
  }

  selectedMsgChanged(event) {
    this.setState({selectedMsg: event.target.value});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    //console.log("smd: componentDidUpdate", this.state);
    if (this.props.show === true && prevState.show === false) {

      axios.get(appProps.loadMsgUrl, {
        params: {
          specId: this.props.specId,
          msgId: this.props.msgId,
        }
      }).then(res => {
        console.log(res);
        this.setState(
            {savedMsgs: res.data, selectedMsg: res.data[0], show: true});

      }).catch(e => {
            //FIXME
            console.log(e);
            this.setState({show: true, errorMessage: e.response.data});
          }
      )
    }
  }

  closeDialogSuccess() {
    this.setState({show: false});
    this.props.closeLoadMsgDialog(this.state.selectedMsg);
  }

  closeDialogFail() {
    this.setState({show: false});
    //TODO:: also tell the parent that we're done
    //and return the value of the selected saved msg
    this.props.closeLoadMsgDialog(null);
  }

  render() {

    let content;

    if (this.state.show) {
      if (this.state.errorMessage) {
        content = <div>{this.state.errorMessage}</div>
      } else {
        content =
            <React.Fragment>
              <label style={{fontFamily: "ptserif-regular"}}> Saved
                Message </label>{'  '}
              <select style={{fontFamily: "ptserif-regular", width: "200px"}}
                      value={this.state.selectedMsg}
                      onChange={this.selectedMsgChanged}>
                {this.state.savedMsgs.map((sm) => {
                  return <option key={sm} value={sm}>{sm}</option>
                })
                }
              </select>
            </React.Fragment>
      }
    }

    return (
        <Modal show={this.state.show}
               onHide={this.closeDialogFail}>
          <Modal.Header closeButton>
            <Modal.Title>Load Saved Message</Modal.Title>
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