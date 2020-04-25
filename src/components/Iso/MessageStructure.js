import React from 'react';
import axios from "axios";
import IsoField from './IsoField/IsoField.js'
import SelectMessageDialog from '../Dialogs/SelectMessageDialog.js'
import {Button} from "@material-ui/core";
import appProps from '../Utils/Properties.js'
import ResponseSegment from "./ResponseSegment";
import ParseMessageDialog from "../Dialogs/ParseMessageDialog";
import SaveMessageDialog from "../Dialogs/SaveMessageDialog";

import 'typeface-roboto';
import Paper from '@material-ui/core/Paper';
import NetworkSettings from "../Utils/NetworkSettings";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import AlertDialog from "../Dialogs/AlertDialog";
import MsgUtils from "../Utils/MsgUtils.js";

// MessageStructure is the central component that encompasses the Request and
// the response segments along with NetworkSettings etc
export default class MessageStructure extends React.Component {

  constructor(props) {
    super(props);
    //console.log(this.props);
    //console.log("$msg_structure$", this.props.specs, this.props.spec, this.props.msg);

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
      responseData: null,
      reqMenuVisible: false,
      selectedReqMenuItem: null,
      reqClipboardData: null
    };

    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.appendFieldContent = this.appendFieldContent.bind(this);
    this.sendToHost = this.sendToHost.bind(this);
    //this.addFieldContent = this.addFieldContent.bind(this);
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

    this.showMenu = this.showMenu.bind(this);
    this.hideMenu = this.hideMenu.bind(this);
    this.handleMenuClick = this.handleMenuClick.bind(this);

