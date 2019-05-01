import React from 'react';
import './analytics-fetcher.css';

class AnalyticsFetcher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoID: '6029593216001',
            analyticData: {}
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {

    }

    componentWillUnmount() {

    }
    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        let apiCall = `https://analytics.api.brightcove.com/v1/data?accounts=6027103981001&dimensions=video&fields=video,video_duration,video_engagement_1,video_engagement_100,video_engagement_25,video_engagement_50,video_engagement_75,video_impression,video_percent_viewed,video_seconds_viewed&video=${this.state.videoID}`;
        let method = 'GET';
        const data = {
            apiCall: apiCall,
            method: method
        };
        fetch('http://play-oauth-proxy.applications.us-east-1.prod.deploys.brightcove.com/api/defaultCreds', {
            method: 'POST', // or 'PUT'
            body: JSON.stringify(data), // data can be `string` or {object}!
            headers:{
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(response => {
                console.log('Success:', JSON.stringify(response));
                this.setState({analyticData: response});

            })
            .catch(error => console.error('Error:', error));
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Video ID:
                        <input type="text" value={this.state.videoID} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Submit" />
                    <pre>
                        {JSON.stringify(this.state.analyticData, null, 2)}
                    </pre>
                </form>
            </div>
        );
    }
}
export default AnalyticsFetcher;
