import React from 'react';
import {Button} from "react-bootstrap";

// ExpandedText shows a field value within a large field (TextArea)
// and is useful when editing fields with large values
export default class ExpandedText extends React.Component {

  constructor(props) {
    super(props);

    this.state = {show: this.props.show, value: this.props.value};
    this.closeThis = this.closeThis.bind(this);
    this.valueChanged = this.valueChanged.bind(this);
  }

  valueChanged(event) {
    this.setState({value: event.target.value});
  }

  closeThis() {
    this.setState({show: true});
    this.props.onClose(this.state.value);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.show === false && this.props.show === true && this.state.show
        === false) {
      this.setState({show: true, value: this.props.value})
    } else if (this.props.show === false && this.state.show
        === true) {
      this.setState({show: false, value: this.props.value})
    }
  }

  render() {

    return (

        (this.state.show === true) ?

            <React.Fragment>
              <div style={{borderBottom: 'solid', borderColor: 'red'}}>

        <textarea
            style={{
              fontFamily: "courier new",
              width: '100%',
              minHeight: '80px',
              maxHeight: '200px'
            }}
            onChange={this.valueChanged} disabled={this.props.readOnly} value={this.state.value}/>

                <div style={{height: '25px'}}>
                  <Button size={"sm"} style={{
                    float: 'right', fontSize: '10px'
                  }} onClick={this.closeThis}> OK </Button>
                </div>
              </div>
            </React.Fragment>
            :
            null
    );
  }

}