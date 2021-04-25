import {Component} from "react";
import {Button, Container, Form, FormGroup} from "react-bootstrap";
import {auth, firestore} from "../../App"
import {RouteComponentProps, withRouter} from "react-router";

class UpdateItem extends Component<RouteComponentProps<any>, any> {
    constructor(props: RouteComponentProps<any>) {
        super(props);
        this.state = {
            id: undefined,
            cost: undefined,
            creator: undefined,
            name: undefined,
            desc: undefined,
            imgUrl: undefined,
        };
        this.renderImage = this.renderImage.bind(this);
        this.updateRental = this.updateRental.bind(this);
    }

    async componentDidMount() {
        const id = new URLSearchParams(this.props.location.search).get("id") as string;
        if (id == null) {
            window.location.href = "Index";
            return;
        }

        this.setState({
            id: id
        });

        const query = (await firestore.collection("Rentals").doc(id).get()).data();
        //If rental not found, or no user is found, or if user does not own the rental
        console.log(query);
        if (query == null) {
            window.location.href = "Index";
            return;
        }

        await auth.onAuthStateChanged(user => {
            if (user == null || user.email != query.creator) {
                window.location.href = "Index";
                return;
            }
        })

        this.setState({
            cost: query.cost,
            name: query.name,
            desc: query.desc,
            imgUrl: query.imgUrl
        })

    }

    async updateRental(event: any) {
        await firestore.collection("Rentals").doc(this.state.id).update({
            name: this.state.name,
            desc: this.state.desc,
            cost: this.state.cost,
            imgUrl: this.state.imgUrl
        });
    }

    async renderImage(event: any) {
        //Test for a url
        //eslint-disable-next-line no-control-regex
        let url;
        try {
            url = new URL(event.target.value);
        } catch (_) {
            return;
        }
        this.setState({
            imgUrl: url.toString()
        });
    }

    render() {
        return (
            <Form onSubmit={this.updateRental}>
                <Container className="d-block align-text-center mx-auto">
                    <h2>Update an item</h2>
                    <img id="present" width="200px" height="200px" src={this.state.imgUrl}/>
                    <FormGroup>
                        <label>Name:</label>
                        <input name="name" required type="text" placeholder={this.state.name}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Description:</label>
                        <input name="desc" required type="text" placeholder={this.state.desc}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Cost:</label>
                        <input name="cost" type="decimal" required pattern="0*[1-9][0-9]*(\\.[0-9]+)?"
                               placeholder={this.state.cost}/>
                    </FormGroup>
                    <FormGroup>
                        <label>Image:</label>
                        <input onBlur={this.renderImage} name="image" type="url" required
                               placeholder={this.state.imgUrl}/>
                    </FormGroup>
                    <Button type="submit" variant="primary">Submit</Button>
                </Container>
            </Form>);
    }
}

export default withRouter(UpdateItem);