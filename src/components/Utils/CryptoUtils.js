import * as React from "react";
import PinGenBox from "./PinGenBox";
import {TextField} from "@material-ui/core";
import Box from "@material-ui/core/Box";

export default class CryptoUtilsBox extends React.Component {
  pinField = {
    PinGenProps: {
      PANFieldId: 0,
      PANExtractParams: "",
      PINFormat: "ISO0",
      PINClear: "1234",
      PINKey: "1234567890abcd0102030546febce4ee"
    }, GenType: "pin_gen"
  };

  constructor(props) {
    super(props);

    this.state = {pinBlock: ""}

    this.setPinValue = this.setPinValue.bind(this);

  }

  setPinValue(value) {
    this.setState({pinBlock: value})
  }

  render() {
    return (

        <div style={{
          textAlign: "left",
          marginTop: "5%",
          width: "50%",
          float: "left",
          height: "100%"
        }}>

          <PinGenBox field={this.pinField} setPinBlock={this.setPinValue}/>
          <TextField size={"small"} label={"PIN Block"} variant={"outlined"} margin={"dense"}
                     fullWidth={true}
                     value={this.state.pinBlock}/>
        </div>

    );
  }

}