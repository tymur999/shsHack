import React, {Component} from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/analytics';
import {Route} from "react-router";
import Marketplace from "./components/Marketplace";
import Layout from "./components/Layout";
import {Home} from "./components/Home";
import CreateItem from "./components/Item/CreateItem";
import UpdateItem from "./components/Item/UpdateItem";
import DeleteItem from "./components/Item/DeleteItem";
import { Index } from './components/Item/Index';
import LoginPage from "./components/UserSetup";

import {Row, Col, Toast} from "react-bootstrap"
import PaySuccess from "./components/PaySuccess";

export const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDI4oMDgIHCttEjhmnm_Ry2T9kTduBZCdY",
    authDomain: "shshacks-74a73.firebaseapp.com",
    projectId: "shshacks-74a73",
    storageBucket: "shshacks-74a73.appspot.com",
    messagingSenderId: "487581645099",
    appId: "1:487581645099:web:cb9b125f5e635875aa2d6e",
    measurementId: "G-E8TWWN10X1"
});

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const analytics = firebase.analytics();

export default class App extends Component {


    render() {

        return (
            <Layout>
                <Route exact path="/" component={Home}/>
                <Route path="/marketplace" component={Marketplace} />
                <Route path="/item/create" component={CreateItem}/>
                <Route path="/item/update" component={UpdateItem}/>
                <Route path="/item/delete" component={DeleteItem}/>
                <Route path="/login" component={LoginPage} />
                <Route exact path="/item" component={Index}/>
                <Route exact path="/item/index" component={Index}/>
                <Route path="/pay-success" component={PaySuccess}/>
            </Layout>
        );
    }
}

// <Item name="xxx" desc="xxx" />