import React from 'react';

class LoadingToast extends React.Component {
  
  render() {
   
    return (
      <div className="system-loading-toast" id={this.props.id}>
        <div className="system-mask"></div>
        <div className="system-toast">
          <div className="sk-folding-cube">
            <div className="sk-cube1 sk-cube"></div>
            <div className="sk-cube2 sk-cube"></div>
            <div className="sk-cube4 sk-cube"></div>
            <div className="sk-cube3 sk-cube"></div>
          </div>
          <p className="system-toast-content">{this.props.tips}&hellip;</p>
        </div>
      </div>
    );
  }
}

export default LoadingToast;