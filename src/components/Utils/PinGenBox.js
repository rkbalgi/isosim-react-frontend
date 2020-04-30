import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import React from "react";
import Box from "@material-ui/core/Box";

import axios from "axios";
import appProps from "./Properties";
import AlertDialog from "../Dialogs/AlertDialog";

export default class PinGenBox extends React.Component {

    field;
    from = 0;
    to = 0;
    panID = 0;

    constructor(props) {
        super(props);

        this.field = this.props.field;

        let initialPan = "";
        let pinGenProps = this.field.PinGenProps;

        if (this.field.PinGenProps.PANFieldID !== 0) {
            this.panID = this.field.PinGenProps.PANFieldID;
        }

        if (pinGenProps.PANFieldID !== 0 && pinGenProps.PANExtractParams !== ""
            && pinGenProps.PANExtractParams.match("[0-9]+:[0-9]+")) {

            [this.from, this.to] = pinGenProps.PANExtractParams.split(":");

        }

        let originalPan = "";
        if (this.props.isoMsg) {
            let panField = this.props.isoMsg.get(this.panID);
            if (panField) {
                originalPan = panField.state.fieldValue;
                initialPan = originalPan;

                if (this.from >= 0 && this.to > this.from) {
                    initialPan = panField.state.fieldValue.substring(this.from, this.to);
                }
            }
        } else {
            this.state = {pinFormat: "ISO0", pan: initialPan, clearPin: "", pinKey: ""}
        }

        if (this.field.GenType === 'pin_gen') {
            this.state = {
                pinFormat: this.field.PinGenProps.PINFormat,
                pan: initialPan,
                originalPan: originalPan,
                clearPin: this.field.PinGenProps.PINClear,
                pinKey: this.field.PinGenProps.PINKey,
                hasError: false,
                errorMsg: null
            }
        }

        this.generatePinBlock = this.generatePinBlock.bind(this);
        this.panValueChanged = this.panValueChanged.bind(this);
        this.formatChanged = this.formatChanged.bind(this);
        this.keyValueChanged = this.keyValueChanged.bind(this);
        this.pinValueChanged = this.pinValueChanged.bind(this);
        this.doNothing = this.doNothing.bind(this);

    }

    doNothing() {
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (!this.props.isoMsg) {
            return
        }

        let tmp = this.props.isoMsg.get(this.panID);
        if (tmp) {

            if (this.state.originalPan !== tmp.state.fieldValue) {

                // if the pan has changed, record it
                let originalPan = tmp.state.fieldValue;
                let pan = "";
                if (this.from >= 0 && this.to > this.from) {
                    pan = tmp.state.fieldValue.substring(this.from, this.to);
                } else {
                    pan = tmp.state.fieldValue
                }

                this.setState({pan: pan, originalPan: originalPan})
            }

        }

    }

    generatePinBlock() {

        if (this.state.pan === "") {
            this.setState({panError: true})
            return;
        }

        if (this.state.clearPin === "" || this.state.clearPin.length < 4 || this.state.clearPin.length
            > 12) {
            this.setState({pinError: true})
            return;
        }

        if (this.state.pinKey === "" || (this.state.pinKey.length !== 16 && this.state.pinKey.length
            !== 32)) {
            this.setState({keyError: true})
            return
        }

        this.setState({keyError: false, pinError: false, panError: false});

        let data = {
            PINClear: this.state.clearPin,
            PINFormat: this.state.pinFormat,
            PINKey: this.state.pinKey,
            PAN: this.state.pan
        };

        //console.log(JSON.stringify(data))
        axios.post(appProps.pinGenUrl, JSON.stringify(data)).then(res => {
            this.props.setPinBlock(res.data.PinBlock);
        }).catch(err => {
            let errorMsg = "Failed to generate PIN block: ";
            if (err.error) {
                errorMsg = errorMsg + err.error
            } else {
                errorMsg = errorMsg + err;
            }

            this.setState({hasError: true, errorMsg: errorMsg});
            console.log("error= ", err);
        })

    }

    formatChanged(event) {
        this.setState({pinFormat: event.target.value});
    }

    pinValueChanged(event) {
        this.setState({clearPin: event.target.value});
    }

    panValueChanged(event) {
        this.setState({pan: event.target.value});
    }

    keyValueChanged(event) {
        this.setState({pinKey: event.target.value});
    }

    render() {

        if (this.field.GenType !== 'pin_gen') {
            return null;
        }

        return (

            <React.Fragment>

                <AlertDialog show={this.state.hasError} msg={this.state.errorMsg}
                             onClose={this.doNothing}/>

                <Box border={1} borderColor={"primary.main"} borderRadius={4}>
                    <div style={{paddingBottom: "10px", padding: "5px"}}>
                        <Grid container spacing={0}>

                            <Grid container spacing={1} alignItems={"flex-start"}>
                                <Grid item xs={3}>
                                    <TextField size={"small"} label={"Clear PIN"} value={this.state.clearPin}
                                               onChange={this.pinValueChanged} error={this.state.pinError}
                                               variant={"outlined"} margin={"dense"}/>
                                </Grid>
                                <Grid item xs={6}>
                                    <TextField label={"PIN Key"} value={this.state.pinKey} variant={"outlined"}
                                               onChange={this.keyValueChanged} error={this.state.keyError}
                                               margin={"dense"} fullWidth={true}/>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField size={"small"} value={this.state.pinFormat} select={true}
                                               fullWidth={true}
                                               label={"Format"} onChange={this.formatChanged}
                                               variant={"outlined"} margin={"dense"}>
                                        <MenuItem value={"ISO0"}>ISO-0</MenuItem>
                                        <MenuItem value={"ISO1"}>ISO-1</MenuItem>
                                        <MenuItem value={"ISO3"}>ISO-3</MenuItem>
                                        <MenuItem value={"IBM3264"}>IBM-3264</MenuItem>
                                    </TextField>
                                </Grid>
                            </Grid>

                            <Grid container spacing={1} alignItems={"flex-start"}>
                                <Grid item xs={12}>
                                    <TextField label={"PAN"} value={this.state.pan} variant={"outlined"}
                                               onChange={this.panValueChanged} error={this.state.panError}
                                               margin={"dense"}/>
                                </Grid>
                            </Grid>

                            <Grid container spacing={0} justify={"flex-end"} alignItems={"flex-end"}>
                                <Grid item xs>
                                    <div style={{float: "right"}}>
                                        <Button size={"small"} variant={"contained"} onClick={this.generatePinBlock}
                                                color={"primary"}>Generate</Button>
                                    </div>
                                </Grid>

                            </Grid>

                        </Grid>
                    </div>
                </Box>
            </React.Fragment>

        );
    }
}