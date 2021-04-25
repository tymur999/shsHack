import {Component} from "react";
import {withRouter, RouteComponentProps} from "react-router";
import { firestore } from "../../App";
import {ItemData} from "./ItemData";

class DeleteItem extends Component<RouteComponentProps<any>, ItemData> {

    constructor(props:any) {
        super(props);
        this.state = {
            cost: 0,
            creator: undefined,
            name: undefined,
            desc: undefined,
            imgUrl: undefined,
            id: undefined
        }
    }

    async deleteRentalItem(id: string) {
        (await firestore.collection("Rentals").doc(id).get()).data();
    }

    render() {
        return (
            <div/>
        );
    }
}
export default withRouter(DeleteItem);