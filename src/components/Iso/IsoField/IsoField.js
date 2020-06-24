import React from "react";
import FieldExtras from '../../Utils/FieldExtras.js'
import {Button, TextField} from "@material-ui/core";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from 'react-bootstrap/Tooltip'
import Checkbox from "@material-ui/core/Checkbox";
import InputLabel from "@material-ui/core/InputLabel";
import fieldValidator from "../../Utils/FieldValidator";
import {AppProps} from "../../Utils/Properties";
import HintHelper from "../../Utils/HintHelper";
import CountryCodePicker from "../../Utils/CountryCodePicker";
import Grid from "@material-ui/core/Grid";
import CurrencyCodePicker from "../../Utils/CurrencyCodePicker";
import EnumeratedPicker from "../../Utils/EnumeratedPicker";

// IsoField represents a single field from a ISO8583 specification
export default class IsoField extends React.Component {

    static MandatoryFields = ["Message Type", "MTI", "Bitmap"];

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
        this.toggleExpanded = this.toggleExpanded.bind(this);
        this.onFocusLost = this.onFocusLost.bind(this);
        this.applyPadding = this.applyPadding.bind(this);
        this.setValue = this.setValue.bind(this);

        //if the field is Message Type, MTI or Bitmap - it should stay selected
        //because they're mandatory fields in ISO

        let initialExpandBtnLabel = '+';
        this.selectable = true;

        if (this.props.readOnly) {
            //readOnly is true when displaying a response segment

            this.selectable = false;

            let selected = false;
            let fieldValue = this.props.id2Value.get(this.props.field.ID)
            if (fieldValue) {
                selected = true;
            }

            this.state = {
                fieldEditable: true,
                bgColor: 'white',
                hasError: false,
                selected: selected,
                id2Value: this.props.id2Value,
                fieldValue: fieldValue,
                expandBtnLabel: initialExpandBtnLabel,
                showExpanded: false,
                field: this.props.field
            };
        } else {

            // for request segment

            let defaultFieldValue = "";
            let selected = false;

            // if there are any hints, process them
            defaultFieldValue = HintHelper.generateValue(this.props.field)

            if (this.props.isoMsg.has(this.props.field.ID)) {
                let tmpField = this.props.isoMsg.get(this.props.field.ID)
                defaultFieldValue = tmpField.state.fieldValue;
                selected = tmpField.state.selected;
            }
            if (IsoField.MandatoryFields.includes(this.props.field.Name)) {

                //mandatory fields which cannot be deselected (bitmap is not editable as well)

                this.selectable = false;
                let fieldEditable = true;
                if (defaultFieldValue === "" && this.props.field.Name === "Bitmap") {
                    defaultFieldValue = Array(128).fill('0').reduce((p = "", c) => p + c);
                }


                if (this.props.field.Name === "Bitmap") {
                    fieldEditable = false;
                }

                this.state = {
                    fieldEditable: fieldEditable,
                    bgColor: "white",
                    hasError: false,
                    selected: true,
                    fieldValue: defaultFieldValue,
                    expandBtnLabel: initialExpandBtnLabel,
                    showExpanded: false,
                    field: this.props.field
                };

            } else {
                this.state = {
                    fieldEditable: true,
                    bgColor: "white",
                    selected: selected,
                    hasError: false,
                    fieldValue: defaultFieldValue,
                    expandBtnLabel: initialExpandBtnLabel,
                    showExpanded: false,
                    field: this.props.field
                };
            }
            this.props.isoMsg.set(this.props.field.ID, this);
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

    toggleExpanded() {
        if (this.state.showExpanded) {
            this.setState({showExpanded: false, expandBtnLabel: '+'});
        } else {
            this.setState({showExpanded: true, expandBtnLabel: '-'});
        }

    }

    closeExpanded() {
        this.setState({showExpanded: false});
    }

    setNewValue(newValue) {

        //alert(newValue)
        let val = this.applyPadding(this.state.selected, newValue);
        this.setState({fieldValue: val, showExpanded: false, selected: true});
        this.toggleExpanded()
    }

    setValue(newValue) {
        this.setState({fieldValue: newValue, showExpanded: false});
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id2Value !== this.props.id2Value) {
            this.setState({
                fieldValue: this.props.id2Value.get(this.props.field.ID), id2Value: this.props.id2Value
            });
        }
    }

