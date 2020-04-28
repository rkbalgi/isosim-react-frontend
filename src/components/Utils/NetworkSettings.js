import React from "react";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";

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
    return (<div align={"left"}
                 style={{
                   verticalAlign: "baseline", margin: "10px", width: "100%"
                 }}>


      <table>
        <tr>
          <td>
            <TextField id="ns_ip" label="IP" size={"small"}
                       variant="outlined" defaultValue={"127.0.0.1"}
                       value={this.state.targetServerIp}
                       onChange={this.serverIpChanged}/>
          </td>
          <td>

            <TextField id="ns_port" label="Port" size={"small"}
                       variant="outlined" defaultValue={"6666"} value={this.state.targetServerPort}
                       onChange={this.serverPortChanged}/>
          </td>

          <td>
            <TextField select size={"small"}
                       value={this.state.mliType} variant={"outlined"} label={"MLI"}
                       onChange={this.mliTypeChanged}>
              <MenuItem value={"2i"}>2I</MenuItem>
              <MenuItem value={"2e"}>2E</MenuItem>
              <MenuItem value={"4i"}>4I</MenuItem>
              <MenuItem value={"4e"}>4E</MenuItem>
            </TextField>

          </td>

        </tr>
      </table>


    </div>);
  }
}

export default NetworkSettings