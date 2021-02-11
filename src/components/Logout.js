import React, {Component} from 'react';
import {Link} from "react-router-dom";

class Logout extends Component {
    state = {}

    render() {
        return (
            <div className='ui center aligned container'>
                {/*<div className='ui placeholder segment'>*/}
                {/*    <div className="ui icon header">*/}
                {/*        <i aria-hidden="true" className="lock open circular icon"></i>*/}
                {/*        <h1>You are logged out</h1>*/}
                {/*    </div>*/}
                {/*    <div className="container">*/}
                {/*        Thank you for using our application.*/}
                {/*        <Button as={Link} to={'/login'}>Login</Button>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        )
    }
}

export default Logout;