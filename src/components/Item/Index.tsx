//Actual product data

import {RouteComponentProps} from "react-router";
import {Component} from "react";
import {auth, firestore} from "../../App";
import React from "react";
import { Fragment } from "react";
import {Jumbotron} from "react-bootstrap";
import "@stripe/stripe-js/dist/stripe.esm.js"
import {loadStripe} from "@stripe/stripe-js/pure";
import {CardElement, Elements, ElementsConsumer, useElements, useStripe} from "@stripe/react-stripe-js";

export class Index extends Component<RouteComponentProps<any>, any> {

    constructor(props:any) {
        super(props);
        this.state = {
            cost: 0,
            name: undefined,
            desc: undefined,
            imgUrl: undefined
        };
    }

    async componentDidMount() {
        const id = new URLSearchParams(this.props.location.search).get("id") as string;
        if(id == null)
        {
            window.location.href = "..";
            return;
        }

        this.setState({
            id : id
        });

        const query = (await firestore.collection("Rentals").doc(id).get()).data();
        //If rental not found, or no user is found, or if user does not own the rental
        console.log(query);
        if(query == null){
            window.location.href = "..";
            return;
        }
        let owned = false;
        auth.onAuthStateChanged(user => {
            if(user == null)
                owned = false;
            else if(user.email == query.creator || user.email == query.rentee)
                owned = true;
        })

        this.setState({
            cost : query.cost,
            name: query.name,
            desc: query.desc,
            imgUrl: query.imgUrl,
            ownsProduct : owned,
            stripePriceId: query.stripePriceId
        })
    }

    render(){
        return(
            <Fragment>
                <Jumbotron><img alt={this.state.name} src={this.state.imgUrl}/></Jumbotron>
                <h1>{this.state.name}</h1>
                <h2>{this.state.price}</h2>
                <p>{this.state.desc}</p>
                {this.state.ownsProduct ? <Fragment/> : (
                    <Elements stripe={loadStripe("pk_test_51Ik2cgCFuAFW3uTjjthICnBCpTv0cbsZUSlUQRZtVBhBhzUvxdcsPlQlQ9XkVXvI6rpDCmc9z0eB3PIuZxlOgZFF00JzDXPOnS")}>
                        <CheckoutForm id={new URLSearchParams(this.props.location.search).get("id")} paymentId={this.state.stripePriceId}/>
                    </Elements>
                )}
            </Fragment>
        );
    }
}

const CheckoutForm = (props:any) => {
    const stripe = useStripe();
    const elements = useElements();
    const handleSubmit = async (event:any) => {
        // Block native form submission.
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        if(auth.currentUser == null) return;

        await stripe.redirectToCheckout({
            submitType : "pay",
            successUrl : `http://localhost:3000/pay-success?id=${props.id}`,
            cancelUrl : "http://localhost:3000/pay-cancel",
            lineItems : [
                {
                    price : props.paymentId,
                    quantity : 1
                }
            ],
            mode : "payment"
        });
    };
    return <form onSubmit={handleSubmit}>
        <button type="submit" className="btn btn-primary">
            Rent out this item
        </button>
    </form>
};