import * as React from "react";
import {TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import axios from "axios"
import appProps from "./Properties";

export default class MsgHistPanel extends React.Component {

  constructor(props) {

    super(props);

    console.log("New MsgHist")
    this.state = {maxItems: props.initialMaxItems, logData: props.initialLogData}

    this.maxItemsChanged = this.maxItemsChanged.bind(this);
    this.fetchLogs = this.fetchLogs.bind(this);

  }

  maxItemsChanged(event) {
    this.setState({maxItems: event.target.value})
  }

  fetchLogs() {

    axios.get(appProps.logHistUrl
        + `?spec_id=${this.props.specId}&msg_id=${this.props.msgId}&count=${this.state.maxItems}`).then(
        res => {
          console.log(res.data)
          let displayData = ""
          res.data.forEach(e => {
            displayData += e + "\n-----------------------------\n";
          });

          this.setState({logData: displayData})
          this.props.saveState({maxItems: this.state.maxItems, logData: this.state.logData})

        }).catch(e => {
      console.log(e)
    })

  }

  render() {
    return (<div style={{textAlign: "left", marginTop: "5%"}}>

      <Grid container={true} spacing={5} alignItems={"center"}>
        <Grid item={true} lg={4}>
          <TextField key={"isim-hist-max-items"} variant={"outlined"} margin={"dense"}
                     label={"Last 'X' Messages"}
                     fullWidth={true}
                     value={this.state.maxItems} select={true}
                     onChange={this.maxItemsChanged}>
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>

          </TextField>
        </Grid>
        <Grid item={true} lg={4}>
          <Button variant={"contained"} color={"primary"} size={"small"}
                  onClick={this.fetchLogs}>Fetch</Button>
        </Grid>
      </Grid>

      <div style={{width: "80%"}}>
        <TextField key={"isim-hist-logs"} margin={"dense"}
                   label={"Messages"}
                   fullWidth={true} multiline={true} rowsMax={100} contentEditable={false}
                   value={this.state.logData}/>
      </div>

    </div>);
  }

}