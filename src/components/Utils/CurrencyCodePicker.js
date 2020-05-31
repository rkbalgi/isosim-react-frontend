import React from "react";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export default function CountryCodePicker(props) {

    const [value, setValue] = React.useState(currencyCodes[108]);


    React.useEffect(() => {

        if (props.disabled == false) {

            //if there is already a value supplied, use that
            if (props.value) {
                currencyCodes.forEach((v) => {
                    if (v.numericCode == props.value) {
                        setValue(v);
                    }
                })

            } else {
                props.valueChanged(value.numericCode);
            }


        }


    }, [])

    /*React.useEffect(() => {
        if(props.disabled==false){
            props.valueChanged(value.numericCode);
        }

    }, [value])*/


    React.useEffect(() => {

        currencyCodes.forEach((v) => {
            if (v.numericCode == props.value) {
                setValue(v);
                return
            }
        })

    }, [props.value])


    return (

        <Autocomplete
            id="currency-code-box"
            disabled={props.disabled}
            options={currencyCodes}
            value={value}
            onChange={(event, newValue) => {
                if (newValue == null) {
                    return
                }
                setValue(newValue);
                props.valueChanged(newValue.numericCode);
            }}
            getOptionLabel={(option) => option.currency}
            style={{width: "80%"}}
            renderInput={(params) => <TextField {...params} margin={"dense"} label="Currency Code"
                                                variant="standard"/>}
        />
    );


}


//https://www.iban.com/currency-codes

