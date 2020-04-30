import fieldValidator from "./FieldValidator";

export default class MsgUtils {

    static addFieldContent(field, content, isoMsg, validationErrors) {

        let isoField = isoMsg.get(field.ID);

        if (isoField.state.selected) {
            if (fieldValidator.validate(field, isoField.state.fieldValue, validationErrors)) {
                isoField.setError(true);
            } else {
                isoField.setError(false);
            }
            content.push({ID: field.ID, Name: field.Name, Value: isoField.state.fieldValue});
        }

        field.Children.forEach(cf => {
            if (isoField.state.selected) {
                MsgUtils.addFieldContent(cf, content, isoMsg, validationErrors);
            }
        });

    }

    static getMsgContent(isoMsg, content, validationErrors) {
        isoMsg.get("msg_template").fields.forEach(f => {
            MsgUtils.addFieldContent(f, content, isoMsg, validationErrors);
        });

    };

}


