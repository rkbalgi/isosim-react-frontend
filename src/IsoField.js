import React from "react";
import ExpandedText from './ExpandedText.js'
import {Button} from "react-bootstrap";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip'

// IsoField represents a single field from a ISO8583 specification
export default class IsoField extends React.Component {

  constructor(props) {
    super(props);

    this.fieldValueChanged = this.fieldValueChanged.bind(this);
    this.fieldSelectionChanged = this.fieldSelectionChanged.bind(this);
    this.onFieldUpdate = this.onFieldUpdate.bind(this);
    this.appendFieldContent = this.appendFieldContent.bind(this);
    this.setSelected = this.setSelected.bind(this);
    this.setNewValue = this.setNewValue.bind(this);
    this.showExpanded = this.showExpanded.bind(this);
    this.closeExpanded = this.closeExpanded.bind(this);
    this.getBgColor = this.getBgColor.bind(this);
    this.setError = this.setError.bind(this);

    //if the field is Message Type, MTI or Bitmap - it should stay selected
    //because they're mandatory fields in ISO

    this.selectable = true;
    //readOnly is true when displaying a response segment
    if (this.props.readOnly) {
      this.selectable = false;
      this.state = {
        bgColor: 'white',
        hasError: false,
        selected: true,
        id2Value: this.props.id2Value,
        fieldValue: this.props.id2Value.get(this.props.field.Id),
        showExpanded: false
      };
    } else {
      let defaultFieldValue = "";
      if (["Message Type", "MTI", "Bitmap"].includes(
          this.props.field.Name)) {
        this.selectable = false;
        if (this.props.field.Name === "Bitmap") {
          defaultFieldValue = Array(128).fill('0').reduce((p = "", c) => p + c);
        }

        this.state = {
          bgColor: "white",
          hasError: false,
          selected: true,
          fieldValue: defaultFieldValue,
          showExpanded: false
        };
      } else {
        this.state = {
          bgColor: "white",
          selected: false,
          hasError: false,
          fieldValue: defaultFieldValue,
          showExpanded: false
        };
      }
      this.props.isoMsg.set(this.props.field.Id, this);
    }
  }

  getBgColor() {
    if (this.state.hasError) {
      return "red";
    } else {
      return "white";
    }

  }

  setError(hasError) {
    this.setState({hasError: hasError});
  }

  showExpanded() {
    this.setState({showExpanded: true});
  }

  closeExpanded() {
    this.setState({showExpanded: false});
  }

