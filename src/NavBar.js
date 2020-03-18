import React from 'react';
import axios from 'axios'
import MessageStructure from './MessageStructure.js'

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      specs: [],
      currentSpec: "Select",
      currentSpecMsg: "",
      showMsgTemplate: false,
      loaded: false
    };
    this.specChanged = this.specChanged.bind(this);
    this.messageChanged = this.messageChanged.bind(this);
    this.msgTemplateRef = React.createRef();

  }

  componentDidMount() {

    axios.get('http://localhost:8080/iso/v0/specs').then(res => {
      console.log(res.data);
      this.setState({specs: res.data, loaded: true});
    }).catch(
        err => console.log(err))
  }

  render() {

    let msg;
    let spec;

    if (this.state.loaded === true) {
      spec = this.getCurrentSpec();
      if (spec == null) {
        spec = this.state.specs[0];
      }

      if (!this.state.currentSpecMsg) {
        msg = spec.Messages[0].Name;
      } else {
        msg = this.state.currentSpecMsg;
      }
    }

    return (
        <React.Fragment>
          <div align="center"
               style={{
                 alignItems: "center",
                 alignSelf: "center",
                 verticalAlign: "middle",
                 backgroundColor: "#AB68FF",
                 height: "80px"
               }}>

            <table style={{fontFamily: 'ptserif-regular'}}>

              <tbody>
              <tr>
                <td>Message Specification</td>
                <td style={{width: "100px"}}></td>
                <td>{this.specsDropDown()}</td>
              </tr>

              <tr>
                <td>Message</td>
                <td style={{width: "100px"}}></td>
                <td>{this.messagesDropDown()}</td>
              </tr>
              </tbody>
            </table>

          </div>
          <div align="center">
            {
              this.state.loaded && this.state.currentSpec !== "Select" ?
                  <MessageStructure key={this.state.currentSpec + "_" + msg}
                                    ref={this.msgTemplateRef}
                                    specs={this.state.specs}
                                    spec={this.state.currentSpec}
                                    msg={msg}/>
                  : <div></div>
            }
          </div>
        </React.Fragment>

    );
  }

  specChanged(event) {

    this.setState({
      currentSpec: event.target.value,
      currentSpecMsg: ""
    });

    console.log(event.target.value);
    if (this.state.loaded && event.target.value !== "Select") {
      console.log("calling update - specChanged");
      let spec = this.getSpecByName(event.target.value);
      //console.log("current spec ", event.target.value);
      /*if (this.msgTemplateRef.current) {
        this.msgTemplateRef.current.update(spec.Name, spec.Messages[0].Name);
      }*/
    }
  }

  messageChanged(event) {
    this.setState({currentSpecMsg: event.target.value});

    if (this.state.loaded && this.state.currentSpec !== "Select") {
      console.log("calling update - msgChanged");

      /*if (this.msgTemplateRef.current) {
        this.msgTemplateRef.current.update(this.state.currentSpec,
            event.target.value);
      }*/
    }
  }

  // builds a combo box for specifications
  specsDropDown() {
    return (
        <select style={{fontFamily: "ptserif-regular", width: "200px",}}
                onChange={this.specChanged}>
          <option key={"Select"} value={"Select"}>Select</option>
          {
            this.state.specs.map((s) => {
              return <option key={s.Name} value={s.Name}>{s.Name}</option>
            })
          }

        </select>);
  }

  // builds and returns a combo box for messages for the current spec
  messagesDropDown() {

    let spec;

    if (this.state.loaded) {
      spec = this.getCurrentSpec();
    }

    // no spec loaded
    if (this.state.currentSpec === "Select") {
      return (<select></select>);
    } else {

      return (

          <select value={this.state.currentSpecMsg}
                  style={{fontFamily: "ptserif-regular", width: "150px"}}
                  onChange={this.messageChanged}>
            {
              spec.Messages.map(msg => {
                return <option key={msg.Id}
                               value={msg.Name}>{msg.Name}</option>
              })
            }

          </select>

      )

    }

  }

  // returns the currently loaded spec (if there is one) else null
  getCurrentSpec() {
    return this.state.specs.find((s, i) => {
      if (s.Name === this.state.currentSpec) {
        return s;
      }
      return null;
    });
  }

  // returns specification given its name
  getSpecByName(name) {
    return this.state.specs.find((s, i) => {
      if (s.Name === name) {
        return s;
      }
      return null;
    });
  }

}

export default NavBar