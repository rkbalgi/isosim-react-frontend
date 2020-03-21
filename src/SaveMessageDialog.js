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
    this.setState({msgName: event.target.value});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.props.show === true && prevState.show === false) {

      this.setState(
          {show: true, msgName: this.props.msgName});

    }
  }

  closeDialogSuccess() {

    axios.post(appProps.saveMsgUrl, {
      params: {
        specId: this.props.specId,
        msgId: this.props.msgId,
        dataSetName: this.state.msgName,
        msg: this.props.data
      }
    }).then(res => {
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

    let content;

    if (this.state.show) {
      if (this.state.errorMessage) {
        content = <div>{this.state.errorMessage}</div>
      } else {
        content =
            <React.Fragment>
              <label style={{fontFamily: "ptserif-regular"}}> Message
                Name </label>{'  '}
              <input type={"text"} key={"msg_name_save"}
                     value={this.state.msgName} onChange={this.msgNameChanged}/>
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