class AppProps {

  constructor() {
    this.baseUrl = 'http://localhost:8080';
    this.sendMsgUrl = this.baseUrl + '/iso/v0/send';
    this.loadMsgUrl = this.baseUrl + '/iso/v0/loadmsg';
    this.allSpecsUrl = this.baseUrl + '/iso/v0/specs';
    this.templateUrl = this.baseUrl + '/iso/v0/template';
    this.parseTraceUrl = this.baseUrl + '/iso/v0/parse';
  }

}

let appProps = new AppProps();
export default appProps;