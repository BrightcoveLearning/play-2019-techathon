import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AnalyticsFetcher.css';
import { connect } from 'react-redux';

class AnalyticsFetcher extends Component {
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
    const { analyticData } = this.props;

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

const mapStateToProps = (state) => ({
  analyticData: state.base.analyticData
});

AnalyticsFetcher.propTypes = {
  analyticData: PropTypes.object
};

export default connect(mapStateToProps)(AnalyticsFetcher);
