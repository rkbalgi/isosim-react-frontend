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

        this.state = {pos: pos, bitmapstr: this.toHexString(v)};

        this.toHexString = this.toHexString.bind(this);
        this.isSet = this.isSet.bind(this);
        this.bitChanged = this.bitChanged.bind(this);
        this.bitmapChanged = this.bitmapChanged.bind(this);
    }

    bitmapChanged(event) {


        let newValue = event.target.value;
        newValue = newValue.replace(":", "");
        newValue = newValue.replace(":", "");
        let npads = 192 - newValue.length
        if (npads < 0) {
            this.setState({errMsg: "bitmap value cannot exceed 192 bits!"})
            return
        }

        if (!newValue.match("^[0-9,a-f,A-F]+$")) {
            this.setState({errMsg: "bitmap value can only contains hex characters"})
            return
        }

        for (let i = 0; i < npads; i++) {
            newValue += "0";
        }


        //now convert the hex coded bitmap to binary

        let pos = Array(192);
        for (let i = 0, j = 0; i < newValue.length; i++) {
            let binValue = UIIsoBitmap.toBinary(newValue.substr(i, 1))
            for (let k = 0; k < 4; k++, j++) {
                pos[j] = binValue[k];
            }

        }
        let v = "";
        pos.forEach(p => {
            v += p;
        })
        this.setState({pos: pos, bitmapstr: this.toHexString(v), errMsg: null});

    }

    isSet(pos) {
        return this.state.pos[pos] === '1';
    }

    toHexString(v) {

        //TODO:: This is lame.., improve this
        let res = "";
        for (let i = 0; i < v.length; i += 8) {
            let frg1 = v.substr(i, 4)
            let frg2 = v.substr(i + 4, 4)

            res += UIIsoBitmap.toHex(frg1) + UIIsoBitmap.toHex(frg2)

        }

        return res.substr(0, 16) + ":" + res.substr(16, 16) + ":" + res.substr(32, 16);

        //return res;

    }

    static toBinary(frg1) {
        let res = "";
        switch (frg1) {
            case "0":
                res = "0000";
                break;
            case "1":
                res = "0001";
                break;
            case "2":
                res = "0010";
                break;
            case "3":
                res = "0011";
                break;
            case "4":
                res = "0100";
                break;
            case "5":
                res = "0101";
                break;
            case "6":
                res = "0110";
                break;
            case "7":
                res = "0111";
                break;
            case "8":
                res = "1000";
                break;
            case "9":
                res = "1001";
                break;
            case "A":
                res = "1010";
                break;
            case "B":
                res = "1011";
                break;
            case "C":
                res = "1100";
                break;
            case "D":
                res = "1101";
                break;
            case "E":
                res = "1110";
                break;
            case "F":
                res = "1111";
                break;

        }

        return res;

    }

    static toHex(frg1) {
        let res = "";
        switch (frg1) {
            case "0000":
                res = "0";
                break;
            case "0001":
                res = "1";
                break;
            case "0010":
                res = "2";
                break;
            case "0011":
                res = "3";
                break;
            case "0100":
                res = "4";
                break;
            case "0101":
                res = "5";
                break;
            case "0110":
                res = "6";
                break;
            case "0111":
                res = "7";
                break;
            case "1000":
                res = "8";
                break;
            case "1001":
                res = "9";
                break;
            case "1010":
                res = "A";
                break;
            case "1011":
                res = "B";
                break;
            case "1100":
                res = "C";
                break;
            case "1101":
                res = "D";
                break;
            case "1110":
                res = "E";
                break;
            case "1111":
                res = "F";
                break;

        }

        return res;

    }

    bitChanged(event, pos) {

        let lpos = this.state.pos;

        if (event.target.checked) {
            lpos[pos] = '1';
        } else {
            lpos[pos] = '0';
        }


        // recompute the bits representing presence/absence of secondary
        // bitmap
        lpos[0] = '0';
        lpos[64] = '0';

        for (let i = 0; i < 192; i++) {
            if (lpos[i] == '1') {
                let act_pos = i + 1;
                if (act_pos > 64 && act_pos < 129) {
                    lpos[0] = '1'
                }
                if (act_pos > 128) {
                    lpos[64] = '1'
                }
            }
        }


        let v = "";
        this.state.pos.forEach(p => {
            v += p;
        })
        //console.log(v)

        this.setState({bitmapstr: this.toHexString(v), pos: lpos})

    }


    render() {

        let fcontent = [];

        let content = [];
        fcontent.push(<TextField key="bmp_str" value={this.state.bitmapstr} fullWidth={true} variant={"outlined"}
                                 onChange={this.bitmapChanged}
                                 error={this.state.errMsg != null} helperText={this.state.errMsg} label={"Value"}/>);

        let scontent = [];
        //

        for (let i = 0; i < 192; i++) {
            scontent.push(<Grid item={true} sm={1} alignItems={"spaced-evenly"}><FormControlLabel label={i + 1}
                                                                                                  key={"lb" + "_" + (i + 1)}
                                                                                                  control={<Checkbox
                                                                                                      key={"cb" + "_" + i}
                                                                                                      checked={this.state.pos[i] === '1'}
                                                                                                      onChange={(event) => this.bitChanged(event, i)}/>}/></Grid>)

            if ((i + 1) >= 8 && (i + 1) % 8 === 0) {
                content.push(<Grid container={true} justify={"space-evenly"}>{scontent}</Grid>);
                scontent = [];
            }
            if ((i + 1) >= 64 && (i + 1) % 64 === 0) {
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