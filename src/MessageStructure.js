import React from 'react';
import axios from "axios";
//import axios from 'axios'
import IsoField from './IsoField.js'

export default class MessageStructure extends React.Component {

  constructor(props) {
    super(props);
    console.log(this.props);
    console.log("$msg_structure$", this.props.specs, this.props.spec,
        this.props.msg);

    //this.props = props;

    this.state = {
      msgTemplate: null,
      loaded: false,
      spec: props.spec,
      msg: props.msg,
      shouldShow: props.showMsgTemplate
    };
    //this.buildMessageTemplateContent = this.buildMessageTemplateContent.bind(
    //   this);

  }

  update(spec, msg) {
    //this.setState({spec: spec, msg: msg});
    this.getMessageTemplate(spec, msg);
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
          this.setState(
              {spec: spec, msg: msg, msgTemplate: res.data, loaded: true});
          //this.forceUpdate()
        }).catch(err => console.log(err))
  }

  buildMessageTemplateContent() {

    if (this.state.msgTemplate !== null) {
      this.state.msgTemplate.Fields.map(field => {
        return <tr>
          <td>
            <div>{field.Name}</div>
          </td>
        </tr>
      })
    }

  }

  appendFieldContent(content, field, isoMsg, level) {

    content.push(<tr><IsoField field={field} isoMsg={isoMsg}/></tr>);

    //if (field.Children.length > 0) {
    field.Children.forEach(
        c => this.appendFieldContent(content, c, isoMsg, level + 1));
    //}

  }

  render() {

    let content = [];
    if (this.state.loaded === true) {

      let isoMsg = new Map();
      isoMsg.set("msg_template", this.state.msgTemplate);
      this.state.msgTemplate.Fields.map(field => {
        this.appendFieldContent(content, field, isoMsg, 1)
      })
    }

    return (
        <div style={{width: '600px', color: 'blue',}}>
          <table border="2">
            <tr>
              <td>Selection</td>
              <td>Field</td>
              <td>Field Data</td>
            </tr>
            {content}
          </table>
        </div>

    );

  }

}