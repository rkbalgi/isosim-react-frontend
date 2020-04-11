import React from "react";

class NetworkSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      targetServerIp: "127.0.0.1",
      targetServerPort: "6666",
      mliType: "2I"
    }

    this.serverIpChanged = this.serverIpChanged.bind(this);
    this.serverPortChanged = this.serverPortChanged.bind(this);
    this.mliTypeChanged = this.mliTypeChanged.bind(this);

  }

  mliTypeChanged(e) {
    this.setState({mliType: e.target.value});
  }

  serverIpChanged(e) {
    this.setState({targetServerIp: e.target.value});
  }

  serverPortChanged(e) {
    this.setState({targetServerPort: e.target.value});
    this.props.onChange(this.state.targetServerIp, this.state.targetServerPort,
        this.state.mliType)
  }

  render() {
    return (
        <div align={"left"}
             style={{
               align:'left',
               height: "80px",
               verticalAlign: "baseline",
               margin: "10px"
             }}>


          <table
              style={{
                fontFamily: 'lato-regular',
                fontSize: '14px',
                borderBottom: 'solid',
                backgroundColor: '#4cffff'
              }}>
            <tr>
              <td><label style={{width: '60px'}}>Server Ip </label>{'   '}
                <input type="text" value={this.state.targetServerIp}
                       onChange={this.serverIpChanged}/></td>
              <td><label style={{width: '80px'}}>Server Port </label>
                <input type="text" value={this.state.targetServerPort}
                       onChange={this.serverPortChanged}/></td>
              <td><label style={{width: '70px'}}>MLI Type </label>

                <select value={this.state.mliType}
                        onChange={this.mliTypeChanged}>
                  <option key={"2i"} value={"2I"}>2I</option>
                  <option key={"2e"} value={"2E"}>2E</option>
                </select></td>
            </tr>
          </table>

        </div>
    );
  }
}

export default NetworkSettings