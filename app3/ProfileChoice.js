import React, {Component} from 'react';
import { StyleSheet, Text, View, Image, Button,TouchableNativeFeedback,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback } from 'react-native';

class ProfileChoice extends Component {
    render(){
        return (
            <View style={styles.container}>
              <Image style={styles.appImage} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} />
              <Text style={styles.appName}>DENTALIZE</Text>
              <View style={styles.container}>
                <View style={{padding:10}}>
                  <TouchableOpacity  
                  style={{alignItems: 'center', width: 200,
                  justifyContent: 'center', backgroundColor: '#0043A4', borderRadius: 10 }}                
                          title="botão">
                            <Text style={{padding:15, color:"white"}}>Quero me cadastrar</Text>
                  </TouchableOpacity>
                  
                </View>
                <View style={{padding:10}}>
                  <TouchableOpacity  
                    style={{alignItems: 'center', width:200,
                    justifyContent: 'center', backgroundColor: '#052555', borderRadius: 10 }}                
                            title="botão">
                              <Text style={{padding:15, color:"white"}}>Login</Text>
                  </TouchableOpacity>
                
                </View>
                <View style={{padding:10}}>
                  <TouchableOpacity  
                    style={{alignItems: 'center', width:200,
                    justifyContent: 'center', backgroundColor: '#052555', borderRadius: 10 }}                
                            title="botão">
                              <Text style={{padding:15, color:"white"}}>Login</Text>
                  </TouchableOpacity>
               
                </View>
                <View style={{padding:10}}>
                  <TouchableOpacity  
                    style={{alignItems: 'center', width:200,
                    justifyContent: 'center', backgroundColor: '#052555', borderRadius: 10 }}                
                            title="botão">
                              <Text style={{padding:15, color:"white"}}>Login</Text>
                  </TouchableOpacity>
               
                </View>
        
                
              </View>
            </View>
          );
    }
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5199FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appImage: {
    padding: 5, width:50, height:50,  marginTop: 20, 
  },
  appName: {
    marginTop: 15,
    color: 'white',
    fontWeight: 'bold',
    fontSize: 25,
    textShadowColor: 'darkblue',
    letterSpacing: 5
  }
});
