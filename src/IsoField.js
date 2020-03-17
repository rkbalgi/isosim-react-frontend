import React from "react";

// IsoField represents a single field from a ISO8583 specification
export default class IsoField extends React.Component {

  constructor(props) {
    super(props);
    //this.state = {fieldValue: "", selected: false};
    this.fieldValueChanged = this.fieldValueChanged.bind(this);
    this.fieldSelectionChanged = this.fieldSelectionChanged.bind(this);
    //this.msgFromChildField = this.msgFromChildField.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.appendFieldContent = this.appendFieldContent.bind(this);

    this.selectable = true;
    //if the field is Message Type, MTI or Bitmap - it should stay selected
    //because they're mandatory fields in ISO

    let defaultFieldValue = "";

    if (["Message Type", "MTI", "Bitmap"].includes(this.props.field.Name)) {
      this.selectable = false;
      if (this.props.field.Name === "Bitmap") {
        defaultFieldValue = Array(128).fill('0').reduce((p = "", c) => p + c);
      }

      this.state = {selected: true, fieldValue: defaultFieldValue};
    } else {
      this.state = {selected: false, fieldValue: defaultFieldValue};
    }

  }

  onFieldUpdate(event) {
    console.log("called from " + this.props.field.fieldName + +" = "
        + event.fieldValue);
    //console.log(event.fieldName);
  }

  fieldSelectionChanged(event) {
    if (event.target.checked) {
      this.setState({selected: true});
    } else {
      this.setState({selected: false});
    }
  }

  fieldValueChanged(event) {
    //alert(event.target.value);
    this.setState({fieldValue: event.target.value});
    this.props.onFieldUpdate({fieldName: this.props.field.fieldName})
    //this.props.isoMsg.set(this.props.field.Id, this.state.fieldValue);
  }

  appendFieldContent(content, field) {
    content.push(<IsoField field={field}
                           onFieldUpdate={this.onFieldUpdate(this.state)}/>);

    field.Children.forEach(
        c => this.appendFieldContent(content, c));

  }

  render() {

    let selectionColumnContent;

    if (this.selectable) {
      selectionColumnContent =
          <td align={"center"}><input type={"checkbox"}
                                      value={this.state.selected}
                                      onChange={this.fieldSelectionChanged}/>
          </td>
    } else {
      selectionColumnContent =
          <td align={"center"}><input type={"checkbox"}
                                      value={this.state.selected}
                                      disabled={true} checked={true}
                                      onChange={this.fieldSelectionChanged}/>
          </td>
    }

    let fieldSpecColumnContent;
    if (this.props.field.Type === 'Fixed') {
      fieldSpecColumnContent = <React.Fragment>
        <td>
          <div className={"class_small_div"}>F</div>
          <div className={"class_small_div"}>{this.props.field.FixedSize}</div>
          <div
              className={"class_small_div"}>{this.props.field.DataEncoding.toLowerCase()}</div>
        </td>
      </React.Fragment>;
    } else if (this.props.field.Type === 'Variable') {
      fieldSpecColumnContent = <React.Fragment>
        <td>
          <div className={"class_small_div"}>V</div>
          <div
              className={"class_small_div"}>{this.props.field.LengthIndicatorSize}</div>
          <div
              className={"class_small_div"}>{this.props.field.LengthEncoding.toLowerCase()}</div>
          <div
              className={"class_small_div"}>{this.props.field.DataEncoding.toLowerCase()}</div>

        </td>
      </React.Fragment>;
    } else if (this.props.field.Type === 'Bitmapped') {

      fieldSpecColumnContent = <React.Fragment>
        <td>
          <div className={"class_small_div"}>B</div>
        </td>
      </React.Fragment>;
    }

    let children = [];
    this.props.field.Children.forEach(
        c => this.appendFieldContent(children, c));

    return (
        <React.Fragment>
          <tr>
            {/* selection column */}
            {selectionColumnContent}

            {/* field name column*/}
            <td style={{
              width: "200px",
              fontFamily: "ptserif-regular",
              fontSize: "13px"
            }}>
              {this.props.field.Name}
            </td>

            {/* field specification column */}
            {fieldSpecColumnContent}

            {/* field value column */}
            <td><input type="text" value={this.state.fieldValue}
                       style={{fontFamily: "courier new"}}
                       onChange={this.fieldValueChanged}/>
            </td>
          </tr>
          {children}
        </React.Fragment>

    );
  }

}