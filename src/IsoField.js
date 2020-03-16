import React from "react";

export default class IsoField extends React.Component {

  constructor(props) {
    super(props);
    this.state = {fieldValue: ""};
    this.fieldValueChanged = this.fieldValueChanged.bind(this);
  }

  fieldValueChanged() {
    console.log(this.props.isoMsg);
    this.props.isoMsg.set(this.props.field.Id, this.state.fieldValue);
  }

  render() {
    return (
        <React.Fragment>
          <td><input type={"checkbox"}/></td>
          <td>{this.props.field.Name}</td>
          <td><input type={"text"} value={this.state.fieldValue}
                     onChange={this.fieldValueChanged()}/></td>
        </React.Fragment>
    );
  }

}