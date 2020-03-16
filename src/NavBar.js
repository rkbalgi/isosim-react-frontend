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
        <div align="left">

          <table>

            <tr>
              <td>Spec</td>
              <td style={{width: "100px"}}></td>
              <td>{this.specsDropDown()}</td>
            </tr>

            <tr>
              <td>Message</td>
              <td style={{width: "100px"}}></td>
              <td>{this.messagesDropDown()}</td>
            </tr>

          </table>


          {
            this.state.loaded && this.state.currentSpec !== "Select" ?
                <MessageStructure ref={this.msgTemplateRef}
                                  specs={this.state.specs}
                                  spec={this.state.currentSpec}
                                  msg={msg}/>
                : <div>""</div>
          }

        </div>

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
      if (this.msgTemplateRef.current) {
        this.msgTemplateRef.current.update(spec.Name, spec.Messages[0].Name);
      }
    }
  }

  messageChanged(event) {
    this.setState({currentSpecMsg: event.target.value});

    if (this.state.loaded && this.state.currentSpec !== "Select") {
      console.log("calling update - msgChanged");

      if (this.msgTemplateRef.current) {
        this.msgTemplateRef.current.update(this.state.currentSpec,
            event.target.value);
      }
    }
  }

  specsDropDown() {
    return (
        <select key={"all_specs"} id={"all_specs"} onChange={this.specChanged}>
          <option key={"Select"} value={"Select"}>Select</option>
          {
            this.state.specs.map((s) => {
              return <option key={s.Name} value={s.Name}>{s.Name}</option>
            })
          }

        </select>);
  }

  getCurrentSpec() {
    return this.state.specs.find((s, i) => {
      if (s.Name === this.state.currentSpec) {
        return s;
      }
      return null;
    });
  }

  getSpecByName(name) {
    return this.state.specs.find((s, i) => {
      if (s.Name === name) {
        return s;
      }
      return null;
    });
  }

  messagesDropDown() {

    let spec;

    if (this.state.loaded) {
      spec = this.getCurrentSpec();
    }

    if (this.state.currentSpec === "Select") {
      return (
          <select>

          </select>
      );
    } else {

      return (

          <select value={this.state.currentSpecMsg}
                  onChange={this.messageChanged}>
            {

              spec.Messages.map(msg => {
                return <option value={msg.Name}>{msg.Name}</option>
              })
            }

          </select>

      )

    }

  }
}

export default NavBar