import React from 'react';

class Reset extends React.Component {

  render() {
    return (<button className="reset" onClick={ this.props.onClick }>Reset</button>);
  }

}

export default Reset;
