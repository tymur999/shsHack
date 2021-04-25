import React, {Component} from "react";
import {Form, FormGroup, Button} from "react-bootstrap";
import {RouteComponentProps, withRouter} from "react-router";
import {auth, firestore} from "../App";
import Repository from "./Repository";

interface ILogProps {}

interface ILogState {
    zipcode ?: number
}

export default class LoginPage extends Component<ILogProps, ILogState> {
    constructor(props: ILogProps) {
        super(props)

        this.state = {
            zipcode: undefined,
        }
    }

    async addNewUser(zipcode: number) {
        const user = auth.currentUser!;
        await firestore.collection('Users').doc(user.email!).set({
            name: user.displayName,
            rentals: [],
            pfpurl: user.photoURL,
            zipcode: zipcode,
        })
    }

    render() {
        const style = {
            base: {
                width: "100%",
                alignContent: "center",
            }
        }

        return (
            <Form style={style.base}>
                <Form.Group>
                    <Form.Label>Zipcode</Form.Label>
                    <Form.Control required type="text" placeholder="(5 digits)" onChange={(event) => this.setState({zipcode: parseInt(event.target.value)})}/>
                    <Form.Text>A rough location is necessary for our location-based searching system.</Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={(event) => (this.addNewUser(this.state.zipcode!))}>
                    Finish Signup
                </Button>
            </Form>
        );
    }
}

/*
        Repository
    async addNewUser(name: string, age: number, pfpurl: string, zipcode: number) {
        const user = auth.currentUser!;
        await firestore.collection('Users').doc(user.email!).set({
            name: "",
            age: 0,
            pfpurl: "",
            zipcode: 0
        })
    }
 */