    this.showResponseDialog = this.showResponseDialog.bind(this);
    this.getTemplateLabel = this.getTemplateLabel.bind(this);
    this.networkSettingsChanged = this.networkSettingsChanged.bind(this);
    this.hideResponse = this.hideResponse.bind(this);

  }

  networkSettingsChanged(ip, port, mliType) {
    this.setState({targetServerIp: ip, targetServerPort: port, mliType: mliType})
  }

  showMenu(event) {

    this.setState({
      selectedReqMenuItem: event.currentTarget, reqMenuVisible: true
    })

  }

  hideMenu() {
    this.setState({reqMenuVisible: false})
    this.setState({selectedReqMenuItem: null})
  }

  showResponseDialog() {
    this.hideMenu()
    this.setState({showResponse: true})
  }

  hideResponse() {
    this.setState({showResponse: false})

  }

  handleMenuClick(event) {
    alert(event.currentTarget)

    this.setState({selectedReqMenuItem: event.currentTarget})
    this.hideMenu()
  }

  // Receives the trace as a callback from ParseMessageDialog component
  setTrace(trace) {
    if (trace != null) {
      //console.log("trace  = ", trace);
      // now parse this via a API call

      axios.post(appProps.parseTraceUrl + '/' + this.state.spec.ID + '/' + this.state.msg.ID, trace)
      .then(res => {
        console.log("parsed msg data", res.data);
        res.data.parsed_fields.forEach(fd => {
          let fieldComponent = this.state.isoMsg.get(fd.ID);
          fieldComponent.setState({selected: true, fieldValue: fd.Value});
        });
      }).catch(e => {

        console.log("error", e);
        this.processError(e)
      })

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

    if (selectedMsg != null) {
      axios.get(appProps.loadMsgUrl, {
        params: {
          specId: this.state.spec.ID, msgId: this.state.msg.ID, dsName: selectedMsg
        }
      }).then(res => {
        console.log("saved msg = ", res.data.saved_message);
        res.data.saved_message.forEach(fd => {
          let fieldComponent = this.state.isoMsg.get(fd.ID);
          fieldComponent.setState({selected: true, fieldValue: fd.Value});
        });
      }).catch(e => {
        console.log(e);
        this.processError(e)
      })
    }

  }

  showInfoDialog(msg) {
    this.setState({errDialogVisible: true, errorMessage: msg})
  }

  msgSaveSuccess(msgName, updated) {
    let type = "saved";
    if (updated) {
      type = "updated"
    }
    this.showInfoDialog(`Message ${msgName} ${type} successfully.`);
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
    let validationErrors = [];
    MsgUtils.getMsgContent(this.state.isoMsg, content, validationErrors)
    this.setState({saveData: content, showSaveMsgDialog: true})
  }

  showTraceInputsDialog() {
    this.hideMenu()
    this.setState({showTraceInputDialog: true})

  }

  showLoadMessagesDialog() {
    this.hideMenu()
    this.setState({showLoadMessagesDialog: true})

  }

  closeErrorDialog() {
    this.setState({errDialogVisible: false})
  }

  showErrorDialog() {
    this.setState({errDialogVisible: true});
  }

  //sends the message (as JSON) to the API server to be sent to the ISO host
  sendToHost() {

    this.hideMenu()

    let content = [];
    let validationErrors = [];

    MsgUtils.getMsgContent(this.state.isoMsg, content, validationErrors)

    if (validationErrors.length > 0) {
      let errMsg = "";
      validationErrors.forEach(e => errMsg += e + "\n");
      this.setState({errorMessage: errMsg});
      this.showErrorDialog();
      return
    }

    console.log(content)
    let reqClipboardData = content.reduce((p, c, currentIndex) => {

      if (currentIndex === 1) {
        return p.Name + ":" + p.Value + "\n" + c.Name + ":" + c.Value + "\n";
      }
      return p + c.Name + ':' + c.Value + "\n";

    });

    //alert(reqClipboardData)

    //lets not hide and then show the response segment again
    this.setState({
      showResponse: false, responseData: null, reqClipboardData: reqClipboardData
    });

    let postData = 'host=' + this.state.targetServerIp + "&port=" + this.state.targetServerPort
        + '&mli=' + this.state.mliType + '&specId=' + this.state.spec.ID + '&msgId='
        + this.state.msg.ID + "&msg=" + JSON.stringify(content);
    //console.log(postData)
    axios.post(appProps.sendMsgUrl, postData).then(res => {
      console.log("Response from server", res.data.response_fields);
      this.setState({showResponse: true, responseData: res.data.response_fields});

    }).catch(e => {
      console.log("error = ", e);
      this.processError(e)
    })

  }

  processError(e) {

    if (!e.response) {
      console.log("Error = ", e);
      this.setState({
        errorMessage: 'Error: Unable to reach API server', errDialogVisible: true
      });
      return
    }

    console.log(e.response)

    if (e.response.status === 400) {
      this.setState({errorMessage: e.response.data.error, errDialogVisible: true});
    } else {
      this.setState({
        errorMessage: 'Unexpected error from server - ' + e.response.status, errDialogVisible: true
      });
    }
  }

  getTemplateLabel() {
    //alert(this.state.spec + "// " + this.state.msg)
    return this.state.spec.Name + " // " + this.state.msg.Name;
  }

  onFieldUpdate(e) {
    //console.log("field updated =>" + e.fieldName)
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

    let url = appProps.templateUrl + '/' + spec.ID + "/" + msg.ID;
    console.log(url);
    axios.get(url).then(res => {
      //console.log(res.data);
      let isoMsg = new Map();
      isoMsg.set("msg_template", res.data);
      isoMsg.set("spec_id", spec.ID);
      isoMsg.set("msg_id", msg.ID);
      this.setState({
        spec: spec, msg: msg, msgTemplate: res.data, loaded: true, isoMsg: isoMsg
      });

      console.log("MsgTemplate = ", this.state.msgTemplate);
    }).catch(err => {
      console.log(err)
      this.setState({errorMessage: err, errDialogVisible: true})
    });
  }

  appendFieldContent(content, field, isoMsg, level) {
    content.push(<IsoField key={field.ID} field={field} isoMsg={isoMsg}
                           level={level}
                           onFieldUpdate={this.onFieldUpdate}/>);
  }

  render() {

    let content = [];
    if (this.state.loaded === true) {
      this.state.msgTemplate.fields.map(field => {
        this.appendFieldContent(content, field, this.state.isoMsg, 0)
      })
    }

    return (

        <div style={{
          fontFamily: 'lato-regular', fontSize: '12px', fill: 'aqua'
        }}>

          <AlertDialog show={this.state.errDialogVisible}
                       msg={this.state.errorMessage}
                       onClose={this.closeErrorDialog}/>


          <SelectMessageDialog show={this.state.showLoadMessagesDialog}
                               specId={this.state.spec.ID}
                               msgId={this.state.msg.ID}
                               closeLoadMsgDialog={this.closeLoadMsgDialog}/>

          <ParseMessageDialog show={this.state.showTraceInputDialog}
                              setTrace={this.setTrace}/>

          <SaveMessageDialog show={this.state.showSaveMsgDialog}
                             msgId={this.state.msg.ID}
                             initialMessage={this.state.currentDataSet}
                             specId={this.state.spec.ID}
                             data={this.state.saveData}
                             msgName={this.state.currentDataSet}
                             msgSaveSuccess={this.msgSaveSuccess}
                             msgSaveFailed={this.msgSaveFailed}
                             msgSaveCancelled={this.msgSaveCancelled}/>

          <NetworkSettings onChange={this.networkSettingsChanged}/>


          <div align={"left"}
               style={{
                 align: "left", display: "inline-block", width: "40%", float: "left", fill: 'aqua'
               }}>

            <div>

              <ButtonGroup size={"small"} color={"primary"} fullWidth={true}
                           variant={"contained"}>
                <Button
                    onClick={this.showTraceInputsDialog}>Parse</Button>
                <Button
                    onClick={this.showLoadMessagesDialog}>Load</Button>
                <Button
                    onClick={this.showSaveMsgDialog}>Save</Button>
                <Button onClick={this.sendToHost}>Send</Button>
                <Button onClick={this.showResponseDialog}
                        disabled={this.state.responseData == null}>Show
                  Response</Button>
              </ButtonGroup>

            </div>

            {/*TODO:: pull this into a separate component*/}
            <Paper variation={"outlined"} style={{verticalAlign: "middle"}}>
              <table border="0" align={"center"}
                     style={{align: "center", marginTop: "10px", width: "80%"}}>
                <thead>
                <tr style={{
                  fontFamily: "lato-regular",
                  backgroundColor: "#ff8f5b",
                  fontSize: "15px",
                  borderBottom: 'solid',
                  borderColor: 'blue'
                }}>
                  <td colSpan="3" align={"center"}>

                    {/*
                      <div style={{display: "inline-block", float: "left"}}>
                        <IconButton
                            aria-label="more"
                            aria-controls="long-menu"
                            aria-haspopup="true"
                            onClick={this.showMenu}
                        >
                          <MoreVert/>
                        </IconButton>

                        <Menu
                            id="fade-menu"
                            anchorEl={this.state.selectedReqMenuItem}
                            getContentAnchorEl={null}
                            keepMounted
                            open={this.state.reqMenuVisible}
                            onClose={this.hideMenu}
                            TransitionComponent={Fade}
                        >
                          <MenuItem dense={true}
                                    onClick={this.showTraceInputsDialog}>Parse</MenuItem>
                          <MenuItem dense={true}
                                    onClick={this.showLoadMessagesDialog}>Load
                            Message</MenuItem>
                          <MenuItem dense={true}
                                    onClick={this.showSaveMsgDialog}>Save
                            Message</MenuItem>
                          <MenuItem dense={true} onClick={this.sendToHost}>Send
                            Message</MenuItem>
                          <MenuItem dense={true}
                                    onClick={this.showResponseDialog}>Show
                            Response</MenuItem>
                        </Menu>
                      </div>
                    */}
                    <div
                        style={{display: "inline-block"}}>{this.getTemplateLabel()}</div>
                  </td>
                </tr>
                <tr style={{
                  fontFamily: "lato-regular", backgroundColor: "#ff8f5b", fontSize: "14px",
                }}>
                  <td align={"center"}>Selection</td>
                  <td align={"center"} style={{width: '35%'}}> Field</td>
                  <td align={"center"} style={{width: '70%'}}>Field Data
                  </td>
                </tr>
                </thead>
                <tbody>
                {content}
                </tbody>
              </table>
            </Paper>

            {/*<div style={{float: "right"}}>*/}
            <ResponseSegment show={this.state.showResponse}
                             reqData={this.state.reqClipboardData}
                             onClose={this.hideResponse}
                             data={this.state.responseData}
                             dialogTitle={"Response - [" + this.getTemplateLabel() + "]"}
                             msgTemplate={this.state.msgTemplate}/>

          </div>


          <div style={{height: "10px"}}>{' '}</div>


        </div>

    );

  }

}

