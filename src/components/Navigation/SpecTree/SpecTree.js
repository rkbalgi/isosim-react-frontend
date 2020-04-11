import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import TreeItem from "@material-ui/lab/TreeItem";
import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import axios from "axios";
import appProps from "../../Utils/Properties";
import {Folder, FolderSpecial, Message} from "@material-ui/icons"

class SpecTree extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      specs: [],
      loaded: false,
      errDialogVisible: false,
      errorMessage: ''
    };
    this.messageClicked = this.messageClicked.bind(this);
  }

  messageClicked(event) {
    // FIXME:: This is a hack! There needs to be a better way like onSelect
    let specId = event.target.parentElement.parentElement.getAttribute("sid");
    let msgId = event.target.parentElement.parentElement.getAttribute("mid");

    this.props.msgSelected(specId, msgId);

  }

  componentDidMount() {

    axios.get(appProps.allSpecsUrl).then(res => {
      console.log(res.data);
      this.setState({specs: res.data, loaded: true});
    }).catch(
        err => console.log(err))
  }

  buildMessages(spec) {
    let content = []
    spec.Messages.forEach(m => {
      content.push(<TreeItem nodeId={"nodeId_" + m.Id} sid={spec.Id} mid={m.Id}
                             label={m.Name}
                             onClick={this.messageClicked}/>)
    });
    return content

  }

  render() {

    if (this.state.loaded === true) {

      let content = [];
      this.state.specs.forEach(s => {

        content.push(<TreeItem align="left" nodeId={"nodeId_" + s.Id} icon={<Folder color={"primary"}/>}
                               label={s.Name}>{this.buildMessages(
            s)}</TreeItem>);

      });

      let treeContent = <TreeItem nodeId={"nodeId_0"} icon={<FolderSpecial color={"primary"}/>}
                                  label={"ISO8583 Specifications"}>{content}</TreeItem>;

      return (<React.Fragment>
            <TreeView
                defaultExpanded={['nodeId_0']}
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                defaultParentIcon={<Folder color={"primary"}/>}
                defaultEndIcon={<Message color="primary"/>}
            >
              {treeContent}
            </TreeView>


          </React.Fragment>
      );
    } else {
      return null;
    }

  }
}

export default SpecTree;