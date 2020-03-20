class AppProps {

  constructor() {
    this.baseUrl = 'http://localhost:8080';
    this.sendMsgUrl = this.baseUrl + '/iso/v0/send';
    this.loadMsgUrl = this.baseUrl + '/iso/v0/loadmsg';
  }

}

let appProps = new AppProps();
export default appProps;