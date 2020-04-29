import {withStyles} from "@material-ui/styles";
import TreeItem from "@material-ui/lab/TreeItem";
import {makeStyles} from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import React from "react";
import * as PropTypes from "prop-types";
//import * as React from "react";

/*const useStyles = theme => {

  return ({
    selected: {
      "&:focus": {
        backgroundColor: "red"
      }
    }
  });
}*/

/*
class StyledTreeItem extends React.Component{

  constructor(props) {
    super(props);

  }

  render() {

    const {classes}=this.props;

    return(
        <TreeItem classes={classes.selected} ...props/>);
  }

}
*/

/*
const StyledTreeItem = withStyles(({
  selected: {
    "&:focus": {
      textDecoration: "underline"
    }
  }
}))(TreeItem);
export default StyledTreeItem*/

//copied from here - https://material-ui.com/components/tree-view/

const useTreeItemStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.secondary, '&:hover > $content': {
      backgroundColor: theme.palette.action.hover,
    }, '&:focus > $content, &$selected > $content': {
      backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
      color: 'var(--tree-view-color)',
    }, '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
      backgroundColor: 'transparent',
    },
  }, content: {
    color: theme.palette.text.secondary,
    borderTopRightRadius: theme.spacing(2),
    borderBottomRightRadius: theme.spacing(2),
    paddingRight: theme.spacing(1),
    fontWeight: theme.typography.fontWeightMedium,
    '$expanded > &': {
      fontWeight: theme.typography.fontWeightRegular,
    },
  }, group: {
    marginLeft: 10, '& $content': {
      paddingLeft: theme.spacing(3),
    },
  }, expanded: {}, selected: {}, label: {
    fontWeight: 'inherit', color: 'inherit',
  }, labelRoot: {
    display: 'flex', alignItems: 'center', padding: theme.spacing(0.8, 0),
  }, labelIcon: {
    marginRight: theme.spacing(1),
  }, labelText: {
    fontWeight: 'inherit', flexGrow: 1,
  },
}));

export default function StyledTreeItem(props) {
  const classes = useTreeItemStyles();
  const {labelText, labelIcon: LabelIcon, labelInfo, color, bgColor, ...other} = props;

  return (<TreeItem
          label={<div className={classes.labelRoot}>
            <LabelIcon color="inherit" className={classes.labelIcon}/>
            <Typography variant="body2" className={classes.labelText}>
              {labelText}
            </Typography>
            <Typography variant="caption" color="inherit">
              {labelInfo}
            </Typography>
          </div>}
          style={{
            '--tree-view-color': color, '--tree-view-bg-color': bgColor,
          }}
          classes={{
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label,
          }}
          {...other}
      />);
}

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};