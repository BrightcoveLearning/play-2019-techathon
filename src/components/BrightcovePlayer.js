import React, {Component} from 'react';
import './BrightcovePlayer.css';
import {connect} from "react-redux";
import Player from '@brightcove/react-player-loader';

class BrightcovePlayer extends Component {

    success = ({ ref }) => {
        this.playerRef = ref;
        if (this.props.selectedVideo !== null) {
            this.playerRef.catalog.load({
                sources: [this.props.selectedVideo]
            });
        }
    };
    shouldComponentUpdate(nextProps) {
        return this.props.selectedVideo !== nextProps.selectedVideo;
    }
    componentDidUpdate(prevProps) {
        this.playerRef.catalog.getVideo(this.props.selectedVideo, (error, video) => {
            this.playerRef.catalog.load(video);
        });
    }
    render() {
        return (
            <Player attrs={{id: 'videoPlayer'}}
                    accountId='6027103981001'
                    playerId='default'
                    onSuccess={this.success}
                    options={{
                        controls: true,
                        fluid: true
                    }}
            />
        )
    }
}

const mapStateToProps = (state) => {
    return {
        selectedVideo: state.selectedVideo
    };
};

export default connect(mapStateToProps)(BrightcovePlayer);
