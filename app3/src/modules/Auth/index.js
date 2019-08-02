import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {TokenManager} from "../infra/TokenManager";

export class AuthScreen extends React.Component {
    state = {
      ready: false
    }
    componentDidMount() {
      setTimeout(async () => {
        /* const hasUserToken = false;
        this.setState({
          ready:true
        }, () => {
          this.props.navigation.navigate(hasUserToken ? "Logado" : "Deslogado");
        }); */

        const hasUserToken = await TokenManager.hasToken();
        const profile = await TokenManager.getProfile();
        this.setState({ready:true}, () => {
          if(hasUserToken) {
            if(profile == 'odontologo'){
              this.props.navigation.navigate("Logado");
            }else {
              this.props.navigation.navigate("LogadoAuxiliar");
            }
            
          }else {
            this.props.navigation.navigate("Deslogado");
          }
            
        })
      }, 500)
    }
  
    render(){
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Verificando login...</Text>
        </View>
      );
    }
  }