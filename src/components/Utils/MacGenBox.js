import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import React from "react";
import Box from "@material-ui/core/Box";

import axios from "axios";
import appProps from "./Properties";
import AlertDialog from "../Dialogs/AlertDialog";
import MsgUtils from "./MsgUtils.js";

export default class MacGenBox extends React.Component {

  field;

  constructor(props) {
    super(props);
    this.field = this.props.field;

    this.state = {
      macAlgo: this.field.MacGenProps.MacAlgo,
      macKey: this.field.MacGenProps.MacKey,
      hasError: false,
      errorMsg: null
    }

    this.generateMac = this.generateMac.bind(this);
    this.algoChanged = this.algoChanged.bind(this);
    this.keyValueChanged = this.keyValueChanged.bind(this);
    this.doNothing = this.doNothing.bind(this);

  }

  doNothing() {
    this.setState({hasError: false, errorMsg: null});
  }

  generateMac() {

    if (this.state.macKey === "" || (this.state.macKey.length !== 16 && this.state.macKey.length
        !== 32)) {
      this.setState({keyError: true})
      return
    }

    this.setState({keyError: false});

    let content = []
    let validationErrors = []

    let reqData = {};

    if (this.props.macData !== undefined) {

      //if mac-data has been provided

      if (this.props.macData.length === 0) {
        this.setState({hasError: true, errorMsg: "Invalid MacData supplied."});
        return
      } else {

        this.setState({hasError: false, errorMsg: null});

        let macData = this.props.macData;

        reqData = {
          mac_algo: this.state.macAlgo, mac_key: this.state.macKey, mac_data: macData
        };
      }

    } else {

      //mac_data is to be computed on the server-side

      MsgUtils.getMsgContent(this.props.isoMsg, content, validationErrors);

      if (validationErrors.length > 0) {
        let errMsg = "";
        validationErrors.forEach(e => errMsg += e + "\n");
        this.setState({hasError: true, errorMsg: errMsg});
        return
      }

      reqData = {
        mac_algo: this.state.macAlgo,
        mac_key: this.state.macKey,
        spec_id: this.props.isoMsg.get("spec_id"),
        msg_id: this.props.isoMsg.get("msg_id"),
        parsed_fields: content
      };
    }

    axios.post(appProps.macGenUrl, JSON.stringify(reqData)).then(res => {
      this.setState({hasError: false, errorMsg: null});
      this.props.setMac(res.data.Mac);

    }).catch(e => {
      let errorMsg = "Failed to generate MAC: ";
      if (e.error) {
        if (e.response.status === 400) {
          errorMsg = errorMsg + e.response.data.error;
        }

      } else {
        errorMsg = errorMsg + e;
      }

      this.setState({hasError: true, errorMsg: errorMsg});
      console.log("error= ", e);
    })

  }

  algoChanged(event) {
    this.setState({macAlgo: event.target.value});
  }

  keyValueChanged(event) {
    this.setState({macKey: event.target.value});
  }

  render() {

    if (this.field.GenType !== 'mac_gen') {
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
                  <Grid item xs={6}>
                    <TextField label={"MAC Key"} value={this.state.macKey} variant={"outlined"}
                               onChange={this.keyValueChanged} error={this.state.keyError}
                               margin={"dense"} fullWidth={true}/>
                  </Grid>
                  <Grid item xs={4}>
                    <TextField size={"small"} value={this.state.macAlgo} select={true}
                               fullWidth={true}
                               label={"MAC Algorithm"} onChange={this.algoChanged}
                               variant={"outlined"} margin={"dense"}>
                      <MenuItem value={"ANSIX9_19"}>ANSIX9_19</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                <Grid container spacing={0} justify={"flex-end"} alignItems={"flex-end"}>
                  <Grid item xs>
                    <div style={{float: "right"}}>
                      <Button size={"small"} variant={"contained"} onClick={this.generateMac}
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