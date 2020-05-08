import * as React from "react";
import PinGenBox from "./PinGenBox";
import {TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";
import MacGenBox from "./MacGenBox";
import Grid from "@material-ui/core/Grid";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import UIIsoBitmap from "./BitmapFragment";

export default class CryptoUtilsBox extends React.Component {
    pinField = {
        PinGenProps: {
            PANFieldId: 0,
            PANExtractParams: "",
            PINFormat: "ISO0",
            PINClear: "1234",
            PINKey: "1234567890abcd0102030546febce4ee"
        }, GenType: "pin_gen"
    };

    macField = {
        MacGenProps: {
            MacAlgo: "ANSIX9_19", MacKey: "1234567890abcd0102030546febce4ee"
        }, GenType: "mac_gen"
    };

    constructor(props) {
        super(props);

        this.state = {pinBlock: "", mac: "", macData: "", error: ""}

        this.setPinValue = this.setPinValue.bind(this);
        this.setMacValue = this.setMacValue.bind(this);
        this.macDataChanged = this.macDataChanged.bind(this);
    }

    setPinValue(value) {
        this.setState({pinBlock: value})
    }

    setMacValue(value) {
        this.setState({mac: value})
    }

    macDataChanged(event) {
        if (event.target.value.trim().length === 0 || event.target.value.trim().length % 2 !== 0) {
            this.setState({error: "MacData should be hex/even-digits", macData: event.target.value});
            return
        }

        this.setState({error: "", macData: event.target.value.trim()})
    }

    render() {
        return (

            <div style={{
                textAlign: "left", marginTop: "5%"
            }}>

                <Grid container={true} spacing={1} direction={"column"}>

                    <Grid item={true} sm={6} justify={"center"}>

                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                            >
                                <Typography>PIN Generator</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>

                                <div style={{
                                    textAlign: "left", marginTop: "5%", width: "100%", height: "100%"
                                }}>

                                    <PinGenBox field={this.pinField} setPinBlock={this.setPinValue}/>
                                    <TextField size={"small"} label={"PIN Block"} variant={"outlined"}
                                               margin={"dense"}
                                               fullWidth={true}
                                               value={this.state.pinBlock}/>
                                </div>


                            </ExpansionPanelDetails>
                        </ExpansionPanel>


                    </Grid>

                    <Grid item={true} sm={6}>


                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography>MAC Generator</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>

                                <div style={{
                                    textAlign: "left", marginTop: "5%", width: "100%"
                                }}>

                                    <TextField size={"small"} label={"Mac Data"} variant={"outlined"}
                                               margin={"dense"}
                                               fullWidth={true} multiline={true} onChange={this.macDataChanged}
                                               rows={5}
                                               rowsMax={20} error={this.state.error !== ""}
                                               helperText={this.state.error}
                                               value={this.state.macData}/>
                                    <MacGenBox field={this.macField} setMac={this.setMacValue}
                                               macData={this.state.macData}/>
                                    <TextField size={"small"} label={"MAC"} variant={"outlined"} margin={"dense"}
                                               fullWidth={true}
                                               value={this.state.mac}/>
                                </div>


                            </ExpansionPanelDetails>
                        </ExpansionPanel>


                    </Grid>

                    <Grid item={true} sm={6}>


                        <ExpansionPanel>
                            <ExpansionPanelSummary
                                expandIcon={<ExpandMoreIcon/>}
                                aria-controls="panel3a-content"
                                id="panel3a-header"
                            >
                                <Typography>ISO Bitmap Codec</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>

                                <div style={{
                                    textAlign: "left", marginTop: "5%", width: "100%"
                                }}>
                                    <UIIsoBitmap/>

                                </div>


                            </ExpansionPanelDetails>
                        </ExpansionPanel>


                    </Grid>


                </Grid>


            </div>);
    }

}