import React, {Component} from 'react';
import {View, Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
//import { TouchableOpacity } from 'react-native-gesture-handler';

export class FormBuilder extends Component {
    state = {
        fields: []
    };

    setFields = () => {
        this.setState({
            fields: this.props.fields,
            states: {}
        });
    }

    componentDidMount() {
        this.setFields();
    }

    handleChange = fieldName => {
        return novoValor => {
            const fieldsAtualizados = this.state.fields.map(field => {
                if(field.name === fieldName) return {...field, value: novoValor};
                return field;
            });

            this.setState({
                fields: fieldsAtualizados
            });
        };
    };

    handleFormBuilderSubmit = () => { 
        console.warn(this.getAllValues());
    };

    getAllValues = () => {
        return this.state.fields.reduce((dadoFinal, item) => {
            dadoFinal[item.name] = item.value;
            return dadoFinal;
        }, {});
    }
    
    render()
    {
        return (
            <View style={{alignSelf: "stretch"}}> 
                {this.state.fields.map(field => {
                    return ( <TextInputSpot onChangeText={this.handleChange(field.name)} field={field} key={field.id} /> );
                })}
            </View>
        );
    }
}

const TextInputSpot = ({field,  onChangeText}) => {
    return (
        <View>
            <Text>{field.label}</Text>
            <TextInput onChangeText={onChangeText} style={textInputSpotStyle.textInput} value={field.value}></TextInput>
        </View>
    );
}

const textInputSpotStyle = StyleSheet.create({
    textInput: {
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: "#666",
        alignSelf: "stretch",
        marginBottom: 15
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
    /* container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingLeft: 50,
        paddingRight: 50
    }, */
    formTextField: {
        height: 40,
        borderBottomWidth: 2,
        borderBottomColor: "#666",
        alignSelf: "stretch",
        marginBottom: 15
    }
});