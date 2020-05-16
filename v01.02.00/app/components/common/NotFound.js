import React from 'react';
import { Link } from 'react-router';

class NotFound extends React.Component {
  
  render() {
    
    return (
        <div className="not-found">
          <div>
            <img src="img/not-found.png"></img>
            <div>{this.props.desc}<Link to={this.props.linkUrl}>{this.props.linkText}</Link></div>
          </div>
        </div>
    );
  }
}

export default NotFound;