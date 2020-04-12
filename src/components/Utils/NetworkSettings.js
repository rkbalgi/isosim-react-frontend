import React from "react";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import OutlinedInput from "@material-ui/core/OutlinedInput";

class NetworkSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      targetServerIp: "127.0.0.1",
      targetServerPort: "6666",
      mliType: "2i"
    }

    this.serverIpChanged = this.serverIpChanged.bind(this);
    this.serverPortChanged = this.serverPortChanged.bind(this);
    this.mliTypeChanged = this.mliTypeChanged.bind(this);

  }

  mliTypeChanged(e) {
    this.setState({mliType: e.target.value});
    this.props.onChange(this.state.targetServerIp, this.state.targetServerPort,
        e.target.value)
  }

  serverIpChanged(e) {
    this.setState({targetServerIp: e.target.value});
    this.props.onChange(e.target.value, this.state.targetServerPort,
        this.state.mliType)
  }

  serverPortChanged(e) {
    this.setState({targetServerPort: e.target.value});
    this.props.onChange(this.state.targetServerIp, e.target.value,
        this.state.mliType)
  }

  render() {
    return (
        <div align={"left"}
             style={{
               align: 'left',
               height: "80px",
               verticalAlign: "baseline",
               margin: "10px"
             }}>


          <table
              style={{
                fontFamily: 'lato-regular',
                fontSize: '14px'
              }}>
            <tr>
              <td>
                <TextField id="outlined-basic" label="IP" size={"small"}
                           variant="outlined" defaultValue={"127.0.0.1"}
                           onChange={this.serverIpChanged}/>
              </td>
              <td>

                <TextField id="outlined-basic" label="Port" size={"small"}
                           variant="outlined" defaultValue={"6666"}
                           onChange={this.serverPortChanged}/>
              </td>

              <td>
                <TextField select size={"small"}
                    value={this.state.mliType} variant={"outlined"} label={"MLI"}
                    onChange={this.mliTypeChanged}>
                  <MenuItem value={"2i"}>2I</MenuItem>
                  <MenuItem value={"2e"}>2E</MenuItem>
                </TextField>

              </td>

            </tr>
          </table>


        </div>
    );
  }
}

export default NetworkSettings