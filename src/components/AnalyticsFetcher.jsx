import React, { Component } from 'react';
import './AnalyticsFetcher.css';
import { connect } from 'react-redux';

class AnalyticsFetcher extends Component {
  render () {
    return (
      <div>
        <label>Video Analytics:</label>
        <pre>{JSON.stringify(this.props.analyticData, null, 2)}</pre>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  analyticData: state.base.analyticData
});

export default connect(mapStateToProps)(AnalyticsFetcher);
