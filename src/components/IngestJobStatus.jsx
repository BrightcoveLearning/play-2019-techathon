import React, { Component } from 'react';
import PropTypes from 'prop-types';
import makeApiCall from '../oauthUtils';

import './IngestJobStatus.css';

class IngestJobStatus extends Component {
  constructor (props) {
    super(props);

    this.checkStatus = this.checkStatus.bind(this);
    this.checkStatusInterval = null;
    this.state = {
      jobStatus: null,
      isRequestingStatus: false
    };
  }

  getIngestStatus () {
    const { accountId, videoId, ingestJobId } = this.props;
    const { isRequestingStatus } = this.state;

    if (!ingestJobId || isRequestingStatus || !accountId || !videoId) {
      return null;
    }

    const apiCall = `https://cms.api.brightcove.com/v1/accounts/${accountId}/videos/${videoId}/ingest_jobs/${ingestJobId}`;
    const method = 'GET';

    this.setState({
      isRequestingStatus: true
    });

    return makeApiCall(apiCall, method)
      .then((data) => {
        this.setState({
          jobStatus: data,
          isRequestingStatus: false
        });
      });
  }

  checkStatus () {
    const { jobStatus } = this.state;

    if (jobStatus && jobStatus.state === 'finished') {
      window.clearInterval(this.checkStatusInterval);
      this.checkStatus = null;
    } else {
      return this.getIngestStatus();
    }
  }

  componentDidMount () {
    this.checkStatus();
    this.checkStatusInterval = window.setInterval(this.checkStatus, 1000 * 10);
  }

  render () {
    const { jobStatus } = this.state;
    let jobState;
    let errorMsg;

    if (jobStatus) {
      jobState = `status: ${jobStatus.state}`;
      errorMsg = jobStatus.error_message
        ? `error: ${jobStatus.error_message}`
        : '';
    }

    return (
      <div>
        ingestJobStatus
        {
          jobStatus &&
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

IngestJobStatus.propTypes = {
  accountId: PropTypes.number,
  videoId: PropTypes.string,
  ingestJobId: PropTypes.string
}

export default IngestJobStatus;