    onFieldUpdate(event) {

        if (this.props.field.Type === AppProps.BitmappedField) {
            // get the position of the field
            this.props.field.Children.forEach(f => {

                if (f.Name === event.fieldName) {
                    let currentVal = this.state.fieldValue;
                    if (f.Position > 64 && currentVal.length == 64) {
                        // if we're dealing with a secondary bitmap and there is only
                        // a primary bitmap available, first extend it
                        Array(64).fill('0').forEach(p => currentVal += p);
                    }


                    let bits = Array.from(currentVal);

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
                //console.log("setting self as selected", this.props.field.Name);
                this.setState({selected: true});
                obj.ChangeType = "FieldSelected";
            } else if (event.ChangeType === 'FieldDeselected') {
                this.setState({selected: false});
                obj.ChangeType = "FieldDeselected";
            } else {

                //TODO:: field value has changed, it needs to be parsed and children
                // have to be changed - wait for the new WASM library for ISO parsing capabilities
                // on the frontend :-)


            }

            // for fixed and variable type field, if they have children
            // the whole set of children and then let the parent know too

            this.props.field.Children.forEach(c => {
                if (event.ChangeType === 'FieldSelected') {
                    this.props.isoMsg.get(c.ID).setSelected(true);
                } else if (event.ChangeType === 'FieldDeselected') {
                    this.props.isoMsg.get(c.ID).setSelected(false);
                }
            });

            //pass on the message to the parent that I have changed
            this.props.onFieldUpdate(obj);

        }
    }

    setSelected(selected) {

        let val = this.applyPadding(selected);
        this.props.field.Children.forEach(c => {
            this.props.isoMsg.get(c.ID).setSelected(selected);
        });

        if (selected) {
            let errors = []
            if (fieldValidator.validate(this.props.field, val, errors)) {
                this.setState({fieldValue: val, hasError: true, errMsg: errors[0], selected: selected});
            } else {
                this.setState({fieldValue: val, hasError: false, errMsg: null, selected: selected});
            }
        } else {
            this.setState({fieldValue: val, hasError: false, errMsg: null, selected: selected});
        }

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

        if (this.props.field.Type !== AppProps.BitmappedField) {
            this.setSelected(selected);
        }
        this.props.onFieldUpdate(obj)
    }

    onFocusLost() {

        let val = this.applyPadding(this.state.selected)

        let errors = []
        if (this.state.selected) {
            if (fieldValidator.validate(this.props.field, val, errors)) {
                this.setState({fieldValue: val, hasError: true, errMsg: errors[0]})
            } else {

                this.setState({fieldValue: val, hasError: false, errMsg: null});
                let obj = {
                    fieldName: this.props.field.Name, ChangeType: "ValueChanged", Value: val
                };
                this.props.onFieldUpdate(obj)
            }
        } else {
            this.setState({fieldValue: val, hasError: false, errMsg: null});
        }
    }

    //This method applied to the field if one is specified in the field definition
    // selected - A boolean that represents if the field is currently selected (padding is applied only if the field is selected)
    // initVal - The initial value for the field, if unspecified the current value on the state is used
    applyPadding(selected, initVal = "") {

        let val = initVal;

        if (val === "") {
            val = this.state.fieldValue;
        }

        if (val === undefined) {
            val = "";
        }

        let field = this.state.field;
        if (field.Padding === "" || !selected) {
            return val
        }

        if (field.Type === 'Fixed') {

            let padding = '';
            switch (field.DataEncoding) {
                case 'ASCII':
                case 'EBCDIC': {

                    if (val.length < field.FixedSize) {
                        for (let i = 0; i < (field.FixedSize - val.length); i++) {
                            if (field.Padding === 'LEADING_ZEROES' || field.Padding === 'TRAILING_ZEROES') {
                                padding += '0';
                            }
                            if (field.Padding === 'LEADING_SPACES' || field.Padding === 'TRAILING_SPACES') {
                                padding += ' ';
                            }
                        }
                        //console.log("Padding required = *" + padding + "*")
                        if (field.Padding.startsWith('LEADING')) {
                            val = padding + val;
                        } else {
                            val = val + padding;
                        }
                    }
                    break;
                }//end ASCII/EBCDIC

                case 'BCD': {
                    let padding = '';
                    let expectedLength = field.FixedSize * 2;
                    if (val.length < expectedLength) {
                        for (let i = 0; i < (expectedLength - val.length); i++) {
                            padding += '0';
                        }
                    }
                    if (field.Padding === 'LEADING_ZEROES') {
                        val = padding + val;
                    } else if (field.Padding === 'TRAILING_ZEROES') {
                        val += padding;
                    } else {
                        console.log(`Unsupported padding - ${field.Padding} for Fixed BCD field`);
                    }

                    break;
                }
                case 'BINARY': {

                    let padding = '';
                    let expectedLength = field.FixedSize * 2;
                    if (val.length < expectedLength) {
                        for (let i = 0; i < (expectedLength - val.length); i++) {
                            if (field.Padding.endsWith('ZEROES')) {
                                padding += '0';
                            } else {
                                padding += 'F';
                            }

                        }
                    }
                    if (field.Padding.startsWith('LEADING_')) {
                        val = padding + val;
                    } else if (field.Padding.startsWith('TRAILING_')) {
                        val += padding;
                    }

                    break;
                }
                default: {
                    console.log("Unsupported field encoding type -" + field.DataEncoding);
                }

            }

        }
        return val;

    }

    fieldValueChanged(event) {
        this.setState({hasError: false, errMsg: null, fieldValue: event.target.value});
    }

    /*setNewValue(value) {
        this.setState({hasError: false, errMsg: null, fieldValue: value});
    }*/

    appendFieldContent(content, field, parentField, id2Value, level) {

        let key = field.ID;
        if (this.props.readOnly) {
            key = 'response_seg_' + field.ID;
        }
        content.push(<IsoField key={key} field={field} id2Value={id2Value} isoMsg={this.props.isoMsg}
                               readOnly={this.props.readOnly}
                               parentField={parentField}
                               level={level}
                               onFieldUpdate={this.onFieldUpdate}/>);
    }

    render() {

        let selectionColumnContent;

        if (this.selectable) {
            selectionColumnContent =
                <td align={"center"}><Checkbox type={"checkbox"} size={"small"}
                                               color={"primary"}
                                               checked={this.state.selected}
                                               onChange={this.fieldSelectionChanged}/>
                </td>
        } else {
            selectionColumnContent =
                <td align={"center"}><Checkbox type={"checkbox"} size={"small"}
                                               color={"primary"}
                                               disabled={true}
                                               checked={this.state.selected}
                                               onChange={this.fieldSelectionChanged}/>
                </td>
        }
        let positionInParent = "";
        if (this.props.field.ParentId > 0) {
            positionInParent = "\u2937" + this.props.field.Position + " ";
        }

        let fieldInfo = positionInParent + " Type: " + this.props.field.Type + ' / ';
        if (this.props.field.Type === AppProps.FixedField) {
            fieldInfo += "Length: " + this.props.field.FixedSize + ' / ' + 'Encoding: '
                + this.props.field.DataEncoding;
        } else if (this.props.field.Type === AppProps.VariableField) {
            fieldInfo += "Length Indicator: " + this.props.field.LengthIndicatorSize + ' / '
                + 'Length Encoding: ' + this.props.field.LengthEncoding + ' / ' + 'Data Encoding: '
                + this.props.field.DataEncoding;
        } else if (this.props.field.Type === AppProps.BitmappedField) {
        }

        let children = [];

        this.props.field.Children.forEach(
            c => this.appendFieldContent(children, c, this.props.field, this.state.id2Value,
                this.props.level + 1));

        let levelIndicator = "";
        for (let i = 0; i < this.props.level; i++) {
            levelIndicator += '\u2193';
        }

        let inpComponent = null;


        if (this.props.field.Hint.Type == "enumerated") {

            let disabled = false;
            if (this.props.readOnly) {
                disabled = true;
            }

            inpComponent = <EnumeratedPicker key={"fld_value_" + this.state.field.ID} valueChanged={this.setValue}
                                             disabled={disabled} values={this.props.field.Hint.Values}
                                             value={this.state.fieldValue}/>
        } else if (this.props.field.Hint.Type == "country_code") {

            let disabled = false;
            if (this.props.readOnly) {
                disabled = true;
            }

            inpComponent = <CountryCodePicker key={"fld_value_" + this.state.field.ID} valueChanged={this.setValue}
                                              disabled={disabled}
                                              value={this.state.fieldValue}/>
        } else if (this.props.field.Hint.Type == "currency_code") {
            let disabled = false;
            if (this.props.readOnly) {
                disabled = true;
            }

            inpComponent = <CurrencyCodePicker key={"fld_value_" + this.state.field.ID} valueChanged={this.setValue}
                                               disabled={disabled}
                                               value={this.state.fieldValue}/>
        } else {
            inpComponent = <TextField margin={"dense"} size={"small"} variant={"standard"}
                                      value={this.state.fieldValue}
                                      error={this.state.hasError}
                                      helperText={this.state.errMsg}
                                      onChange={this.fieldValueChanged}
                                      style={{width: "70%"}}
                                      disabled={this.props.readOnly || !this.state.fieldEditable}
                                      key={"fld_value_" + this.state.field.ID}
                                      onBlur={this.onFocusLost}
            />;
        }

        return (<React.Fragment>
                <tr>
                    {/* selection column */}
                    {selectionColumnContent}

                    {/* field name column*/}

                    <OverlayTrigger overlay={(<Tooltip id="hi"
                                                       style={{fontSize: '10px'}}>{fieldInfo}</Tooltip>)}
                                    placement="top">
                        <td style={{
                            width: "100px", fontSize: "12px"
                        }}>
                            <InputLabel style={{fontSize: "14px"}}>{levelIndicator + ' '
                            + this.props.field.Name}</InputLabel>
                        </td>
                    </OverlayTrigger>

                    {/* field specification column */}
                    {/*fieldSpecColumnContent*/}

                    {/* field value column */}
                    <td>

                        <Grid container={true}>
                            <Grid item={true} sm={8}>{inpComponent}</Grid>
                            <Grid item={true} sm={2}>
                                <Button size={"small"} variant={"contained"} style={{
                                    float: 'right', fontSize: '14px', marginRight: '2%', marginLeft: "2%"
                                }}
                                        onClick={this.toggleExpanded}> {this.state.expandBtnLabel}
                                </Button>

                            </Grid>

                        </Grid>
                    </td>

                </tr>
                <tr>
                    <td colSpan="3">
                        <FieldExtras show={this.state.showExpanded}
                                     field={this.state.field}
                                     value={this.state.fieldValue}
                                     readOnly={this.props.readOnly}
                                     isoMsg={this.props.isoMsg}
                                     onClose={this.setNewValue}/>
                    </td>
                </tr>
                {children}
            </React.Fragment>

        );
    }

}