import React, {Component} from "react";
import "bootstrap/dist/css/bootstrap.min.css"
import "react-bootstrap/dist/react-bootstrap.min.js"
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import {firestore} from "../../App";
import App from "../../App"
import Repository from "../Repository";

interface ItemProps {
    doc ?: any,
}


interface ItemState {
    cost?: number,
    creator?: string,
    name?: string,
    desc?: string,
    imgUrl?: string,
    id?: number,
    distance?: number,
    category?: string,
    status?: string,
    buttonText?: string,
    buttonVariant?: string,
}

export default class Item extends React.Component<ItemProps, ItemState> {

    constructor(props : ItemProps) {
        super(props)
        this.state = {
            cost: 0,
            creator: "",
            name: "",
            desc: "",
            imgUrl: "",
            id: 0,
            distance: 0,
            category: this.props.doc.category,
            status: "Loading...",
            buttonText: "Rent Out",
            buttonVariant: "primary",
        };
        this.onClick = this.onClick.bind(this);
    }

    async componentDidMount() {
        (new Repository().getProfileData()).then((val) => {
            let data = val[5]

            this.setState({
                cost: this.props.doc.cost,
                creator: this.props.doc.creator,
                name: this.props.doc.name,
                desc: this.props.doc.desc,
                imgUrl: this.props.doc.imgUrl,
                id: this.props.doc.id,
                distance: (new Repository()).getDistance(this.props.doc.zipcode, data),
                category: this.props.doc.category,
                status: "Loading...",
                buttonText: "Rent Out",
                buttonVariant: "primary",
            });
        })
    }

    async onClick() {
        let repo = new Repository();

        this.setState({
            buttonText: "Request Sent!",
            buttonVariant: 'secondary',
        });
    }

    render() {
        const styles = {
            titleText: {
                fontSize: "16px",
            },
            descText: {
                fontSize: "12px",
            },
            card: {
                maxHeight: "500px",
                width: "18rem"
            },
        }

        return (
            <Card style={styles.card}>
                <Card.Img variant="top" style={{maxHeight: "200px", objectFit: "cover"}} src={this.state.imgUrl}/>
                <Card.Body>
                    <Card.Title style={styles.titleText}>{this.state.name} (${this.state.cost})</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted" style={{fontSize: "12px"}}>by {this.state.creator} ({this.state.distance} mi.)</Card.Subtitle>
                    <Card.Text style={styles.descText}>{this.state.desc}</Card.Text>
                </Card.Body>
                <Button variant={this.state.buttonVariant} className={this.state.buttonVariant == "secondary" ? "disabled" : ""} onClick={this.onClick}>{this.state.buttonText}</Button>
            </Card>
        );
    }
}

/*
async getZip() {
    const user = auth.currentUser!;
    const info = await firestore.collection("Users").doc(user.email!).get();
    const data = info.data()!.zipcode;
    return data;
}*/
