import React from 'react'
import IsoField from "./IsoField/IsoField";
import Paper from "@material-ui/core/Paper";

// ResponseSegment displays the response to an ISO message
export default class ResponseSegment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      data: this.props.data,
      msgTemplate: this.props.msgTemplate
    }
  }

  appendFieldContent(content, field, idToField, level) {
    content.push(<IsoField key={'response_seg_' + field.Id} field={field}
                           id2Value={idToField}
                           readOnly={true} level={level}
                           onFieldUpdate={this.onFieldUpdate}/>);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

    if ((prevProps.show === false && this.props.show === true)
        || (prevState.data !== this.props.data)) {
      this.setState({
        show: true,
        data: this.props.data,
        msgTemplate: this.props.msgTemplate
      })
    }

  }

  render() {

    let content = [];
    if (this.state.show) {

      let idToField = new Map();
      this.state.data.forEach(f => {
        idToField.set(f.Id, f.Value);
      });

      this.state.msgTemplate.Fields.map(field => {
        this.appendFieldContent(content, field, idToField, 0)
      });

      console.log(content);

      return (
          <React.Fragment>

            {this.props.show ?
                <Paper>
                  <table border="0" align={"center"}>
                    <thead>
                    <tr style={{
                      fontFamily: "lato-regular",
                      backgroundColor: "#eed143",
                      fontSize: "15px",
                      align: "center",
                      borderBottom: 'solid',
                      borderColor: 'blue'
                    }}>
                      <td colSpan="3" align={"center"}>{"Response Segment"}</td>
                    </tr>
                    <tr style={{
                      fontFamily: "lato-regular",
                      backgroundColor: "#3effba",
                      fontSize: "14px",
                    }}>
                      <td align={"center"}>Selection</td>
                      <td align={"center"} style={{width:"35%"}}>Field</td>
                      <td align={"center"} style={{width:"50%"}}>Field Data</td>
                    </tr>
                    </thead>
                    <tbody>
                    {content}
                    </tbody>
                  </table>
                </Paper>
                : null}
          </React.Fragment>);

    } else {
      return null;
    }

  }
}