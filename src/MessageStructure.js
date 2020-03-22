import React from 'react';
import axios from "axios";
//import axios from 'axios'
import IsoField from './IsoField.js'
import SelectMessageDialog from './SelectMessageDialog.js'
import {Button, Modal} from 'react-bootstrap';
import appProps from './Properties.js'
import ResponseSegment from "./ResponseSegment";
import ParseMessageDialog from "./ParseMessageDialog";
import SaveMessageDialog from "./SaveMessageDialog";

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
      shouldShow: props.showMsgTemplate,
      targetServerIp: '127.0.0.1',
      targetServerPort: '6666',
      mliType: "2I",
      currentDataSet: '',
      errDialogVisible: false,
      errorMessage: '',
      showLoadMessagesDialog: false,
      showTraceInputDialog: false,
      showSaveMsgDialog: false,
      showResponse: false,
      responseData: null
    };

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.appendFieldContent = this.appendFieldContent.bind(this);
    this.sendToHost = this.sendToHost.bind(this);
    this.addFieldContent = this.addFieldContent.bind(this);
    this.serverIpChanged = this.serverIpChanged.bind(this);
    this.serverPortChanged = this.serverPortChanged.bind(this);
    this.mliTypeChanged = this.mliTypeChanged.bind(this);
    this.showErrorDialog = this.showErrorDialog.bind(this);
    this.closeErrorDialog = this.closeErrorDialog.bind(this);
    this.processError = this.processError.bind(this);
    this.showLoadMessagesDialog = this.showLoadMessagesDialog.bind(this);
    this.closeLoadMsgDialog = this.closeLoadMsgDialog.bind(this);
    this.showUnImplementedError = this.showUnImplementedError.bind(this);
    this.setTrace = this.setTrace.bind(this);
    this.showTraceInputsDialog = this.showTraceInputsDialog.bind(this);
    this.showSaveMsgDialog = this.showSaveMsgDialog.bind(this);

    this.msgSaveSuccess = this.msgSaveSuccess.bind(this);
    this.msgSaveFailed = this.msgSaveFailed.bind(this);
    this.msgSaveCancelled = this.msgSaveCancelled.bind(this);
    this.showInfoDialog = this.showInfoDialog.bind(this);

  }

  // this method receives the trace as a callback from ParseMessageDialog component
  setTrace(trace) {
    if (trace != null) {
      console.log("trace  = ", trace);
      // now parse this via a API call

      axios.post(appProps.parseTraceUrl + '/' + this.state.spec.Id + '/'
          + this.state.msg.Id, trace).then(res => {
            console.log("parsed msg data", res.data);
            res.data.forEach(fd => {
              let fieldComponent = this.state.isoMsg.get(fd.Id);
              fieldComponent.setState({selected: true, fieldValue: fd.Value});
            });
          }
      ).catch(e => {
            console.log(e);
            this.processError(e)
          }
      )

    }
    this.setState({showTraceInputDialog: false})
  }

  showUnImplementedError() {
    this.setState({
      errorMessage: 'This functionality has not been implemented. Please try the old version of application.',
      errDialogVisible: true
    })
  }

  closeLoadMsgDialog(selectedMsg) {
    this.setState({showLoadMessagesDialog: false, currentDataSet: selectedMsg});
    console.log("selected msg = ", selectedMsg);

    if (selectedMsg != null) {
      axios.get(appProps.loadMsgUrl, {
        params: {
          specId: this.state.spec.Id,
          msgId: this.state.msg.Id,
          dsName: selectedMsg
        }
      }).then(res => {
            //console.log("saved msg data", res.data);
            res.data.forEach(fd => {
              let fieldComponent = this.state.isoMsg.get(fd.Id);
              fieldComponent.setState({selected: true, fieldValue: fd.Value});
            });
          }
      ).catch(e => {
            console.log(e);
            this.processError(e)
          }
      )
    }

  }

  showInfoDialog(msg) {
    this.setState({errDialogVisible: true, errorMessage: msg})
  }

  msgSaveSuccess(msgName) {
    this.showInfoDialog(`Message ${msgName} saved successfully.`);
    this.setState({showSaveMsgDialog: false});
  }

  msgSaveFailed(e) {
    this.processError(e);
    this.setState({showSaveMsgDialog: false});
  }

  msgSaveCancelled() {
    this.setState({showSaveMsgDialog: false});
  }

  showSaveMsgDialog() {

    // build the data and then
    let content = [];
    this.state.msgTemplate.Fields.forEach(f => {
      this.addFieldContent(f, content);
    });
    this.setState({saveData: content, showSaveMsgDialog: true})
  }

  showTraceInputsDialog() {
    this.setState({showTraceInputDialog: true})
  }

  showLoadMessagesDialog() {
    this.setState({showLoadMessagesDialog: true})
  }

  closeErrorDialog() {
    this.setState({errDialogVisible: false})
  }

  showErrorDialog() {
    this.setState({errDialogVisible: true});
  }

  mliTypeChanged(e) {
    this.setState({mliType: e.target.value});
  }

  serverIpChanged(e) {
    this.setState({targetServerIp: e.target.value});
  }

  serverPortChanged(e) {
    this.setState({targetServerPort: e.target.value});
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
    console.log(content);

    //lets not hide and then show the response segment again
    this.setState({showResponse: false, responseData: []});

    let postData = 'host=' +
        this.state.targetServerIp + '&' + 'port=' + this.state.targetServerPort
        + '&' + 'mli=' + this.state.mliType
        + '&' + 'specId=' + this.state.spec.Id + "&" + 'msgId='
        + this.state.msg.Id + "&"
        + "msg="
        + JSON.stringify(content);
    axios.post(appProps.sendMsgUrl, postData).then(res => {
      console.log("Response from server", res);
      this.setState({showResponse: true, responseData: res.data});

    }).catch(
        e => {
          console.log("error = ", e);
          this.processError(e)
        })

  }

  processError(e) {

    if (!e.response) {
      console.log(e);
      this.setState({
        errorMessage: 'Error: Unable to reach API server',
        errDialogVisible: true
      });
      return
    }

    if (e.response.status === 400) {
      this.setState(
          {errorMessage: e.response.data, errDialogVisible: true});
    } else {
      this.setState(
          {
            errorMessage: 'Unexpected error from server - '
                + e.response.status, errDialogVisible: true
          });
    }
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

    let url = appProps.templateUrl + '/' + spec.Id + "/" + msg.Id;
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
        }).catch(
        err => this.setState({errorMessage: err, errDialogVisible: true}))
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
          alignContent: 'center',
          alignSelf: 'center',
          fill: 'aqua'
        }}>

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

          <SelectMessageDialog show={this.state.showLoadMessagesDialog}
                               specId={this.state.spec.Id}
                               msgId={this.state.msg.Id}
                               closeLoadMsgDialog={this.closeLoadMsgDialog}/>

          <ParseMessageDialog show={this.state.showTraceInputDialog}
                              setTrace={this.setTrace}/>

          <SaveMessageDialog show={this.state.showSaveMsgDialog}
                             msgId={this.state.msg.Id}
                             specId={this.state.spec.Id}
                             data={this.state.saveData}
                             msgName={this.state.currentDataSet}
                             msgSaveSuccess={this.msgSaveSuccess}
                             msgSaveFailed={this.msgSaveFailed}
                             msgSaveCancelled={this.msgSaveCancelled}/>

          <div
              style={{
                height: "100px",
                verticalAlign: "baseline",
                alignItems: "center",
                margin: "10px"
              }}>


            <table
                style={{
                  fontFamily: 'ptserif-regular',
                  fontSize: '14px',
                  alignSelf: 'center',
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

            <table>

              <tr>
                <td>

                </td>
              </tr>


              <tr>
                <td>
                  <Button size={"sm"} onClick={this.showTraceInputsDialog}>Parse
                    Raw</Button>{' '}
                  <Button size={"sm"} onClick={this.showLoadMessagesDialog}>Load
                    Message</Button>{' '}
                  <Button size={"sm"} onClick={this.showSaveMsgDialog}>Save
                    Message</Button>{' '}
                  <Button size={"sm"} onClick={this.sendToHost}>Send</Button>


                </td>
              </tr>


            </table>
          </div>

          {/* outer table for request and response */}
          <table>

            <thead>
            </thead>
            <tbody>
            <tr>
              <td>
                <table border="0">
                  <thead>
                  <tr style={{
                    fontFamily: "ptserif-regular",
                    backgroundColor: "#ff8f5b",
                    fontSize: "15px",
                    borderBottom: 'solid',
                    borderColor: 'blue'
                  }}>
                    <td colspan="3" align={"center"}>{"Request Segment"}</td>
                  </tr>
                  <tr style={{
                    fontFamily: "ptserif-regular",
                    backgroundColor: "#ff8f5b",
                    fontSize: "14px",
                  }}>
                    <td align={"center"}>Selection</td>
                    <td align={"center"}>Field</td>
                    {/*<td align={"center"}
                        style={{minWidth: "50px", maxWidth: "200px"}}>Field Spec
                    </td>*/}
                    <td align={"center"} style={{width: '220px'}}>Field Data
                    </td>
                  </tr>
                  </thead>
                  <tbody>
                  {content}
                  </tbody>
                </table>

              </td>
              <td>{' '}</td>

              <td>
                <ResponseSegment show={this.state.showResponse}
                                 data={this.state.responseData}
                                 msgTemplate={this.state.msgTemplate}/>
              </td>

            </tr>
            </tbody>

          </table>


          <div style={{height: "10px"}}>{' '}</div>

        </div>

    );

  }

}