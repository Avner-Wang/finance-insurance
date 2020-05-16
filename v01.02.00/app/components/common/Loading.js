import React from 'react';

class Loading extends React.Component {
  
  render() {
    
    return (
      <div id="page-loading" className="text-center loading">
        <img src="img/loading.gif" />
        <span>&nbsp;&nbsp;加载中&middot;&middot;&middot;</span>
      </div>
    );
  }
}

export default Loading;