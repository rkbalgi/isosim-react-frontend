import React from 'react';
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PinGenBox from "./PinGenBox";
import MacGenBox from "./MacGenBox";

// FieldExtras shows additional options for a field and an option to view/edit
// field value within a large field (TextArea) and is useful when editing fields with large values
export default class FieldExtras extends React.Component {

  constructor(props) {
    super(props);

    this.state = {show: this.props.show, value: this.props.value};
    this.closeThis = this.closeThis.bind(this);
    this.valueChanged = this.valueChanged.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  valueChanged(event) {
    this.setState({value: event.target.value});
  }

  closeThis() {
    this.setState({show: true});
    this.props.onClose(this.state.value);
  }

  setValue(val) {
    this.setState({value: val})
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.show === false && this.props.show === true && this.state.show === false) {
      this.setState({show: true, value: this.props.value})
    } else if (this.props.show === false && this.state.show === true) {
      this.setState({show: false, value: this.props.value})
    }
  }

  render() {

    let dynamicGenerators = null;

    if (!this.props.readOnly) {
      //only for request fields

      if (this.props.field.GenType === 'pin_gen') {
        dynamicGenerators = <PinGenBox field={this.props.field} setPinBlock={this.setValue}
                                       isoMsg={this.props.isoMsg}/>
      } else if (this.props.field.GenType === 'mac_gen') {
        dynamicGenerators =
            <MacGenBox field={this.props.field} setMac={this.setValue} isoMsg={this.props.isoMsg}/>
      }
    }

    return (

        (this.state.show === true) ?

            <React.Fragment>
              <div style={{
                width: '100%', height: '100%', paddingTop: "20px", paddingBottom: "20px"
              }}>

                {dynamicGenerators}
                <div style={{paddingBottom: "5px", paddingTop: "10px"}}>
                  <TextField fullWidth={true} rows={4} multiline={true} variant={"outlined"}
                             label={"Field Value"} style={{paddingBottom: "5px"}}
                             onChange={this.valueChanged} disabled={this.props.readOnly}
                             value={this.state.value}/>

                  <div style={{float: "right", paddingBottom: '5px'}}>
                    <Button size={"small"} variant={"contained"} color={"primary"}
                            onClick={this.closeThis}> OK </Button>
                  </div>
                </div>
              </div>
            </React.Fragment> : null);
  }

}