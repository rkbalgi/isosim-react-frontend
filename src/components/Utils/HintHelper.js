export default class HintHelper {

// TODO:: consider using moment.js
    static generateValue(field) {

        function withDate(fmt, i, currDate) {


            let d = currDate.getDate();
            let date = "";
            if (d < 10) {
                date = "0" + d;
            } else {
                date = "" + d;
            }
            return fmt.substr(0, i) + date + fmt.substr(i + 2);


        }

        function withMonth(fmt, i, currDate) {

            let m = currDate.getMonth() + 1;
            let month = "";
            if (m < 10) {
                month = "0" + m;
            } else {
                month = "" + m;
            }
            fmt = fmt.substr(0, i) + month + fmt.substr(i + 2);
            return fmt;

        }

        function withHour(fmt, i, currDate) {

            let m = currDate.getHours();
            let hr = "";
            if (m < 10) {
                hr = "0" + m;
            } else {
                hr = "" + m;
            }
            fmt = fmt.substr(0, i) + hr + fmt.substr(i + 2);
            return fmt;

        }

        function withMins(fmt, i, currDate) {
            let m = currDate.getMinutes();
            let mins = "";
            if (m < 10) {
                mins = "0" + m;
            } else {
                mins = "" + m;
            }
            fmt = fmt.substr(0, i) + mins + fmt.substr(i + 2);
            return fmt;
        }

        function withSecs(fmt, i, currDate) {
            let m = currDate.getSeconds();
            let secs = "";
            if (m < 10) {
                secs = "0" + m;
            } else {
                secs = "" + m;
            }
            fmt = fmt.substr(0, i) + secs + fmt.substr(i + 2);
            return fmt;
        }

        if (field.Hint.Type == "date_time") {
            if (field.Hint.Format) {
                //we only support
                //MMdd HHmmss
                let currDate = new Date();
                let fmt = field.Hint.Format;
                let i = fmt.indexOf("MM");
                if (i != -1) {
                    fmt = withMonth(fmt, i, currDate)
                }

                i = fmt.indexOf("dd");
                if (i != -1) {
                    fmt = withDate(fmt, i, currDate)
                }

                i = fmt.indexOf("HH");
                if (i != -1) {
                    fmt = withHour(fmt, i, currDate)
                }

                i = fmt.indexOf("mm");
                if (i != -1) {
                    fmt = withMins(fmt, i, currDate)
                }

                i = fmt.indexOf("ss");
                if (i != -1) {
                    fmt = withSecs(fmt, i, currDate)
                }

                return fmt;

            }

            return ""
        }

        return ""
    }
}