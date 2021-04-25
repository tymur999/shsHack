import React from "react";
import {RouteComponentProps, withRouter} from "react-router";
import {auth, firestore} from "../App";

class PaySuccess extends React.Component<RouteComponentProps<any>, any> {
    constructor(props:any) {
        super(props);
        this.state = {
            item : {
                desc:"",
                cost:0,
                name:""
            }
        }
    }
    async componentDidMount() {
        const id = new URLSearchParams(this.props.location.search).get("id");
        if(id == null)
        {
            window.location.href="..";
            return;
        }

        const query = (await firestore.collection("Rentals").doc(id).get()).data();
        //If rental not found, or no user is found, or if user does not own the rental
        console.log(query);
        if(query == null){
            window.location.href = "..";
            return;
        }
        auth.onAuthStateChanged(user => {
            if(user == null || query.creator == user.email) {
                window.location.href = "..";
                return;
            }
            else{
                //Now that user is validated, set the rentee
                firestore.collection("Rentals").doc(id).update({
                    rentee : auth.currentUser!.email
                });
            }
        })
        this.setState({item : query});
    }
    render(){
        return (<div>
            Thanks for renting '{this.state.item.name}' from us.
        </div>);
    }
}

export default withRouter(PaySuccess);