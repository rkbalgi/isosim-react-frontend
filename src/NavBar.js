import React from 'react';

class NavBar extends React.Component {

  constructor(props) {
    super(props);
    this.state = {specs: ["Spec1", "Spec2", "Spec3"]}
  }

  render() {
    return (
        <div align="left">
          <ul>
            <li>Select Spec</li>
            {this.specsAsComboBox()}
          </ul>
        </div>

    );
  }

  specsAsComboBox() {
    return (<select>
      {
        this.state.specs.map((s, i) => {
          return <option>{s}</option>
        })
      }

    </select>);
  }

}

export default NavBar