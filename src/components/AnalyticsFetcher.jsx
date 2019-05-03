import React, { Component } from 'react';
import makeApiCall from '../oauthUtils';
import './analytics-fetcher.css';

class AnalyticsFetcher extends Component {
  constructor (props, context) {
    super(props, context);
    this.state = {
      analyticData:  null
    };
    this.getAnalyticsForVideo = this.getAnalyticsForVideo.bind(this);
  }

  componentDidMount () {
    this.getAnalyticsForVideo(this.props.selectedVideo);
  }

  componentDidUpdate (prevProps) {
    if (this.props.selectedVideo !== prevProps.selectedVideo ) {
      this.getAnalyticsForVideo(this.props.selectedVideo);
    }
  }

  getAnalyticsForVideo (video) {
    const apiCall = `https://analytics.api.brightcove.com/v1/data?accounts=6027103981001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed&video=${video}`;
    const method = 'GET';
    makeApiCall(apiCall, method)
      .then((response) => {
        console.log('Success:', JSON.stringify(response));
        this.setState({ analyticData: response })
      })
      .catch(error => console.error('Error:', error))
  }

  render () {
    return (
      <div>
        <label>Video Analytics:</label>
        { this.state && this.state.analyticData &&
          <pre>{ JSON.stringify(this.state.analyticData, null, 2)}</pre>
        }
      </div>
    );
  }
}

export default AnalyticsFetcher;
