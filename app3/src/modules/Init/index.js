import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import InstaelumService from '../services/InstaelumService';
//import { FormBuilder } from '../../components/FormBuilder';

export class LoginScreen extends Component {
    static navigationOptions = {
        title: "Init",
        header: null
    };
    

    render(){
        return (
            ""
        );
    }
  }

  const styles = StyleSheet.create({
        title: {
            fontSize: 30,
            fontWeight: "bold"
        },
        btn: {
            backgroundColor: "#3095f3",
            borderRadius: 10,
            padding: 10,
            alignSelf: "stretch",
            justifyContent: "center",
            alignItems: "center"
        },
        textColor: {
            color: "#fff",
            fontSize: 15
        },
        container: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: 50,
            paddingRight: 50
        },
        formTextField: {
            height: 40,
            borderBottomWidth: 2,
            borderBottomColor: "#666",
            alignSelf: "stretch",
            marginBottom: 15
        }
  });