import React, {useEffect, useState} from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import {TextField} from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import axios from "axios";
import appProps from "../Utils/Properties";
import AlertDialog from "./AlertDialog";

export default class TCOptionsDialog extends React.Component {

    constructor(props) {
        super(props);


        this.state = {show: props.show, errorMsg: null};

        this.handleClose = this.handleClose.bind(this);
        this.handleCancel = this.handleCancel.bind(this);

    }

    handleClose() {


        if (this.props.msgName != null && this.props.msgName != "") {
            // update flow
            let responseRef = '&response_msg=' + JSON.stringify(this.props.responseData);
            let postData = `specId=${this.props.specId}&msgId=${this.props.msgId}&dsName=${this.props.msgName}&updateMsg=true${responseRef}`;

            axios.post(appProps.saveMsgUrl, postData).then(res => {
                console.log(res);

                //this.setState({show: false})
                this.props.onClose();
                return;

            }).catch(e => {

                    console.log(e)
                    this.setState({errorMsg: " Failed to save TC conditions. - " + e?.response?.data?.error});
                    return
                }
            );
        } else {
            this.setState({show: false})
            this.props.onClose();
        }


    }

    handleCancel() {
        this.setState({show: false})
        this.props.onCancel();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {

        if (this.props.show === true && prevState.show === false) {
            this.setState({show: true});
        } else if (this.props.show === false && prevState.show === true) {
            this.setState({show: false});
        }
    }

    render() {

        let comps = [];
        if (this.state.show) {
            this.props.responseData.forEach(f => {
                comps.push(<TCFieldConfig key={"topt_" + f.ID} field={f}/>)
            })
        }


        return (<Dialog
            open={this.state.show} fullWidth={true} maxWidth={"md"}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">

            <DialogTitle
                id="alert-dialog-title">{"Test Case Config"}</DialogTitle>
            <DialogContent>
                <div style={{width: "100%"}}>
                    {comps}
                </div>

            </DialogContent>

            <AlertDialog show={this.state.errorMsg != null} msg={this.state.errorMsg} onClose={() => {
                this.setState({errorMsg: null});
            }}/>

            <DialogActions>
                <Button onClick={this.handleClose} color="primary" variant={"contained"}>
                    OK/Save
                </Button>
                <Button onClick={this.handleCancel} color="secondary" variant={"contained"}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog>);

    }
}

function TCFieldConfig(props) {

    const [option, setOption] = useState("Equals")

    useEffect(() => {
        if (props.field.CompareOp == undefined || props.field.CompareOp == null) {
            props.field.CompareOp = "Equals";
        } else {
            setOption(props.field.CompareOp);
        }
    }, [])


    const compOpChanged = (event) => {
        props.field.CompareOp = event.target.value;
        setOption(event.target.value);

    }

    return (

        <React.Fragment>

            <Grid container={true} style={{width: "100%"}} spacing={"1"}>
                <Grid item={true} sm={2}>
                    {props.field.Name}
                </Grid>
                <Grid item={true} sm={2}>
                    <TextField value={option} onChange={compOpChanged} variant={"outlined"} size={"small"}
                               margin={"dense"}
                               label={"Operator"} select={true}>
                        <MenuItem value={"Equals"}>Equals</MenuItem>
                        <MenuItem value={"Exclude"}>Exclude</MenuItem>
                        <MenuItem value={"Present"}>Present</MenuItem>
                        <MenuItem value={"Absent"}>Absent</MenuItem>
                        <MenuItem value={"StartsWith"}>StartsWith</MenuItem>
                        <MenuItem value={"EndsWith"}>EndsWith</MenuItem>
                    </TextField>
                </Grid>
                <Grid item={true} sm={6}>
                    <TextField defaultValue={props.field.Value} variant={"standard"}/>
                </Grid>


            </Grid>


        </React.Fragment>

    );


}