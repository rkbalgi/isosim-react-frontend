// AppProps are various URL's that are used by axios
export class AppProps {

  static FixedField = "Fixed";
  static VariableField = "Variable";
  static BitmappedField = "Bitmapped";

  constructor() {
    this.baseUrl = 'http://localhost:8080';
    //this.baseUrl = '';
    this.sendMsgUrl = this.baseUrl + '/iso/v0/send';
    this.loadMsgUrl = this.baseUrl + '/iso/v1/loadmsg';
    this.allSpecsUrl = this.baseUrl + '/iso/v1/specs';
    this.templateUrl = this.baseUrl + '/iso/v1/template';
    this.parseTraceUrl = this.baseUrl + '/iso/v0/parse';
    this.saveMsgUrl = this.baseUrl + '/iso/v0/save';
  }

}

let appProps = new AppProps();
export default appProps;