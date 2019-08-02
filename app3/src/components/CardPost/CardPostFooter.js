import React from 'react';
import { Text, View, Button } from 'react-native';
import { TouchableOpacity, TouchableHighlight, TouchableNativeFeedback } from 'react-native-gesture-handler';

export class CardPostFooter extends React.Component {

    state = {
        likeada: false, 
        likers: []
    }
    render(){
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 5 }}>
                {/* <TouchableOpacity 
                  onPress={() => {
                    this.setState({
                        //likers: [{loginUsuario: "luan"}, ...this.state.likers],
                        likeada: !this.state.likeada
                    });
                  }}   
                  style={{backgroundColor: this.state.likeada ? "grey" : "#0043A4", borderRadius:50}} title="botão">
                    <Text style={{padding:5, color:"white"}}>Like</Text>
                </TouchableOpacity> */}

                {/* <Text style={{padding:5, color: "#0043A4"}}>{this.state.likers.length}</Text> */}
                
                <Text style={{padding:5}}>{this.props.texto}</Text>
                <Text style={{padding:5}}>{this.props.data}</Text> 
            </View>           
        );
    }
}