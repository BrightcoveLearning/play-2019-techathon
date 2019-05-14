import React, { Component } from 'react';
import PropTypes from 'prop-types';
import makeApiCall from '../oauthUtils';
import './AnalyticsFetcher.css';

class AnalyticsFetcher extends Component {
  constructor (props) {
    super(props);
    this.state = {
      analyticData: null
    };
    this.getAnalyticsForVideo = this.getAnalyticsForVideo.bind(this);
  }

  componentDidMount () {
    this.getAnalyticsForVideo(this.props.selectedVideo);
  }

  componentDidUpdate (prevProps) {
    if (this.props.selectedVideo !== prevProps.selectedVideo) {
      this.getAnalyticsForVideo(this.props.selectedVideo);
    }
  }

  getAnalyticsForVideo (video) {
    const apiCall = 'https://analytics.api.brightcove.com/v1/data?' +
      'accounts=6027103981001' +
      '&dimensions=video' +
      '&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed' +
      `&where=video==${video}`;
    const method = 'GET';
    makeApiCall(apiCall, method)
      .then((response) => {
        this.setState({ analyticData: response })
      })
      .catch(error => console.error('Error:', error))
  }

  renderTableRow (item, index, headers) {
    if (index === 'summary') {
      item.video = 'summary';
    }

    return (
      <tr key={`row-${index}`}>
        {
          headers.map((header, i) => {
            return (
              <td key={`value-${i}`}>
                {item[header]}
              </td>);
          })
        }
      </tr>
    );
  }

  renderHeaderRow (headers) {
    const headerList = headers.map((header) => {
      return header.replace(/_/g, ' ');
    });

    return (
      <tr key='header'>
        {
          headerList.map((h, i) => (
            <th key={`header-${i}`}>{h}</th>
          ))
        }
      </tr>
    );
  }

  buildHeaderList (item, mainField = 'video') {
    const result = [];

    result.push(mainField);

    Object.keys(item).sort().forEach((key) => {
      if (key !== mainField) {
        result.push(key);
      }
    });

    return result;
  }

  renderTable () {
    const { analyticData } = this.state;

    if (!analyticData || analyticData.item_count < 1) {
      return null;
    }

    const { items, summary } = analyticData;
    const headers = this.buildHeaderList(items[0]);

    return (
      <table>
        <thead>
          {this.renderHeaderRow(headers)}
        </thead>
        <tbody>
          {
            items.map((item, i) => this.renderTableRow(item, i, headers))
          }
        </tbody>
        <tfoot>
          {this.renderTableRow(summary, 'summary', headers)}
        </tfoot>
      </table>
    );
  }

  render () {
    return (
      <div className='analytics-display'>
        <h3>Video Analytics:</h3>
        { this.renderTable() }
      </div>
    );
  }
}

AnalyticsFetcher.propTypes = {
  selectedVideo: PropTypes.string
}

export default AnalyticsFetcher;
