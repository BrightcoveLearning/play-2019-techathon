import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  getIngestStatus
} from '../actions';
import './IngestJobStatus.css';

class IngestJobStatus extends Component {
  componentDidMount (prevProps) {
    const { dispatch, accountId, videoId, ingestJob } = this.props;

    if (!ingestJob.status || ingestJob.status !== 'finished') {
      console.log('got here');
      window.setInterval(
        () => {
          dispatch(getIngestStatus(accountId, videoId, ingestJob.ingestJobId))
        },
        1000 * 60
      );
    }
  }

  render () {
    const { ingestJob } = this.props;
    let jobState;
    let errorMsg;

    if (ingestJob && ingestJob.status) {
      jobState = `status: ${ingestJob.status.state}`;
      errorMsg = ingestJob.status.error_message
        ? `error: ${ingestJob.status.error_message}`
        : '';
    }

    return (
      <div>
        ingestJobStatus
        {
          ingestJob && ingestJob.status &&
          <div>
            <p>
              {jobState}
            </p>
            <p>
              {errorMsg}
            </p>
          </div>
        }
      </div>
    );
  }
}

/**
 * see https://redux-docs.netlify.com/basics/usage-with-react#implementing-container-components
 */
const mapStateToProps = (state) => ({
  ingestJob: state.currentIngest,
  accountId: state.base.accountId,
  videoId: state.currentRemoteUpload.videoId
});

export default connect(mapStateToProps)(IngestJobStatus);
