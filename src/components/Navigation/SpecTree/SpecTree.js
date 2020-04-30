import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import TreeView from "@material-ui/lab/TreeView";
import React from "react";
import axios from "axios";
import appProps from "../../Utils/Properties";
import {Folder, Home, Message} from "@material-ui/icons"
import StyledTreeItem from "./StyledTreeItem";


// SpecTree displays a tree of all the available specifications and the messages
// defined under the spec
class SpecTree extends React.Component {

    treeInstance;


    constructor(props) {
        super(props);

        this.state = {
            specs: [], loaded: false, errDialogVisible: false, errorMessage: ''
        };
        //this.messageClicked = this.messageClicked.bind(this);
        this.nodeSelected = this.nodeSelected.bind(this);
    }

    nodeSelected(event, selectedNode) {
        // console.log("selected node - ", selectedNode)

        let matches = selectedNode.match("nodeId_([0-9]+)_([0-9]+)");
        if (matches) {
            console.log("matched", this.treeInstance);
            this.props.msgSelected(matches[1], matches[2]);
        }

    }


    componentDidMount() {

        axios.get(appProps.allSpecsUrl).then(res => {
            console.log("allSpecs", res.data);
            this.setState({specs: res.data.specs, loaded: true});
            let timerId = setInterval(function () {
                alert('Select one of the spec and message in the tree to get started!')
                clearInterval(timerId)
            }, 2)

        }).catch(err => console.log(err))
    }

    buildMessages(spec) {
        let content = []


        spec.Messages.forEach(m => {
            content.push(<StyledTreeItem nodeId={"nodeId_" + spec.ID + "_" + m.ID}
                                         sid={spec.ID} mid={m.ID}
                                         label={m.Name}
            />)
        });
        return content

    }

    render() {

        if (this.state.loaded === true) {

            let content = [];
            this.state.specs.forEach(s => {

                content.push(<StyledTreeItem align="left" nodeId={"nodeId_" + s.ID}
                                             icon={<Folder color={"primary"}/>}
                                             label={s.Name}>{this.buildMessages(s)}</StyledTreeItem>);

            });

            let treeContent = <StyledTreeItem nodeId={"nodeId_0"}
                                              icon={<Home color={"primary"}/>}
                                              label={"ISO8583 Specifications"}>{content}</StyledTreeItem>;

            this.treeInstance = <TreeView
                onNodeSelect={this.nodeSelected}
                defaultExpanded={['nodeId_0']}
                defaultCollapseIcon={<ExpandMoreIcon/>}
                defaultExpandIcon={<ChevronRightIcon/>}
                defaultParentIcon={<Folder color={"primary"}/>}
                defaultEndIcon={<Message color="primary"/>}
            >
                {treeContent}
            </TreeView>;
            return (<React.Fragment>
                {this.treeInstance}

            </React.Fragment>);
        } else {
            return null;
        }

    }
}


export default SpecTree