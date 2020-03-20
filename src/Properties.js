class AppProps {

  constructor() {
    this.baseUrl = '';
    this.sendMsgUrl = this.baseUrl + '/iso/v0/send';
    this.loadMsgUrl = this.baseUrl + '/iso/v0/loadmsg';
    this.allSpecsUrl = this.baseUrl + '/iso/v0/specs';
    this.templateUrl = this.baseUrl + '/iso/v0/template';
  }

}

let appProps = new AppProps();
export default appProps;