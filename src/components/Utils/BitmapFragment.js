import * as React from "react";
import {Checkbox} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default class UIIsoBitmap extends React.Component {

    constructor(props) {
        super(props);
        let pos = Array(192)
        pos.fill('0')
        //pos.forEach(function (v, i, array) {
        //    pos[i] = '0';
        //})

        let v = "";
        pos.forEach(p => {
            v += p;
        })

        this.state = {pos: pos, bitmapstr: v};

        this.isSet = this.isSet.bind(this);
        this.bitChanged = this.bitChanged.bind(this);
    }

    isSet(pos) {
        return this.state.pos[pos] == '1';
    }

    bitChanged(event, pos) {

        //event.persist()

        //console.log(event,pos)
        let lpos = this.state.pos;

        //console.log(event.target.selected)

        if (event.target.checked) {
            lpos[pos] = '1';
        } else {
            lpos[pos] = '0';
        }
        let v = "";
        this.state.pos.forEach(p => {
            v += p;
        })
        console.log(v)

        this.setState({bitmapstr: v, pos: lpos})

    }


    render() {

        let fcontent = [];

        let content = [];
        fcontent.push(<TextField key="bmp_str" value={this.state.bitmapstr} fullWidth={true} variant={"outlined"}
                                 label={"Value"}/>);

        let scontent = [];
        //

        for (let i = 0; i < 192; i++) {
            scontent.push(<Grid item={true} sm={1} alignItems={"spaced-evenly"}><FormControlLabel label={i + 1}
                                                                                                  key={"lb" + "_" + (i + 1)}
                                                                                                  control={<Checkbox
                                                                                                      key={"cb" + "_" + i}
                                                                                                      checked={this.state.pos[i] == '1'}
                                                                                                      onChange={(event) => this.bitChanged(event, i)}/>}/></Grid>)

            if ((i + 1) >= 8 && (i + 1) % 8 == 0) {
                content.push(<Grid container={true} justify={"space-evenly"}>{scontent}</Grid>);
                scontent = [];
            }
            if ((i + 1) >= 64 && (i + 1) % 64 == 0) {
                fcontent.push(<Box style={{marginTop: "2%", marginBottom: "2%"}} border={1}
                                   borderColor={"primary.main"} borderRadius={4}><Grid container={true}
                                                                                       justify={"space-evenly"}>{content}</Grid></Box>);
                content = []
            }


        }
        //fcontent.push(<Grid container={true} spacing={3}>{scontent}</Grid>);

        return (
            <div style={{width: "100%"}}>
                {fcontent}
            </div>


        );

    }
}