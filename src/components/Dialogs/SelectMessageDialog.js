import React from 'react'
import axios from 'axios'
import {Button} from "react-bootstrap";
import appProps from "../Utils/Properties";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import MenuItem from "@material-ui/core/MenuItem";

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
        // console.log(res);
        this.setState(
            {
              savedMsgs: res.data.saved_messages,
              selectedMsg: res.data.saved_messages[0],
              show: true
            });

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

              <TextField type={"text"} key={"msg_name_save"}
                         margin={"dense"}
                         fullWidth={true} select={true}
                         variant={"outlined"} label={"Saved Message"}
                         value={this.state.selectedMsg}
                         onChange={this.selectedMsgChanged}>


                {this.state.savedMsgs.map((sm) => {
                  return <MenuItem key={sm} value={sm}>{sm}</MenuItem>
                })
                }
              </TextField>
            </React.Fragment>;
      }
    }

    return (

        <div>
          <Dialog open={this.state.show} onClose={this.closeDialogFail}
                  aria-labelledby="form-dialog-title" fullWidth={true}
                  maxWidth={"sm"}>
            <DialogTitle id="form-dialog-title" onClose={this.closeDialogFail}>Select
              Message</DialogTitle>
            <DialogContent>
              <div>
                <Grid container={true} spacing={2}>

                  <Grid container>
                    <Grid item lg={12} xl={12}>
                      {content}
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


        /*<Modal show={this.state.show}
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
        </Modal>*/

    );
  }

}