const currencyCodes = [
    {country: 'AFGHANISTAN', currency: 'Afghani', alphaCode: 'AFN', numericCode: '971'},
    {country: 'ALBANIA', currency: 'Lek', alphaCode: 'ALL', numericCode: '008'},
    {country: 'ALGERIA', currency: 'Algerian Dinar', alphaCode: 'DZD', numericCode: '012'},
    {country: 'AMERICAN SAMOA', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'ANDORRA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'ANGOLA', currency: 'Kwanza', alphaCode: 'AOA', numericCode: '973'},
    {country: 'ANGUILLA', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    //{country: 'ANTARCTICA', currency: 'No universal currency', currency: '', currency: ''},
    {country: 'ANTIGUA AND BARBUDA', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    {country: 'ARGENTINA', currency: 'Argentine Peso', alphaCode: 'ARS', numericCode: '032'},
    {country: 'ARMENIA', currency: 'Armenian Dram', alphaCode: 'AMD', numericCode: '051'},
    {country: 'ARUBA', currency: 'Aruban Florin', alphaCode: 'AWG', numericCode: '533'},
    {country: 'AUSTRALIA', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'AUSTRIA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'AZERBAIJAN', currency: 'Azerbaijanian Manat', alphaCode: 'AZN', numericCode: '944'},
    {country: 'BAHAMAS (THE)', currency: 'Bahamian Dollar', alphaCode: 'BSD', numericCode: '044'},
    {country: 'BAHRAIN', currency: 'Bahraini Dinar', alphaCode: 'BHD', numericCode: '048'},
    {country: 'BANGLADESH', currency: 'Taka', alphaCode: 'BDT', numericCode: '050'},
    {country: 'BARBADOS', currency: 'Barbados Dollar', alphaCode: 'BBD', numericCode: '052'},
    {country: 'BELARUS', currency: 'Belarussian Ruble', alphaCode: 'BYN', numericCode: '933'},
    {country: 'BELGIUM', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'BELIZE', currency: 'Belize Dollar', alphaCode: 'BZD', numericCode: '084'},
    {country: 'BENIN', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'BERMUDA', currency: 'Bermudian Dollar', alphaCode: 'BMD', numericCode: '060'},
    {country: 'BHUTAN', currency: 'Ngultrum', alphaCode: 'BTN', numericCode: '064'},
    {country: 'BHUTAN', currency: 'Indian Rupee', alphaCode: 'INR', numericCode: '356'},
    {country: 'BOLIVIA (PLURINATIONAL STATE OF)', currency: 'Boliviano', alphaCode: 'BOB', numericCode: '068'},
    {country: 'BOLIVIA (PLURINATIONAL STATE OF)', currency: 'Mvdol', alphaCode: 'BOV', numericCode: '984'},
    {country: 'BONAIRE, SINT EUSTATIUS AND SABA', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'BOSNIA AND HERZEGOVINA', currency: 'Convertible Mark', alphaCode: 'BAM', numericCode: '977'},
    {country: 'BOTSWANA', currency: 'Pula', alphaCode: 'BWP', numericCode: '072'},
    {country: 'BOUVET ISLAND', currency: 'Norwegian Krone', alphaCode: 'NOK', numericCode: '578'},
    {country: 'BRAZIL', currency: 'Brazilian Real', alphaCode: 'BRL', numericCode: '986'},
    {country: 'BRITISH INDIAN OCEAN TERRITORY (THE)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'BRUNEI DARUSSALAM', currency: 'Brunei Dollar', alphaCode: 'BND', numericCode: '096'},
    {country: 'BULGARIA', currency: 'Bulgarian Lev', alphaCode: 'BGN', numericCode: '975'},
    {country: 'BURKINA FASO', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'BURUNDI', currency: 'Burundi Franc', alphaCode: 'BIF', numericCode: '108'},
    {country: 'CABO VERDE', currency: 'Cabo Verde Escudo', alphaCode: 'CVE', numericCode: '132'},
    {country: 'CAMBODIA', currency: 'Riel', alphaCode: 'KHR', numericCode: '116'},
    {country: 'CAMEROON', currency: 'CFA Franc BEAC', alphaCode: 'XAF', numericCode: '950'},
    {country: 'CANADA', currency: 'Canadian Dollar', alphaCode: 'CAD', numericCode: '124'},
    {country: 'CAYMAN ISLANDS (THE)', currency: 'Cayman Islands Dollar', alphaCode: 'KYD', numericCode: '136'},
    {country: 'CENTRAL AFRICAN REPUBLIC (THE)', currency: 'CFA Franc BEAC', alphaCode: 'XAF', numericCode: '950'},
    {country: 'CHAD', currency: 'CFA Franc BEAC', alphaCode: 'XAF', numericCode: '950'},
    {country: 'CHILE', currency: 'Unidad de Fomento', alphaCode: 'CLF', numericCode: '990'},
    {country: 'CHILE', currency: 'Chilean Peso', alphaCode: 'CLP', numericCode: '152'},
    {country: 'CHINA', currency: 'Yuan Renminbi', alphaCode: 'CNY', numericCode: '156'},
    {country: 'CHRISTMAS ISLAND', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'COCOS (KEELING) ISLANDS (THE)', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'COLOMBIA', currency: 'Colombian Peso', alphaCode: 'COP', numericCode: '170'},
    {country: 'COLOMBIA', currency: 'Unidad de Valor Real', alphaCode: 'COU', numericCode: '970'},
    {country: 'COMOROS (THE)', currency: 'Comoro Franc', alphaCode: 'KMF', numericCode: '174'},
    {
        country: 'CONGO (THE DEMOCRATIC REPUBLIC OF THE)',
        currency: 'Congolese Franc',
        alphaCode: 'CDF',
        numericCode: '976'
    },
    {country: 'CONGO (THE)', currency: 'CFA Franc BEAC', alphaCode: 'XAF', numericCode: '950'},
    {country: 'COOK ISLANDS (THE)', currency: 'New Zealand Dollar', alphaCode: 'NZD', numericCode: '554'},
    {country: 'COSTA RICA', currency: 'Costa Rican Colon', alphaCode: 'CRC', numericCode: '188'},
    {country: 'CROATIA', currency: 'Kuna', alphaCode: 'HRK', numericCode: '191'},
    {country: 'CUBA', currency: 'Peso Convertible', alphaCode: 'CUC', numericCode: '931'},
    {country: 'CUBA', currency: 'Cuban Peso', alphaCode: 'CUP', numericCode: '192'},
    {country: 'CURAÇAO', currency: 'Netherlands Antillean Guilder', alphaCode: 'ANG', numericCode: '532'},
    {country: 'CYPRUS', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'CZECH REPUBLIC (THE)', currency: 'Czech Koruna', alphaCode: 'CZK', numericCode: '203'},
    {country: 'CÔTE D\'IVOIRE', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'DENMARK', currency: 'Danish Krone', alphaCode: 'DKK', numericCode: '208'},
    {country: 'DJIBOUTI', currency: 'Djibouti Franc', alphaCode: 'DJF', numericCode: '262'},
    {country: 'DOMINICA', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    {country: 'DOMINICAN REPUBLIC (THE)', currency: 'Dominican Peso', alphaCode: 'DOP', numericCode: '214'},
    {country: 'ECUADOR', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'EGYPT', currency: 'Egyptian Pound', alphaCode: 'EGP', numericCode: '818'},
    {country: 'EL SALVADOR', currency: 'El Salvador Colon', alphaCode: 'SVC', numericCode: '222'},
    {country: 'EL SALVADOR', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'EQUATORIAL GUINEA', currency: 'CFA Franc BEAC', alphaCode: 'XAF', numericCode: '950'},
    {country: 'ERITREA', currency: 'Nakfa', alphaCode: 'ERN', numericCode: '232'},
    {country: 'ESTONIA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'ETHIOPIA', currency: 'Ethiopian Birr', alphaCode: 'ETB', numericCode: '230'},
    {country: 'EUROPEAN UNION', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {
        country: 'FALKLAND ISLANDS (THE) [MALVINAS]',
        currency: 'Falkland Islands Pound',
        alphaCode: 'FKP',
        numericCode: '238'
    },
    {country: 'FAROE ISLANDS (THE)', currency: 'Danish Krone', alphaCode: 'DKK', numericCode: '208'},
    {country: 'FIJI', currency: 'Fiji Dollar', alphaCode: 'FJD', numericCode: '242'},
    {country: 'FINLAND', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'FRANCE', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'FRENCH GUIANA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'FRENCH POLYNESIA', currency: 'CFP Franc', alphaCode: 'XPF', numericCode: '953'},
    {country: 'FRENCH SOUTHERN TERRITORIES (THE)', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'GABON', currency: 'CFA Franc BEAC', alphaCode: 'XAF', numericCode: '950'},
    {country: 'GAMBIA (THE)', currency: 'Dalasi', alphaCode: 'GMD', numericCode: '270'},
    {country: 'GEORGIA', currency: 'Lari', alphaCode: 'GEL', numericCode: '981'},
    {country: 'GERMANY', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'GHANA', currency: 'Ghana Cedi', alphaCode: 'GHS', numericCode: '936'},
    {country: 'GIBRALTAR', currency: 'Gibraltar Pound', alphaCode: 'GIP', numericCode: '292'},
    {country: 'GREECE', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'GREENLAND', currency: 'Danish Krone', alphaCode: 'DKK', numericCode: '208'},
    {country: 'GRENADA', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    {country: 'GUADELOUPE', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'GUAM', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'GUATEMALA', currency: 'Quetzal', alphaCode: 'GTQ', numericCode: '320'},
    {country: 'GUERNSEY', currency: 'Pound Sterling', alphaCode: 'GBP', numericCode: '826'},
    {country: 'GUINEA', currency: 'Guinea Franc', alphaCode: 'GNF', numericCode: '324'},
    {country: 'GUINEA-BISSAU', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'GUYANA', currency: 'Guyana Dollar', alphaCode: 'GYD', numericCode: '328'},
    {country: 'HAITI', currency: 'Gourde', alphaCode: 'HTG', numericCode: '332'},
    {country: 'HAITI', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'HEARD ISLAND AND McDONALD ISLANDS', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'HOLY SEE (THE)', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'HONDURAS', currency: 'Lempira', alphaCode: 'HNL', numericCode: '340'},
    {country: 'HONG KONG', currency: 'Hong Kong Dollar', alphaCode: 'HKD', numericCode: '344'},
    {country: 'HUNGARY', currency: 'Forint', alphaCode: 'HUF', numericCode: '348'},
    {country: 'ICELAND', currency: 'Iceland Krona', alphaCode: 'ISK', numericCode: '352'},
    {country: 'INDIA', currency: 'Indian Rupee', alphaCode: 'INR', numericCode: '356'},
    {country: 'INDONESIA', currency: 'Rupiah', alphaCode: 'IDR', numericCode: '360'},
    {
        country: 'INTERNATIONAL MONETARY FUND (IMF) ',
        currency: 'SDR (Special Drawing Right)',
        alphaCode: 'XDR',
        numericCode: '960'
    },
    {country: 'IRAN (ISLAMIC REPUBLIC OF)', currency: 'Iranian Rial', alphaCode: 'IRR', numericCode: '364'},
    {country: 'IRAQ', currency: 'Iraqi Dinar', alphaCode: 'IQD', numericCode: '368'},
    {country: 'IRELAND', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'ISLE OF MAN', currency: 'Pound Sterling', alphaCode: 'GBP', numericCode: '826'},
    {country: 'ISRAEL', currency: 'New Israeli Sheqel', alphaCode: 'ILS', numericCode: '376'},
    {country: 'ITALY', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'JAMAICA', currency: 'Jamaican Dollar', alphaCode: 'JMD', numericCode: '388'},
    {country: 'JAPAN', currency: 'Yen', alphaCode: 'JPY', numericCode: '392'},
    {country: 'JERSEY', currency: 'Pound Sterling', alphaCode: 'GBP', numericCode: '826'},
    {country: 'JORDAN', currency: 'Jordanian Dinar', alphaCode: 'JOD', numericCode: '400'},
    {country: 'KAZAKHSTAN', currency: 'Tenge', alphaCode: 'KZT', numericCode: '398'},
    {country: 'KENYA', currency: 'Kenyan Shilling', alphaCode: 'KES', numericCode: '404'},
    {country: 'KIRIBATI', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {
        country: 'KOREA (THE DEMOCRATIC PEOPLE\’S REPUBLIC OF)',
        currency: 'North Korean Won',
        alphaCode: 'KPW',
        numericCode: '408'
    },
    {country: 'KOREA (THE REPUBLIC OF)', currency: 'Won', alphaCode: 'KRW', numericCode: '410'},
    {country: 'KUWAIT', currency: 'Kuwaiti Dinar', alphaCode: 'KWD', numericCode: '414'},
    {country: 'KYRGYZSTAN', currency: 'Som', alphaCode: 'KGS', numericCode: '417'},
    {country: 'LAO PEOPLE’S DEMOCRATIC REPUBLIC (THE)', currency: 'Kip', alphaCode: 'LAK', numericCode: '418'},
    {country: 'LATVIA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'LEBANON', currency: 'Lebanese Pound', alphaCode: 'LBP', numericCode: '422'},
    {country: 'LESOTHO', currency: 'Loti', alphaCode: 'LSL', numericCode: '426'},
    {country: 'LESOTHO', currency: 'Rand', alphaCode: 'ZAR', numericCode: '710'},
    {country: 'LIBERIA', currency: 'Liberian Dollar', alphaCode: 'LRD', numericCode: '430'},
    {country: 'LIBYA', currency: 'Libyan Dinar', alphaCode: 'LYD', numericCode: '434'},
    {country: 'LIECHTENSTEIN', currency: 'Swiss Franc', alphaCode: 'CHF', numericCode: '756'},
    {country: 'LITHUANIA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'LUXEMBOURG', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'MACAO', currency: 'Pataca', alphaCode: 'MOP', numericCode: '446'},
    {country: 'MADAGASCAR', currency: 'Malagasy Ariary', alphaCode: 'MGA', numericCode: '969'},
    {country: 'MALAWI', currency: 'Kwacha', alphaCode: 'MWK', numericCode: '454'},
    {country: 'MALAYSIA', currency: 'Malaysian Ringgit', alphaCode: 'MYR', numericCode: '458'},
    {country: 'MALDIVES', currency: 'Rufiyaa', alphaCode: 'MVR', numericCode: '462'},
    {country: 'MALI', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'MALTA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'MARSHALL ISLANDS (THE)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'MARTINIQUE', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'MAURITANIA', currency: 'Ouguiya', alphaCode: 'MRU', numericCode: '929'},
    {country: 'MAURITIUS', currency: 'Mauritius Rupee', alphaCode: 'MUR', numericCode: '480'},
    {country: 'MAYOTTE', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {
        country: 'MEMBER COUNTRIES OF THE AFRICAN DEVELOPMENT BANK GROUP',
        currency: 'ADB Unit of Account',
        alphaCode: 'XUA',
        numericCode: '965'
    },
    {country: 'MEXICO', currency: 'Mexican Peso', alphaCode: 'MXN', numericCode: '484'},
    {country: 'MEXICO', currency: 'Mexican Unidad de Inversion (UDI)', alphaCode: 'MXV', numericCode: '979'},
    {country: 'MICRONESIA (FEDERATED STATES OF)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'MOLDOVA (THE REPUBLIC OF)', currency: 'Moldovan Leu', alphaCode: 'MDL', numericCode: '498'},
    {country: 'MONACO', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'MONGOLIA', currency: 'Tugrik', alphaCode: 'MNT', numericCode: '496'},
    {country: 'MONTENEGRO', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'MONTSERRAT', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    {country: 'MOROCCO', currency: 'Moroccan Dirham', alphaCode: 'MAD', numericCode: '504'},
    {country: 'MOZAMBIQUE', currency: 'Mozambique Metical', alphaCode: 'MZN', numericCode: '943'},
    {country: 'MYANMAR', currency: 'Kyat', alphaCode: 'MMK', numericCode: '104'},
    {country: 'NAMIBIA', currency: 'Namibia Dollar', alphaCode: 'NAD', numericCode: '516'},
    {country: 'NAMIBIA', currency: 'Rand', alphaCode: 'ZAR', numericCode: '710'},
    {country: 'NAURU', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'NEPAL', currency: 'Nepalese Rupee', alphaCode: 'NPR', numericCode: '524'},
    {country: 'NETHERLANDS (THE)', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'NEW CALEDONIA', currency: 'CFP Franc', alphaCode: 'XPF', numericCode: '953'},
    {country: 'NEW ZEALAND', currency: 'New Zealand Dollar', alphaCode: 'NZD', numericCode: '554'},
    {country: 'NICARAGUA', currency: 'Cordoba Oro', alphaCode: 'NIO', numericCode: '558'},
    {country: 'NIGER (THE)', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'NIGERIA', currency: 'Naira', alphaCode: 'NGN', numericCode: '566'},
    {country: 'NIUE', currency: 'New Zealand Dollar', alphaCode: 'NZD', numericCode: '554'},
    {country: 'NORFOLK ISLAND', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'NORTHERN MARIANA ISLANDS (THE)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'NORWAY', currency: 'Norwegian Krone', alphaCode: 'NOK', numericCode: '578'},
    {country: 'OMAN', currency: 'Rial Omani', alphaCode: 'OMR', numericCode: '512'},
    {country: 'PAKISTAN', currency: 'Pakistan Rupee', alphaCode: 'PKR', numericCode: '586'},
    {country: 'PALAU', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    //{country: 'PALESTINE, STATE OF', currency: 'No universal currency', currency: '', currency: ''},
    {country: 'PANAMA', currency: 'Balboa', alphaCode: 'PAB', numericCode: '590'},
    {country: 'PANAMA', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'PAPUA NEW GUINEA', currency: 'Kina', alphaCode: 'PGK', numericCode: '598'},
    {country: 'PARAGUAY', currency: 'Guarani', alphaCode: 'PYG', numericCode: '600'},
    {country: 'PERU', currency: 'Nuevo Sol', alphaCode: 'PEN', numericCode: '604'},
    {country: 'PHILIPPINES (THE)', currency: 'Philippine Peso', alphaCode: 'PHP', numericCode: '608'},
    {country: 'PITCAIRN', currency: 'New Zealand Dollar', alphaCode: 'NZD', numericCode: '554'},
    {country: 'POLAND', currency: 'Zloty', alphaCode: 'PLN', numericCode: '985'},
    {country: 'PORTUGAL', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'PUERTO RICO', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'QATAR', currency: 'Qatari Rial', alphaCode: 'QAR', numericCode: '634'},
    {country: 'REPUBLIC OF NORTH MACEDONIA', currency: 'Denar', alphaCode: 'MKD', numericCode: '807'},
    {country: 'ROMANIA', currency: 'Romanian Leu', alphaCode: 'RON', numericCode: '946'},
    {country: 'RUSSIAN FEDERATION (THE)', currency: 'Russian Ruble', alphaCode: 'RUB', numericCode: '643'},
    {country: 'RWANDA', currency: 'Rwanda Franc', alphaCode: 'RWF', numericCode: '646'},
    {country: 'RÉUNION', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'SAINT BARTHÉLEMY', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {
        country: 'SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA',
        currency: 'Saint Helena Pound',
        alphaCode: 'SHP',
        numericCode: '654'
    },
    {country: 'SAINT KITTS AND NEVIS', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    {country: 'SAINT LUCIA', currency: 'East Caribbean Dollar', alphaCode: 'XCD', numericCode: '951'},
    {country: 'SAINT MARTIN (FRENCH PART)', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'SAINT PIERRE AND MIQUELON', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {
        country: 'SAINT VINCENT AND THE GRENADINES',
        currency: 'East Caribbean Dollar',
        alphaCode: 'XCD',
        numericCode: '951'
    },
    {country: 'SAMOA', currency: 'Tala', alphaCode: 'WST', numericCode: '882'},
    {country: 'SAN MARINO', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'SAO TOME AND PRINCIPE', currency: 'Dobra', alphaCode: 'STN', numericCode: '930'},
    {country: 'SAUDI ARABIA', currency: 'Saudi Riyal', alphaCode: 'SAR', numericCode: '682'},
    {country: 'SENEGAL', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'SERBIA', currency: 'Serbian Dinar', alphaCode: 'RSD', numericCode: '941'},
    {country: 'SEYCHELLES', currency: 'Seychelles Rupee', alphaCode: 'SCR', numericCode: '690'},
    {country: 'SIERRA LEONE', currency: 'Leone', alphaCode: 'SLL', numericCode: '694'},
    {country: 'SINGAPORE', currency: 'Singapore Dollar', alphaCode: 'SGD', numericCode: '702'},
    {
        country: 'SINT MAARTEN (DUTCH PART)',
        currency: 'Netherlands Antillean Guilder',
        alphaCode: 'ANG',
        numericCode: '532'
    },
    {
        country: 'SISTEMA UNITARIO DE COMPENSACION REGIONAL DE PAGOS "SUCRE"',
        currency: 'Sucre',
        alphaCode: 'XSU',
        numericCode: '994'
    },
    {country: 'SLOVAKIA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'SLOVENIA', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'SOLOMON ISLANDS', currency: 'Solomon Islands Dollar', alphaCode: 'SBD', numericCode: '090'},
    {country: 'SOMALIA', currency: 'Somali Shilling', alphaCode: 'SOS', numericCode: '706'},
    {country: 'SOUTH AFRICA', currency: 'Rand', alphaCode: 'ZAR', numericCode: '710'},
    //{country: 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS', currency: 'No universal currency', currency: '', currency: ''},
    {country: 'SOUTH SUDAN', currency: 'South Sudanese Pound', alphaCode: 'SSP', numericCode: '728'},
    {country: 'SPAIN', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
    {country: 'SRI LANKA', currency: 'Sri Lanka Rupee', alphaCode: 'LKR', numericCode: '144'},
    {country: 'SUDAN (THE)', currency: 'Sudanese Pound', alphaCode: 'SDG', numericCode: '938'},
    {country: 'SURINAME', currency: 'Surinam Dollar', alphaCode: 'SRD', numericCode: '968'},
    {country: 'SVALBARD AND JAN MAYEN', currency: 'Norwegian Krone', alphaCode: 'NOK', numericCode: '578'},
    {country: 'SWAZILAND', currency: 'Lilangeni', alphaCode: 'SZL', numericCode: '748'},
    {country: 'SWEDEN', currency: 'Swedish Krona', alphaCode: 'SEK', numericCode: '752'},
    {country: 'SWITZERLAND', currency: 'WIR Euro', alphaCode: 'CHE', numericCode: '947'},
    {country: 'SWITZERLAND', currency: 'Swiss Franc', alphaCode: 'CHF', numericCode: '756'},
    {country: 'SWITZERLAND', currency: 'WIR Franc', alphaCode: 'CHW', numericCode: '948'},
    {country: 'SYRIAN ARAB REPUBLIC', currency: 'Syrian Pound', alphaCode: 'SYP', numericCode: '760'},
    {country: 'TAIWAN (PROVINCE OF CHINA)', currency: 'New Taiwan Dollar', alphaCode: 'TWD', numericCode: '901'},
    {country: 'TAJIKISTAN', currency: 'Somoni', alphaCode: 'TJS', numericCode: '972'},
    {country: 'TANZANIA, UNITED REPUBLIC OF', currency: 'Tanzanian Shilling', alphaCode: 'TZS', numericCode: '834'},
    {country: 'THAILAND', currency: 'Baht', alphaCode: 'THB', numericCode: '764'},
    {country: 'TIMOR-LESTE', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'TOGO', currency: 'CFA Franc BCEAO', alphaCode: 'XOF', numericCode: '952'},
    {country: 'TOKELAU', currency: 'New Zealand Dollar', alphaCode: 'NZD', numericCode: '554'},
    {country: 'TONGA', currency: 'Pa’anga', alphaCode: 'TOP', numericCode: '776'},
    {country: 'TRINIDAD AND TOBAGO', currency: 'Trinidad and Tobago Dollar', alphaCode: 'TTD', numericCode: '780'},
    {country: 'TUNISIA', currency: 'Tunisian Dinar', alphaCode: 'TND', numericCode: '788'},
    {country: 'TURKEY', currency: 'Turkish Lira', alphaCode: 'TRY', numericCode: '949'},
    {country: 'TURKMENISTAN', currency: 'Turkmenistan New Manat', alphaCode: 'TMT', numericCode: '934'},
    {country: 'TURKS AND CAICOS ISLANDS (THE)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'TUVALU', currency: 'Australian Dollar', alphaCode: 'AUD', numericCode: '036'},
    {country: 'UGANDA', currency: 'Uganda Shilling', alphaCode: 'UGX', numericCode: '800'},
    {country: 'UKRAINE', currency: 'Hryvnia', alphaCode: 'UAH', numericCode: '980'},
    {country: 'UNITED ARAB EMIRATES (THE)', currency: 'UAE Dirham', alphaCode: 'AED', numericCode: '784'},
    {
        country: 'UNITED KINGDOM OF GREAT BRITAIN AND NORTHERN IRELAND (THE)',
        currency: 'Pound Sterling',
        alphaCode: 'GBP',
        numericCode: '826'
    },
    {
        country: 'UNITED STATES MINOR OUTLYING ISLANDS (THE)',
        currency: 'US Dollar',
        alphaCode: 'USD',
        numericCode: '840'
    },
    {country: 'UNITED STATES OF AMERICA (THE)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'UNITED STATES OF AMERICA (THE)', currency: 'US Dollar (Next day)', alphaCode: 'USN', numericCode: '997'},
    {
        country: 'URUGUAY',
        currency: 'Uruguay Peso en Unidades Indexadas (URUIURUI)',
        alphaCode: 'UYI',
        numericCode: '940'
    },
    {country: 'URUGUAY', currency: 'Peso Uruguayo', alphaCode: 'UYU', numericCode: '858'},
    {country: 'UZBEKISTAN', currency: 'Uzbekistan Sum', alphaCode: 'UZS', numericCode: '860'},
    {country: 'VANUATU', currency: 'Vatu', alphaCode: 'VUV', numericCode: '548'},
    {country: 'VENEZUELA (BOLIVARIAN REPUBLIC OF)', currency: 'Bolivar', alphaCode: 'VEF', numericCode: '937'},
    {country: 'VIET NAM', currency: 'Dong', alphaCode: 'VND', numericCode: '704'},
    {country: 'VIRGIN ISLANDS (BRITISH)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'VIRGIN ISLANDS (U.S.)', currency: 'US Dollar', alphaCode: 'USD', numericCode: '840'},
    {country: 'WALLIS AND FUTUNA', currency: 'CFP Franc', alphaCode: 'XPF', numericCode: '953'},
    {country: 'WESTERN SAHARA', currency: 'Moroccan Dirham', alphaCode: 'MAD', numericCode: '504'},
    {country: 'YEMEN', currency: 'Yemeni Rial', alphaCode: 'YER', numericCode: '886'},
    {country: 'ZAMBIA', currency: 'Zambian Kwacha', alphaCode: 'ZMW', numericCode: '967'},
    {country: 'ZIMBABWE', currency: 'Zimbabwe Dollar', alphaCode: 'ZWL', numericCode: '932'},
    {country: 'ÅLAND ISLANDS', currency: 'Euro', alphaCode: 'EUR', numericCode: '978'},
];
