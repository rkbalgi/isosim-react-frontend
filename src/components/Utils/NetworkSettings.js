import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

// NetworkSettings is a component that manages the ip, port and MLI type
// used when sending a message
class NetworkSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      targetServerIp: props.serverIP, targetServerPort: props.port, mliType: props.mliType
    }

    this.serverIpChanged = this.serverIpChanged.bind(this);
    this.serverPortChanged = this.serverPortChanged.bind(this);
    this.mliTypeChanged = this.mliTypeChanged.bind(this);

  }

  mliTypeChanged(e) {
    this.setState({mliType: e.target.value});
    this.props.onChange(this.state.targetServerIp, this.state.targetServerPort, e.target.value)
  }

  serverIpChanged(e) {
    this.setState({targetServerIp: e.target.value});
    this.props.onChange(e.target.value, this.state.targetServerPort, this.state.mliType)
  }

  serverPortChanged(e) {
    this.setState({targetServerPort: e.target.value});
    this.props.onChange(this.state.targetServerIp, e.target.value, this.state.mliType)
  }

  render() {
    return (

        <Box border={1} borderColor={"#1228B6"} borderRadius={8} style={{backgroundColor: "#E3C4A7", marginBottom: "1%"}}>
          <div style={{
            textAlign: "left",
            verticalAlign: "baseline",
            marginBottom: "2%",
            marginTop: "2%",
            width: "100%"
          }}>
            <Grid container={true} spacing={3} justify={"space-around"}>

              <Grid item={true} justify={"space-evenly"} lg={6}>
                <TextField id="ns_ip" label="Host IP/Name" size={"small"} fullWidth={true}
                           variant="outlined"
                           value={this.state.targetServerIp}
                           onChange={this.serverIpChanged}/>
              </Grid>

              <Grid item={true} lg={4}>
                <TextField id="ns_port" label="Port" size={"small"} fullWidth={true}
                           variant="outlined" value={this.state.targetServerPort}
                           onChange={this.serverPortChanged}/>
              </Grid>
              <Grid item={true} log={4}>
                <TextField select size={"small"} fullWidth={true}
                           value={this.state.mliType} variant={"outlined"} label={"MLI"}
                           onChange={this.mliTypeChanged}>
                  <MenuItem value={"2i"}>2I</MenuItem>
                  <MenuItem value={"2e"}>2E</MenuItem>
                  <MenuItem value={"4i"}>4I</MenuItem>
                  <MenuItem value={"4e"}>4E</MenuItem>
                </TextField>

              </Grid>


            </Grid>
          </div>
        </Box>);
  }
}

export default NetworkSettings