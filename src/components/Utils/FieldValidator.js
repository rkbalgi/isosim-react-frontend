
// FieldValidator provides validation logic for field values
import {AppProps} from "./Properties";

class FieldValidator {

  constructor(props) {
    this.validate = this.validate.bind(this);
  }

  validate(field, fieldData, errors) {

    //console.log("validate", field, fieldData, errors);
    let validationFailed = false;

    if (field.Type === AppProps.FixedField) {

      if (field.DataEncoding === 'ASCII' || field.DataEncoding === 'EBCDIC') {
        if (fieldData.length !== field.FixedSize) {
          errors.push(
              `\u2b55 "${field.Name}" should have a fixed size of ${field.FixedSize} but has ${fieldData.length}`);
          validationFailed = true;
        }
      } else {
        if (fieldData.length !== 2 * field.FixedSize) {
          errors.push(
              `\u2b55 "${field.Name}" should have a fixed size of ${field.FixedSize} but has ${fieldData.length
              / 2}`);
          validationFailed = true;
        }
      }

    }

    let dataErr = false;

    if (field.DataEncoding === 'BCD' || field.DataEncoding === 'BINARY') {
      if (fieldData.length % 2 !== 0) {
        errors.push(
            `\u2b55 "${field.Name}" should have even number of characters!`);
        validationFailed = true;
        dataErr = true;
      }

      if (field.DataEncoding === 'BINARY' && !fieldData.match(
          "^[0-9,a-f,A-F]+$")) {
        errors.push(`\u2b55 "${field.Name}" supports only hex i.e 0-9,a-z,A-Z`);
        validationFailed = true;
      }
      if (field.DataEncoding === 'BCD' && !fieldData.match("^[0-9]+$")) {
        errors.push(`\u2b55 "${field.Name}" supports only bcd i.e 0-9`);
        validationFailed = true;
      }
    }

    if (!dataErr && field.Type === AppProps.VariableField) {

      let fieldLen = fieldData.length;
      if (field.DataEncoding === 'BCD' || field.DataEncoding === 'BINARY') {
        fieldLen = fieldData.length / 2;
      }

      if (field.MinSize > 0 && fieldData.length < field.MinSize) {
        errors.push(
            `\u2b55 "${field.Name} size of ${fieldLen} is less than required min of ${field.MinSize}" `);
        validationFailed = true;
      }
      if (field.MaxSize > 0 && fieldData.length > field.MaxSize) {
        errors.push(
            `\u2b55 "${field.Name} size  of ${fieldLen} is greater than required max of ${field.MinSize}" `);
        validationFailed = true;
      }
    }

    //TODO:: other checks like content etc
    return validationFailed;

  }

}

let fieldValidator = new FieldValidator();
export default fieldValidator;