    import React, {Component, Fragment} from "react";
import Navbar from "react-bootstrap/Navbar";
import {Container, DropdownButton, Form, Nav, NavbarBrand, NavItem, NavLink} from "react-bootstrap";
import NavbarToggle from "react-bootstrap/NavbarToggle";
import NavbarCollapse from "react-bootstrap/NavbarCollapse";
import "../navigation.css";
import DropdownItem from "react-bootstrap/DropdownItem";
import icon from "../img/templates (4).png"
import 'firebase/auth';
import "firebase/analytics";
import {auth} from "../App";
import firebase from "firebase";


//User is authenticated or not
interface INavState {
    isAuthenticated?: boolean
    loginMethod?: string
}

//Properties, so far none
interface INavProps {
}

export class Navigation extends Component<INavProps, INavState> {
    constructor(props: INavProps) {
        super(props);
        this.state = {
            isAuthenticated: false,
            loginMethod: undefined,
        }
        this.submitSearch = this.submitSearch.bind(this);
    }

    componentDidMount = () => {
        auth.onAuthStateChanged((user) => {
            console.log(user);
            this.setState({isAuthenticated: user != null});
        })
    }

    signInWithGoogle = () => {
        auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL).then(() => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((account) => {
                    console.log("Logged in with Google");
                    let user = account.user;

                    auth.fetchSignInMethodsForEmail(user?.email!)
                        .then((arrayOfEmails) => {
                            if (!arrayOfEmails) {
                                console.log("ooh new user")
                                window.location.href = "/login";

                            } else {
                                console.log("this one smells")
                            }
                        })

                }, (error) => {
                    console.log(error);
                })
        })

        this.setState({
            loginMethod: "google",
            isAuthenticated: true,
        })
    }

    signOut = () => {
        firebase.auth().signOut().then((packet) => {
            console.log("Logout complete")
        });
        this.setState({
            loginMethod: undefined,
            isAuthenticated: false,
        })
    }
    submitSearch(event:any){
        event.preventDefault();
        const search = document.querySelector("input[id='search-input']") as HTMLInputElement;
        window.location.href = '/marketplace?id=' + encodeURIComponent(search.value);
    }

    render() {
        return (
            <div
                className="d-flex d-xl-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-md-center align-items-md-center align-items-lg-center justify-content-xl-start align-items-xl-center"
                id="top" style={{borderBottom: "1px solid rgba(0,0,0,0.14)",height: "75px", background: "#000e1b"}}>
                <button onClick={this.signInWithGoogle}
                    className="btn btn-primary d-flex d-sm-flex d-md-flex d-lg-flex d-xl-flex justify-content-end align-items-center justify-content-sm-end align-items-sm-center justify-content-md-end align-items-md-center justify-content-lg-end align-items-lg-center justify-content-xl-end align-items-xl-center"
                    type="button"
                    style={{background: "rgba(0,0,0,0)", width: "200px", height: "50px", borderColor: "#ffffff",}}>
                    <img
                    data-aos="zoom-in-down" src={icon}
                    style={{width: "100%", height: "100%"}}/>
                </button>
                <div
                    className="d-inline-flex justify-content-end justify-content-sm-end justify-content-md-end justify-content-lg-end align-items-lg-center justify-content-xl-end"
                    data-aos="zoom-in-down" style={{}}>
                    <input type="search" style={{}} name="searchbar" placeholder="Search For Anything" />
                    <button className="btn btn-primary" type="button" style={{}}>Search</button>
                </div>

                <div className="container d-xl-flex justify-content-xl-center align-items-xl-center"
                     style={{}}>
                    <div
                        className="row d-flex d-sm-flex justify-content-center align-items-center justify-content-sm-center align-items-sm-center justify-content-xl-center"
                        data-aos="zoom-in-down">
                        <div
                            className="col-md-4 d-sm-flex d-xl-flex justify-content-sm-start justify-content-xl-center align-items-xl-center"
                            style={{}}><a
                            className="btn btn-primary d-flex d-sm-flex d-md-flex d-lg-flex justify-content-start align-items-center justify-content-sm-start justify-content-md-start align-items-md-center justify-content-lg-start align-items-lg-center"
                            role="button" data-bss-hover-animate="pulse"
                            onClick={this.signInWithGoogle}
                            href="#login(salvage)">Account</a></div>
                        </div>
                    </div>
                </div>
        );
    }
}
