import React from 'react'
import axios from 'axios'
import {Button, Modal} from "react-bootstrap";
import appProps from "./Properties";

export default class SaveMessageDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {show: props.show, msgName: ''};
    this.closeDialogSuccess = this.closeDialogSuccess.bind(this);
    this.closeDialogFail = this.closeDialogFail.bind(this);
    this.msgNameChanged = this.msgNameChanged.bind(this);
  }

  msgNameChanged(event) {
    this.setState({errorMessage: '', msgName: event.target.value});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show === true && prevState.show === false) {

      this.setState(
          {show: true, msgName: this.props.msgName});

    }
  }

  closeDialogSuccess() {

    if (!this.state.msgName || this.state.msgName === "" || !this.props.data) {
      this.setState({errorMessage: 'Please specify a message!'});
      return;
    }

    let postData = 'specId=' + this.props.specId + '&msgId=' + this.props.msgId
        + '&dataSetName=' + this.state.msgName + '&msg=' + JSON.stringify(
            this.props.data);
   // console.log(postData);
    axios.post(appProps.saveMsgUrl, postData).then(res => {
      console.log(res);
      this.props.msgSaveSuccess(this.state.msgName);
      this.setState({show: false});

    }).catch(e => {
          this.props.msgSaveFailed(e);
          this.setState({show: false});
        }
    );

  }

  closeDialogFail() {
    this.props.msgSaveCancelled();
    this.setState({show: false});
  }

  render() {

    let content, errorContent;

    if (this.state.show) {

      console.log("before sending", this.props);

      if (this.state.errorMessage) {
        errorContent =
            <div style={{color: 'red'}}>{this.state.errorMessage}</div>
      }

      if (!this.props.msgId || !this.props.specId) {
        content =
            <div>{"Error: Please load a spec/msg, set data before attempting to save"}</div>
      } else {
        content =
            <React.Fragment>
              <label style={{fontFamily: "lato-regular"}}> Message
                Name </label>{'  '}
              <input type={"text"} key={"msg_name_save"}
                     value={this.state.msgName} onChange={this.msgNameChanged}/>
              {errorContent}
            </React.Fragment>
      }
    }

    return (
        <Modal show={this.state.show}
               onHide={this.closeDialogFail}>
          <Modal.Header closeButton>
            <Modal.Title>Save Message</Modal.Title>
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