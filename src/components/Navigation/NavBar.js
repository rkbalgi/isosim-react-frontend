import React from 'react';
import axios from 'axios'
import MessageStructure from '../Iso/MessageStructure.js'
import {Button, Modal} from "react-bootstrap";
import appProps from "../Utils/Properties";
import SpecTree from "./SpecTree/SpecTree";
import Container from "@material-ui/core/Container";
import TextareaAutosize from "@material-ui/core/TextareaAutosize";

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      specs: [],
      currentSpec: "Select",
      currentSpecMsg: "",
      showMsgTemplate: false,
      loaded: false,
      errDialogVisible: false,
      errorMessage: ''
    };
    this.specChanged = this.specChanged.bind(this);
    this.messageChanged = this.messageChanged.bind(this);
    this.msgSelected = this.msgSelected.bind(this);
    this.getSpecByID = this.getSpecByID.bind(this);

    this.msgTemplateRef = React.createRef();

  }

  msgSelected(specId, msgId) {

    console.log(specId, msgId)
    console.log(this.state.specs)
    let spec = this.getSpecByID(parseInt(specId))
    console.log("spec = ", spec)
    let msg = null;
    spec.Messages.forEach(m => {
      if (m.ID === parseInt(msgId)) {
        msg = m;
      }
    })

    this.setState(
        {loaded: true, currentSpec: spec.Name, currentSpecMsg: msg.Name});

  }

  closeErrorDialog() {
    this.setState({errDialogVisible: false})
  }

  showErrorDialog() {
    this.setState({errDialogVisible: true});
  }

  componentDidMount() {

    axios.get(appProps.allSpecsUrl).then(res => {
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


          <div>
            <Modal show={this.state.errDialogVisible}
                   onHide={this.closeErrorDialog}>
              <Modal.Header closeButton>
                <Modal.Title>Error</Modal.Title>
              </Modal.Header>
              <Modal.Body>{this.state.errorMessage}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={this.closeErrorDialog}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>


            <div style={{
              float: "left",
              display: "inline-block",
              marginRight: "20px",
              marginLeft: "20px",
              backgroundColor:'#fbfff0'

            }}>
              <SpecTree msgSelected={this.msgSelected}/>
            </div>
            <div align="center" style={{backgroundColor:'#fbfff0'}}>
              {
                this.state.loaded && this.state.currentSpec !== "Select" ?
                    <MessageStructure key={this.state.currentSpec + "_" + msg}
                                      ref={this.msgTemplateRef}
                                      specs={this.state.specs}
                                      spec={this.state.currentSpec}
                                      msg={this.state.currentSpecMsg}/>
                    : null
              }
            </div>
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
    }
  }

  messageChanged(event) {
    this.setState({currentSpecMsg: event.target.value});

    if (this.state.loaded && this.state.currentSpec !== "Select") {
      console.log("calling update - msgChanged");

    }
  }

  // builds a combo box for specifications
  specsDropDown() {
    return (
        <select style={{fontFamily: "lato-regular", width: "200px",}}
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
      return (<select/>);
    } else {

      return (

          <select value={this.state.currentSpecMsg}
                  style={{fontFamily: "lato-regular", width: "150px"}}
                  onChange={this.messageChanged}>
            {
              spec.Messages.map(msg => {
                return <option key={msg.ID}
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

  // returns specification given its name
  getSpecByID(specId) {
    return this.state.specs.find((s, i) => {
      if (s.ID === specId) {
        return s;
      }
      return null;
    });
  }

}

export default NavBar