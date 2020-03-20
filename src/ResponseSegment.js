import React from 'react'
import IsoField from "./IsoField";

export default class ResponseSegment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      show: props.show,
      data: this.props.data,
      msgTemplate: this.props.msgTemplate
    }
  }

  appendFieldContent(content, field, idToField) {
    content.push(<IsoField key={'response_seg_' + field.Id} field={field}
                           id2Value={idToField}
                           readOnly={true}
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

    console.log("Rendering again...");
    let content = [];
    if (this.state.show) {

      let idToField = new Map();
      this.state.data.forEach(f => {
        console.log("setting  .. ", f.Id, f.Value);
        idToField.set(f.Id, f.Value);
      });

      this.state.msgTemplate.Fields.map(field => {
        this.appendFieldContent(content, field, idToField)
      });

      console.log(content);

      return (
          <React.Fragment>
            {this.props.show ?
                <table border="0">
                  <thead>
                  <tr style={{
                    fontFamily: "ptserif-regular",
                    backgroundColor: "#b0afff",
                    fontSize: "15px",
                    borderBottom: 'solid',
                    borderColor: 'blue'
                  }}>
                    <td colSpan="3" align={"center"}>{"Response Segment"}</td>
                  </tr>
                  <tr style={{
                    fontFamily: "ptserif-regular",
                    backgroundColor: "#b0afff",
                    fontSize: "14px",
                  }}>
                    <td align={"center"}>Selection</td>
                    <td align={"center"}>Field</td>
                    {/*<td align={"center"}
                        style={{minWidth: "50px", maxWidth: "200px"}}>Field Spec
                    </td>*/}
                    <td align={"center"} style={{width: '220px'}}>Field Data</td>
                  </tr>
                  </thead>
                  <tbody>
                  {content}
                  </tbody>
                </table>
                : null}
          </React.Fragment>);

    } else {
      return null;
    }

  }
}