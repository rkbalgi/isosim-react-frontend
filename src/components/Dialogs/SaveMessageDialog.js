import React from 'react'
import axios from 'axios'
import {Button, Modal} from "react-bootstrap";
import appProps from "../Utils/Properties";
import {Checkbox} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";

export default class SaveMessageDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      msgName: props.initialMessage,
      "updateIfExists": false
    };
    this.closeDialogSuccess = this.closeDialogSuccess.bind(this);
    this.closeDialogFail = this.closeDialogFail.bind(this);
    this.msgNameChanged = this.msgNameChanged.bind(this);
    this.updateIfExistsChanged = this.updateIfExistsChanged.bind(this);
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
        + '&dataSetName=' + this.state.msgName + '&updateMsg='
        + this.state.updateIfExists + '&msg=' + JSON.stringify(
            this.props.data);

    axios.post(appProps.saveMsgUrl, postData).then(res => {
      console.log(res);
      this.props.msgSaveSuccess(this.state.msgName, this.state.updateIfExists);
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

  updateIfExistsChanged(event) {
    this.setState({updateIfExists: event.target.checked});
  }

  render() {

    return (
        <div>
          <Dialog open={this.state.show} onClose={this.closeDialogFail}
                  aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={"sm"}>
            <DialogTitle id="form-dialog-title" onClose={this.closeDialogFail}>Save Message</DialogTitle>
            <DialogContent>
              <div>
                <Grid container={true} spacing={2}>

                  <Grid container>
                    <Grid item lg={12} xl={12}>
                      <TextField type={"text"} key={"msg_name_save"} margin={"dense"}
                                 fullWidth={true}
                                 variant={"outlined"} label={"Message Name"}
                                 value={this.state.msgName}
                                 onChange={this.msgNameChanged}/>

                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={4}>
                      <FormControlLabel
                          control={<Checkbox key={"key_update_if_exists"}
                                             size={"sm"}
                                             checked={this.state.updateIfExists}
                                             onChange={this.updateIfExistsChanged}/>}
                          label={"Overwrite"}/>

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