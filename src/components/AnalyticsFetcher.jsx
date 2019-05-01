import React, { Component } from 'react';
import './analytics-fetcher.css';
import {connect} from "react-redux";

class AnalyticsFetcher extends Component {
    render() {
        return (
            <div>
                <label>
                    Video Analytics:
                </label>
                <pre>
                {JSON.stringify(this.props.analyticData, null, 2)}
                </pre>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        analyticData:state.analyticData,
        selectedVideo: state.selectedVideo,
        videoIds: state.videos.map((e) => e.id)
    };
};

export default connect(mapStateToProps)(AnalyticsFetcher);
