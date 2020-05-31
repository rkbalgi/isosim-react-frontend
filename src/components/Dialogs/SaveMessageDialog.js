import React from 'react'
import axios from 'axios'
import {Button} from "react-bootstrap";
import appProps from "../Utils/Properties";
import {Checkbox} from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import TCOptionsDialog from "./TCOptionsDialog";

export default class SaveMessageDialog extends React.Component {

    constructor(props) {
        super(props);

        let includeResponse = false;
        if (this.props.responseData != null) {
            includeResponse = true;
        }
        this.state = {
            show: props.show,
            msgName: props.initialMessage,
            updateIfExists: false,
            includeResponse: includeResponse,
            showTCEditDialog: false
        };
        this.closeDialogSuccess = this.closeDialogSuccess.bind(this);
        this.closeDialogFail = this.closeDialogFail.bind(this);
        this.msgNameChanged = this.msgNameChanged.bind(this);
        this.updateIfExistsChanged = this.updateIfExistsChanged.bind(this);
        this.updateIncludeResponseChanged = this.updateIncludeResponseChanged.bind(this);
        this.showTCEditDialog = this.showTCEditDialog.bind(this);
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

        let responseRef = "";
        if (this.state.includeResponse) {
            responseRef = '&response_msg=' + JSON.stringify(this.props.responseData)
        }


        let postData = `specId=${this.props.specId}&msgId=${this.props.msgId}&dsName=${this.state.msgName}&updateMsg=${this.state.updateIfExists}&msg=${JSON.stringify(this.props.data)}${responseRef}`;

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

    updateIncludeResponseChanged(event) {
        this.setState({includeResponse: event.target.checked});
    }

    showTCEditDialog(show) {
        this.setState({showTCEditDialog: show})
    }


    render() {

        let saveAsTest = null;
        // if there is response offer to save that as well to act as a test case
        if (this.props.responseData != null) {
            saveAsTest = <Grid item xs={4}>
                <FormControlLabel
                    control={<Checkbox key={"cb_include_respdata"}
                                       size={"sm"}
                                       checked={this.state.includeResponse}
                                       onChange={this.updateIncludeResponseChanged}/>}
                    label={"Include Response Data (Test Case)"}/>

            </Grid>

        }

        return (
            <div>
                <Dialog open={this.state.show} onClose={this.closeDialogFail}
                        aria-labelledby="form-dialog-title" fullWidth={true} maxWidth={"sm"}>
                    <DialogTitle id="form-dialog-title" onClose={this.closeDialogFail}>Save Message</DialogTitle>
                    <DialogContent>

                        <TCOptionsDialog responseData={this.props.responseData} show={this.state.showTCEditDialog}
                                         onClose={() => this.showTCEditDialog(false)}
                                         onCancel={() => this.showTCEditDialog(false)}/>

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
                                                               size={"small"}
                                                               checked={this.state.updateIfExists}
                                                               onChange={this.updateIfExistsChanged}/>}
                                            label={"Overwrite"}/>

                                    </Grid>
                                    {saveAsTest}
                                </Grid>
                            </Grid>
                        </div>
                    </DialogContent>
                    <DialogActions>
                        {this.state.includeResponse ?
                            <Button onClick={() => this.showTCEditDialog(true)} color="primary">
                                Edit TC Conditions
                            </Button> : null}
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