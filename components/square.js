import React from 'react';
import _ from 'lodash';

class Square extends React.Component {

  handleClick(evt) {
    if (_.isFunction(this.props.onClick)) {
      this.props.onClick(evt.currentTarget);
    }
  }

  getClassName() {
    return `square ${ this.props.isWinner ? 'winner' : '' }`;
  }

  render() {
    return (
        <div className={ this.getClassName() } onClick={ this.handleClick.bind(this) }>
          <strong>{ this.props.marker }</strong>
        </div>
    );
  }

}

Square.propTypes = {
  isWinner: React.PropTypes.bool
};

Square.defaultProps = {
  isWinner: false
};

export default Square;