import React from 'react';
import axios from "axios";
//import axios from 'axios'
import IsoField from './IsoField.js'
import Button from 'react-bootstrap/Button'

export default class MessageStructure extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props);
    console.log("$msg_structure$", this.props.specs, this.props.spec,
        this.props.msg);

    this.state = {
      msgTemplate: null,
      loaded: false,
      spec: props.spec,
      msg: props.msg,
      shouldShow: props.showMsgTemplate
    };
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.appendFieldContent = this.appendFieldContent.bind(this);
    this.sendToHost = this.sendToHost.bind(this);
    this.addFieldContent = this.addFieldContent.bind(this);
  }

  addFieldContent(field, content) {

    let fData = this.state.isoMsg.get(field.Id);
    if (fData.state.selected) {
      content.push({Id: field.Id, Value: fData.state.fieldValue});
    }
    field.Children.forEach(cf => {
      if (fData.state.selected) {
        this.addFieldContent(cf, content);
      }
    });

  }

  sendToHost() {

    let content = [];
    this.state.msgTemplate.Fields.forEach(f => {
      this.addFieldContent(f, content);
    });
    console.log(content)

  }

  onFieldUpdate(e) {
    console.log("field updated =>" + e.fieldName)
  }

  componentDidMount() {
    this.getMessageTemplate(this.props.spec, this.props.msg)
  }

  getMessageTemplate(pSpec, pMsg) {
    let spec = this.props.specs.find(s => {
      if (s.Name === pSpec) {
        return s;
      }
      return null;
    });
    let msg = spec.Messages.find(m => {
      if (m.Name === pMsg) {
        return m;
      }

      return null;
    });

    let url = 'http://localhost:8080/iso/v0/template/' + spec.Id + "/" + msg.Id;
    console.log(url);
    axios.get(url).then(
        res => {
          console.log(res.data);
          let isoMsg = new Map();
          isoMsg.set("msg_template", res.data);
          this.setState(
              {
                spec: spec,
                msg: msg,
                msgTemplate: res.data,
                loaded: true,
                isoMsg: isoMsg
              });

          console.log("MsgTemplate = ", this.state.msgTemplate);

          //this.forceUpdate()
        }).catch(err => console.log(err))
  }

  appendFieldContent(content, field, isoMsg, level) {
    content.push(<IsoField key={field.Id} field={field} isoMsg={isoMsg}
                           onFieldUpdate={this.onFieldUpdate}/>);
  }

  render() {

    let content = [];
    if (this.state.loaded === true) {
      this.state.msgTemplate.Fields.map(field => {
        this.appendFieldContent(content, field, this.state.isoMsg, 1)
      })
    }

    return (

        <div style={{
          fontFamily: 'ptserif-regular',
          fontSize: '12px',
          width: '800px',
          alignContent: 'center',
          alignSelf: 'center',
          fill: 'aqua'
        }}>
          <div align="center"
               style={{
                 height: "50px",
                 verticalAlign: "baseline",
                 alignItems: "center",
                 margin: "10px"
               }}>

            <Button size={"sm"}>Parse Raw</Button>{' '}
            <Button size={"sm"}>Load Message</Button>{' '}
            <Button size={"sm"}>Save Message</Button>{' '}
            <Button size={"sm"} onClick={this.sendToHost}>Send</Button>

          </div>
          <table border="0">
            <thead>
            <tr style={{
              fontFamily: "ptserif-regular",
              backgroundColor: "#EAFF13",
              fontSize: "14px",
            }}>
              <td align={"center"}>Selection</td>
              <td align={"center"}>Field</td>
              <td align={"center"}
                  style={{minWidth: "50px", maxWidth: "100px"}}>Field Spec
              </td>
              <td align={"center"}>Field Data</td>
            </tr>
            </thead>
            <tbody>
            {content}
            </tbody>
          </table>
          <div style={{height: "10px"}}>{' '}</div>

        </div>

    );

  }

}