// AppProps are various URL's that are used by axios
export class AppProps {

    static FixedField = "Fixed";
    static VariableField = "Variable";
    static BitmappedField = "Bitmapped";

    constructor() {
        //this.baseUrl = 'http://localhost:8080';
        this.baseUrl = '';
        this.sendMsgUrl = this.baseUrl + '/iso/v1/send';
        this.loadMsgUrl = this.baseUrl + '/iso/v1/loadmsg';
        this.allSpecsUrl = this.baseUrl + '/iso/v1/specs';
        this.templateUrl = this.baseUrl + '/iso/v1/template';
        this.parseTraceUrl = this.baseUrl + '/iso/v1/parse';
        this.saveMsgUrl = this.baseUrl + '/iso/v1/save';
        this.pinGenUrl = this.baseUrl + '/iso/v1/crypto/pin_gen';
        this.macGenUrl = this.baseUrl + '/iso/v1/crypto/mac_gen';

        this.logHistUrl = this.baseUrl + '/iso/v1/websim/msg_hist/last_n';
    }

}

let appProps = new AppProps();
export default appProps;