import React from 'react'
import IsoField from "./IsoField/IsoField";
import Paper from "@material-ui/core/Paper";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import {Button} from "@material-ui/core";
import Draggable from "react-draggable";
import appProps, {AppProps} from "../Utils/Properties";
import TestCaseEvalResultDialog from "../Dialogs/TestCaseEvalResultDialog";

// ResponseSegment displays the response to an ISO message
export default class ResponseSegment extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: props.show,
            data: this.props.data,
            msgTemplate: this.props.msgTemplate,
            evalResults: null,
            showEvalResultsDialog: false
        }
        this.hideResponseSegment = this.hideResponseSegment.bind(this);
        this.copyToClipboard = this.copyToClipboard.bind(this);
        this.evalTestCase = this.evalTestCase.bind(this);
        this.showEvalResults = this.showEvalResults.bind(this);

        this.textAreaRef = React.createRef();
    }


    evalTestCase() {

        console.log("comparing ", this.props.data, " with ", this.props.testCase)
        let evalResults = []

        let respBmp = "";
        this.props.data.forEach(f => {
            if (f.Name == "Bitmap") {
                respBmp = f.Value;
            }
        });

        this.props.data.forEach(f => {
            this.props.testCase.resp_data.forEach(tf => {
                    if (f.ID == tf.ID) {

                        if (f.Name === "Bitmap") {
                            //compare bitmaps and see if any fields are missing or additional fields are present
                            let actualBmp = f.Value;
                            let tcBmp = tf.Value;

                            for (let i = 0; i < tcBmp.length; i++) {

                                if (i < actualBmp.length) {
                                    if (tcBmp.charAt(i) != actualBmp.charAt(i)) {
                                        if (tcBmp.charAt(i) == '1') {
                                            evalResults.push(`Field "${i + 1}" is missing in response`);
                                        } else {
                                            evalResults.push(`Additional Field "${i + 1}" is present in response`);
                                        }
                                    }
                                } else {
                                    if (tcBmp.charAt(i) == '1') {
                                        evalResults.push(`Field "${i + 1}" is missing in response`);
                                    }

                                }
                            }
                            //TODO:: if response bmp has additional bits
                        }
                        switch (tf.CompareOp) {
                            case "Exclude": {
                                break;
                            }
                            case "Equals": {
                                if (f.Value != tf.Value) {
                                    evalResults.push(`${f.Name} failed on ${tf.CompareOp} condition. Expected: ${tf.Value}, Actual: ${f.Value}`);
                                }
                                break;
                            }
                            case "StartsWith": {
                                if (!f.Value.startsWith(tf.Value)) {
                                    evalResults.push(`${f.Name} failed on ${tf.CompareOp} condition. Expected: ${tf.Value}, Actual: ${f.Value}`);
                                }
                                break;
                            }
                            case "EndsWith": {
                                if (!f.Value.endsWith(tf.Value)) {
                                    evalResults.push(`${f.Name} failed on ${tf.CompareOp} condition. Expected: ${tf.Value}, Actual: ${f.Value}`);
                                }
                                break;
                            }
                            default: {
                                evalResults.push(`${tf.Name} uses a yet to supported compare-op - ${tf.CompareOp}`)
                            }

                        }
                    }
                }
            )


        });
        console.log("er: ", evalResults);
        this.setState({evalResults: evalResults, showEvalResultsDialog: true});


    }

    appendFieldContent(content, field, idToField, level) {
        content.push(<IsoField key={'response_seg_' + field.ID} field={field}
                               id2Value={idToField}
                               readOnly={true} level={level}
                               onFieldUpdate={this.onFieldUpdate}/>);
        return ""
    }

    hideResponseSegment() {
        this.setState({show: false});
        this.props.onClose();
    }

    collectData(field, idToValue, content) {
        if (idToValue.get(field.ID)) {
            let val = idToValue.get(field.ID);
            content.push(`${field.Name}: ${val}`);
        }
        if (field.Children.length > 0) {
            field.Children.forEach(cf => {
                this.collectData(cf, idToValue, content)
            })
        }

    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (prevProps.show === false && this.props.show === true) {
            this.setState({
                show: true, data: this.props.data, msgTemplate: this.props.msgTemplate
            })
        }
    }

    copyToClipboard() {
        this.textAreaRef.current.select();
        if (!document.execCommand('copy')) {
            alert('Failed to copy to clipboard!')
        }
    }

    showEvalResults(show) {
        this.setState({showEvalResultsDialog: show})
    }


    render() {

        let content = [];
        let forClipboard = [];
        if (this.state.show) {

            let idToField = new Map();
            this.state.data.forEach(f => {
                idToField.set(f.ID, f.Value);
            });

            this.state.msgTemplate.fields.forEach(field => {
                this.collectData(field, idToField, forClipboard)
            });
            let clipboardText = "ISO Response  \n|---------------|\n" + forClipboard.reduce(
                (p, c, currentIndex) => {
                    if (currentIndex === 1) {
                        return p + "\n" + c + "\n";
                    } else {
                        return p + c + "\n";
                    }
                })

            clipboardText = "ISO Request  \n|---------------|\n" + this.props.reqData + "\n\n"
                + clipboardText + "\n\n";

            this.state.msgTemplate.fields.forEach(field => {
                this.appendFieldContent(content, field, idToField, 0)
            });

            //console.log(content);

            return (<React.Fragment>


                {this.state.show ? <Dialog open={this.state.show}
                                           onClose={this.hideResponseSegment} scroll={"paper"}
                                           PaperComponent={PaperComponent}
                                           aria-labelledby="draggable-dialog-title"
                                           maxWidth={"md"} fullWidth={true}
                                           disableBackdropClick={true}>
                    <DialogTitle style={{cursor: 'move'}}
                                 id="draggable-dialog-title">{this.props.dialogTitle}</DialogTitle>
                    <DialogContent dividers={true}>

                        <TestCaseEvalResultDialog show={this.state.showEvalResultsDialog}
                                                  results={this.state.evalResults}
                                                  onClose={() => this.showEvalResults(false)}/>

                        <Paper>
          <textarea ref={this.textAreaRef}
                    style={{
                        opacity: "0.01", position: "absolute", zIndex: -9999, height: 0
                    }} value={clipboardText}/>


                            <table border="0" align={"center"}>
                                <thead>
                                <tr style={{
                                    fontFamily: "lato-regular",
                                    backgroundColor: "#eed143",
                                    fontSize: "15px",
                                    align: "center",
                                    borderBottom: 'solid',
                                    borderColor: 'blue'
                                }}>
                                    <td colSpan="3"
                                        align={"center"}>{"Response Segment"}</td>
                                </tr>
                                <tr style={{
                                    fontFamily: "lato-regular", backgroundColor: "#3effba", fontSize: "14px",
                                }}>
                                    <td align={"center"}>Selection</td>
                                    <td align={"center"} style={{width: "35%"}}>Field</td>
                                    <td align={"center"} style={{width: "50%"}}>Field Data
                                    </td>
                                </tr>
                                </thead>
                                <tbody>
                                {content}
                                </tbody>
                            </table>
                        </Paper>
                    </DialogContent>
                    <DialogActions>
                        {this.props.testCase.resp_data != null ? <Button onClick={this.evalTestCase} size="small"
                                                                         color="primary"
                                                                         variant={"contained"}>
                            Evaluate Test Case
                        </Button> : null}
                        <Button onClick={this.copyToClipboard} size="small"
                                color="primary"
                                variant={"contained"}>
                            Copy To Clipboard
                        </Button>
                        <Button onClick={this.hideResponseSegment} size="small"
                                color="primary"
                                variant={"contained"}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog> : null}
            </React.Fragment>);

        } else {
            return null;
        }

    }
}

function PaperComponent(props) {
    return (<Draggable handle="#draggable-dialog-title"
                       cancel={'[class*="MuiDialogContent-root"]'}>
        <Paper {...props} />
    </Draggable>);
}