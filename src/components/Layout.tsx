import {Component, Fragment} from "react";
import {Navigation} from "./Navigation";
import {Footer} from "./Footer";
import "bootstrap/dist/css/bootstrap.min.css"
import "react-bootstrap/dist/react-bootstrap.min.js"
import "font-awesome/css/font-awesome.min.css"

export default class Layout extends Component {
    render() {
        return <Fragment>
            <Navigation />
            {this.props.children}
            <Footer/>
        </Fragment>
    }
}