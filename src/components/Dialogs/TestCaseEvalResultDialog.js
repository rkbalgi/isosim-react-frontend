import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {InputLabel, TextField} from "@material-ui/core";

export default class TestCaseEvalResultDialog extends React.Component {

    constructor(props) {
        super(props);


        this.state = {show: props.show};


        this.handleClose = this.handleClose.bind(this);
    }

    handleClose() {
        this.setState({show: false})
        this.props.onClose();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.show === true && prevState.show === false) {

            let evalResult = "Testcase passed!";
            if (this.props.results != null && this.props.results.length > 0) {
                evalResult = "Testcase failed!\n\n";
                this.props.results.forEach(r => {
                    evalResult += "\u26A0 " + r + "\n";
                })
            }

            this.setState({show: true,evalResult: evalResult});
        }
    }

    render() {


        return (<Dialog
            open={this.state.show} fullWidth={true} maxWidth={"md"}
            onClose={this.handleClose} disableBackdropClick={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">

            <DialogTitle
                id="alert-dialog-title">{"Test Case Evaluation Result"}</DialogTitle>
            <DialogContent>
                <TextField variant={"standard"} size={"medium"} contentEditable={"false"} multiline={true} rows={10}
                           rowsMax={20} fullWidth={true}
                           value={this.state.evalResult}/>
            </DialogContent>
            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                    OK
                </Button>
            </DialogActions>
        </Dialog>);

    }
}