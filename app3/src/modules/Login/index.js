import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, AsyncStorage} from 'react-native';
import InstaelumService from '../services/InstaelumService';
import { FormBuilder } from '../../components/FormBuilder';

export class LoginScreen extends Component {
    static navigationOptions = {
        title: "Login",
        header: null
    };
    
    state = {
        login: "",
        senha: ""
    }

    handleChange = nomeDoCampo => {
        return valorDoCampo => {
            this.setState({[nomeDoCampo] : valorDoCampo})
        };
    }

    handleUserLogin = () => {
        InstaelumService.login({ login: this.state.login, senha: this.state.senha })
            .then(() => {
                this.props.navigation.navigate("Auth");
            })
            .catch(err => {
                alert("Erro !");
            });
    }

    render(){
        return (
            <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
               {/*  <FormBuilder
                    fields={[
                        {
                            id: 1,
                            name: 'login',
                            type: 'text',
                            label: "Login",
                            value: "",
                            syncValidators: []
                        },
                        {
                            id: 2,
                            name: 'senha',
                            type: 'password',
                            label: "Senha",
                            value: "",
                            syncValidators: []
                        }
                     ]}
                /> */}
                <Text style={styles.title}>Instaelum</Text> 
                <TextInput 
                    onChangeText={this.handleChange('login')}
                    style={styles.formTextField} placeholder="E-mail"></TextInput>
                <TextInput 
                    onChangeText={this.handleChange('senha')}
                    style={styles.formTextField} placeholder="Senha" secureTextEntry={true}></TextInput>
                <TouchableOpacity
                    onPress={this.handleUserLogin}
                    style={styles.btn}><Text style={styles.textColor}>Logar</Text></TouchableOpacity>
            </KeyboardAvoidingView>
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