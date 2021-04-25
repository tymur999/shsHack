import React, {Component} from "react";
import {auth, firestore} from "../App";
import firebase from "firebase/app";
import Repository from "./Repository";


import {Container, Row, Col, Toast} from "react-bootstrap"
import Item from "./Item/Item"
import {Fragment} from "react";
import {RouteComponentProps, useLocation} from "react-router";

interface IMPProps {
}

interface IMPState {
    columns?: Array<any>,
    isLoading?: boolean
    showing?: boolean
    toastItem?: string,
    toastItemOwner?: string,
    id?: string
}

// Local distance requires a search query. Returns all rental documents with that name that are within 15 miles as an array

export default class Marketplace extends Component<RouteComponentProps<IMPProps>, IMPState> {

    constructor(props: RouteComponentProps<IMPProps>) {
        super(props);
        this.state = {
            columns: [[], [], []],
            isLoading: true
        }
    }

    onRentConfirm(itemName: string, ownerEmail: string) {
        this.setState({
            showing: false,
            toastItem: itemName,
            toastItemOwner: ownerEmail,
        });
    }

    async loadData(searchId:string | null) {
        let data = (await (new Repository()).defaultLoad());
        console.log(data);
        //data = data ?? [];
        let columns = [[], [], []];
        for (let i = 0; i < data.length; i++) {
            // @ts-ignore
            columns[i % 3].push(<Item doc={data[i]} key={data[i]} className="my-3"/>);
        }
        console.log(columns);
        return columns;
    }

    render() {
        return (
            <div>
                <Container className="d-flex justify-content-evenly">
                    {this.state.isLoading
                        ?
                        <Fragment>
                            <p>loading...</p>
                        </Fragment>
                        :
                        <Fragment>
                            <Col>{this.state.columns![0]}</Col>
                            <Col>{this.state.columns![1]}</Col>
                            <Col>{this.state.columns![2]}</Col>
                        </Fragment>
                    }
                </Container>
            </div>);
    }

    async componentDidMount() {
        const searchId = new URLSearchParams(this.props.location.search).get("id");
        console.log(searchId);
        if (searchId != null)
            this.setState({
                id: searchId
            });
        auth.onAuthStateChanged(user => {
            if (user == null) {
                auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider()).then(
                    (success) => {
                        console.log("Successfully logged in with Google")
                    },
                    (error) => {
                        console.log(error)
                    }
                );
            }
            else {
                this.loadData(searchId).then(data => {
                    this.setState({
                        columns: data,
                        isLoading: false
                    })
                })
            }
            //User has been loaded, now we can fetch zip code
        });

    }
}