  setNewValue(newValue) {
    this.setState({fieldValue: newValue, showExpanded: false});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.id2Value !== this.props.id2Value) {
      this.setState({
        fieldValue: this.props.id2Value.get(this.props.field.Id),
        id2Value: this.props.id2Value
      });
    }
  }

  onFieldUpdate(event) {
    console.log(
        `${this.props.field.Name}: Child field ${event.fieldName} has been updated. ChangeType: ${event.ChangeType}`);

    if (this.props.field.Type === 'Bitmapped') {
      // get the position of the field
      this.props.field.Children.forEach(f => {

        if (f.Name === event.fieldName) {
          let currentVal = this.state.fieldValue;
          let bits = Array.from(currentVal);
          console.log("Changing bit " + f.Position);
          if (event.ChangeType === 'FieldSelected') {
            bits[f.Position - 1] = '1';
            if (f.Position > 64) {
              bits[0] = '1';
            }
          } else if (event.ChangeType === 'FieldDeselected') {
            bits[f.Position - 1] = '0';

            //if all bits from 65 to 128 are off then turn bit 1 off
            let turnOff = true;
            for (let i = 65; i <= 128; i++) {
              if (bits[i - 1] === '1') {
                turnOff = false;
                break;
              }
            }
            if (turnOff) {
              bits[0] = '0';
            }

          }
          let newValue = bits.reduce((p = "", c) => p + c);
          this.setState({fieldValue: newValue})

        }
      })
    } else {

      let obj = {fieldName: this.props.field.Name};
      if (event.ChangeType === 'FieldSelected') {
        console.log("setting self as selected", this.props.field.Name);
        this.setState({selected: true});
        obj.ChangeType = "FieldSelected";
      } else if (event.ChangeType === 'FieldDeselected') {
        this.setState({selected: false});
        obj.ChangeType = "FieldDeselected";
      }

      // for fixed and variable type field, if they have children
      // the whole set of children and then let the parent know too

      this.props.field.Children.forEach(c => {
        if (event.ChangeType === 'FieldSelected') {
          this.props.isoMsg.get(c.Id).setSelected(true);
        } else if (event.ChangeType === 'FieldDeselected') {
          this.props.isoMsg.get(c.Id).setSelected(false);
        }
      });

      this.props.onFieldUpdate(obj);

    }
  }

  setSelected(selected) {

    this.setState({selected: selected});
    this.props.field.Children.forEach(c => {
      this.props.isoMsg.get(c.Id).setSelected(selected);
    });

  }

  fieldSelectionChanged(event) {

    let obj = {fieldName: this.props.field.Name};
    let selected = false;
    if (event.target.checked) {
      obj.ChangeType = "FieldSelected";
      selected = true;
    } else {
      obj.ChangeType = "FieldDeselected";
    }

    if (this.props.field.Type !== "Bitmapped") {
      this.setSelected(selected);
    }
    this.props.onFieldUpdate(obj)
  }

  fieldValueChanged(event) {
    this.setState({fieldValue: event.target.value});
    let obj = {fieldName: this.props.field.Name, ChangeType: "ValueChanged"};
    this.props.onFieldUpdate(obj)
  }

  appendFieldContent(content, field, parentField, id2Value, level) {

    let key = field.Id;
    if (this.props.readOnly) {
      key = 'response_seg_' + field.Id;
    }
    content.push(<IsoField key={key} field={field} id2Value={id2Value}
                           readOnly={this.props.readOnly}
                           parentField={parentField} isoMsg={this.props.isoMsg}
                           level={level}
                           onFieldUpdate={this.onFieldUpdate}/>);
  }

  render() {

    let selectionColumnContent;

    if (this.selectable) {
      selectionColumnContent =
          <td align={"center"}><input type={"checkbox"}
                                      checked={this.state.selected}
                                      onChange={this.fieldSelectionChanged}/>
          </td>
    } else {
      selectionColumnContent =
          <td align={"center"}><input type={"checkbox"}
                                      disabled={true} checked={true}
                                      onChange={this.fieldSelectionChanged}/>
          </td>
    }

    let fieldSpecColumnContent;
    let positionInParent = "";
    if (this.props.field.ParentId > 0) {
      positionInParent = "\u2937" + this.props.field.Position + " ";
    }

    let fieldInfo = positionInParent + " Type: " + this.props.field.Type
        + ' / ';
    if (this.props.field.Type === 'Fixed') {
      fieldInfo += "Length: " + this.props.field.FixedSize + ' / '
          + 'Encoding: '
          + this.props.field.DataEncoding;
    } else if (this.props.field.Type === 'Variable') {
      fieldInfo += "Length Indicator: " + this.props.field.LengthIndicatorSize
          + ' / ' + 'Length Encoding: ' + this.props.field.LengthEncoding
          + ' / ' + 'Data Encoding: ' + this.props.field.DataEncoding;
    } else if (this.props.field.Type === 'Bitmapped') {
    }

    let children = [];

    this.props.field.Children.forEach(
        c => this.appendFieldContent(children, c, this.props.field,
            this.state.id2Value, this.props.level + 1));

    let levelIndicator = "";
    for (let i = 0; i < this.props.level; i++) {
      levelIndicator += '\u2193';
    }

    return (
        <React.Fragment>
          <tr>
            {/* selection column */}
            {selectionColumnContent}

            {/* field name column*/}

            <OverlayTrigger overlay={(
                <Tooltip id="hi"
                         style={{fontSize: '10px'}}>{fieldInfo}</Tooltip>)}
                            placement="top">
              <td style={{
                width: "100px",
                fontFamily: "lato-regular",
                fontSize: "14px"
              }}>
                <span
                    style={{color: 'blue'}}>{levelIndicator+' '}</span>{this.props.field.Name}
              </td>
            </OverlayTrigger>

            {/* field specification column */}
            {/*fieldSpecColumnContent*/}

            {/* field value column */}
            <td>
              <input type="text" value={this.state.fieldValue}
                     style={{
                       fontFamily: "courier new",
                       backgroundColor: this.getBgColor()
                     }}
                     onChange={this.fieldValueChanged}
                     disabled={this.props.readOnly}
                     ondblclick={this.showExpanded}/>
              <Button size={"sm"} style={{
                float: 'right',
                fontSize: '10px',
                marginRight: '10px'
              }}
                      onClick={this.showExpanded}> + </Button>{' '}
              <Button size={"sm"} style={{
                float: 'right',
                fontSize: '10px'
              }}
                      onClick={this.closeExpanded}> - </Button>

            </td>

          </tr>
          <tr>
            <td colSpan="3">
              <ExpandedText show={this.state.showExpanded}
                            value={this.state.fieldValue}
                            readOnly={this.props.readOnly}
                            onClose={this.setNewValue}/>
            </td>
          </tr>
          {children}
        </React.Fragment>

    );
  }

}