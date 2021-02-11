import React, {Component} from 'react';
import {Segment, Dimmer, Loader} from "semantic-ui-react";

class LoaderSpinner extends Component{
    render(props) {
        return (
            <Segment>
                <Dimmer active inverted>
                    <Loader inverted content='Loading' />
                </Dimmer>
            </Segment>
        );
    }
}
export default LoaderSpinner;