import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import React from "react";
import Box from "@material-ui/core/Box";

export default class PinGenBox extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (

        <Box border={1} borderColor={"primary.main"} borderRadius={16}>
          <div style={{paddingBottom: "10px",padding:"5px"}}>
            <Grid container spacing={0}>

              <Grid container spacing={1} alignItems={"flex-start"}>
                <Grid item xs={3}>
                  <TextField size={"small"} label={"Clear PIN"} value={"1234"}
                             variant={"outlined"} margin={"dense"}/>
                </Grid>
                <Grid item xs={6}>
                  <TextField label={"PIN Key"} defaultValue={"1234"} variant={"outlined"}
                             margin={"dense"} fullWidth={true}/>
                </Grid>
                <Grid item xs={3}>
                  <TextField size={"small"} defaultValue={"ISO-0"} select={true}
                             fullWidth={true}
                             label={"Format"}
                             variant={"outlined"} margin={"dense"}>
                    <MenuItem selected={true} value={"ISO-0"}>ISO-0</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Grid container spacing={1} alignItems={"flex-start"}>
                <Grid item xs={12}>
                  <TextField label={"PAN"} defaultValue={"1234"} variant={"outlined"}
                             margin={"dense"}/>
                </Grid>
              </Grid>

              <Grid container spacing={0} justify={"flex-end"} alignItems={"flex-end"}>
                <Grid item xs>
                  <div style={{float: "right"}}>
                    <Button size={"small"} variant={"contained"}
                            color={"primary"}>Generate</Button>
                  </div>
                </Grid>

              </Grid>

            </Grid>
          </div>
        </Box>);
  }
}