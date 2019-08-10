import React, {Component} from 'react';
import { StyleSheet, Alert, Text, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import {creatStackNavigator, createSwitchNavigator, createAppContainer, createStackNavigator, createBottomTabNavigator, withOrientation} from 'react-navigation';
import { AuthScreen } from './src/modules/Auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import DentalizeService from './src/modules/services/DentalizeService';
import {TokenManager} from './src/modules/infra/TokenManager';
import { TextInputMask } from 'react-native-masked-text';

import { Ionicons } from '@expo/vector-icons';
//import {Calendar, CalendarList} from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import {CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const host = "http://192.168.0.20:81/api/";

export default class CadAuxiliar extends Component {
    static navigationOptions = {
      title: "Auxiliares", 
      header: null
    };
    state = {
        errors: [],
        modalVisible: false,
        activity: false,

        name: "",
        rg: "",
        cpf: "",
        burned_at: "",
        postal_code: '',
        city: '',
        district: '',
        address: '',
        complementation: '',
        number: '',
        celphone: '',
        phone: '',
        email: '',
        password: "",
        c_password: ""
    }

    showDateTimePicker = (field) => {
        //console.log(field);
        this.setState({ [field]: true , timeInput: field});
    };

    hideDateTimePicker = (field) => {
    //console.log(field);
        this.setState({ [field]: false , timeInput: field});
    };

    handleDatePicked = (date) => {
        //console.log(date);
        this.setState({  
            [date.field]: date.date.toString()
        }); 
        this.hideDateTimePicker(this.state.timeInput);
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }
    
    setModalNewVisible(visible) {
        this.setState({modalNewVisible: visible});
        
    }

    handleChange = nomeDoCampo => {
        return valorDoCampo => {
            this.setState({[nomeDoCampo] : valorDoCampo})
        };
    }

    handleAuxiliarCreate = () => {
        this.setState({activity: true});
        fetch(host + "register_helper", {
            method: "POST",  
              body: JSON.stringify({
                name: this.state.name,
                cpf: this.state.cpf,
                rg: this.state.rg,
                burned_at: this.state.burned_at,
                uf: this.state.uf,
                postal_code: this.state.postal_code,
                city: this.state.city,
                district: this.state.district,
                address: this.state.address,
                complementation: this.state.complementation,
                number: this.state.number,
                celphone: this.state.celphone,
                phone: this.state.phone,
                email: this.state.email,
                password:this.state.password,
                c_password:this.state.c_password
            }),
            headers: {  
              'Accept' : 'application/json',
              'Content-Type': 'application/json; charset=utf-8'
              
            } 
        }).then((response) => response.json())
            .then(async responseJson => {
                this.setState({activity: false});
            if(responseJson.error){
                this.setState({
                modalVisible: true,
                errors: responseJson.error
                });
            } else {
                await TokenManager.setToken(responseJson.data.token);
                //await TokenManager.setDoctorId(responseJson.data.id);
                await TokenManager.setProfile(responseJson.data.profile_type);
                await TokenManager.setName(responseJson.data.name);
                console.warn(await TokenManager.getToken()); 
                console.warn(await TokenManager.getName()); 
                console.warn(await TokenManager.getProfile());
                //console.warn(await TokenManager.getDoctorId());    
                this.props.navigation.navigate("Auth");
            }
        })
        .catch((error) => {
            this.setState({activity: false});
            console.error(error);
        });
    };

    render(){
        if(this.state.activity === true)
        {
          return(
              <View style={styles.containerLoading}>
                  <CirclesLoader color={'#01142F'}/>
                  <TextLoader text="Processando ..." />
              </View>
          ); 
        } else {
      return (
        <ScrollView>
                <KeyboardAvoidingView behavior="padding" enabled  style={styles.container}>
                  <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}>
                    
                      <View style={{
                          flex: 1,
                          backgroundColor: '#01142F',
                          alignItems: 'center',
                          justifyContent: 'center',
                          paddingTop:50,
                          paddingLeft: 50,
                          paddingRight: 50
                        }}>
                          <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} />
                          <Text style={{
                             marginTop: 15,
                             color: '#FFC11E',
                             fontWeight: 'bold',
                             fontSize: 25,
                             textShadowColor: 'darkblue',
                             letterSpacing: 5
                          }}>Atenção!</Text>
                          
                          {Object.entries(this.state.errors).map(([key,v])=>{
                              return <Text key={key} style={{color: "#F1F2F2", fontWeight: 'bold'}}>{v}</Text>
                          })}
                       
                          <TouchableHighlight
                            style={styles.btn}
                            onPress={() => {
                              this.setModalVisible(!this.state.modalVisible);
                            }}>
                              <Text>Tentar Novamente</Text>
                          </TouchableHighlight>
                      </View>
                   
                  </Modal>
        
                  <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} />
                  
                  <Text style={styles.appName}>Auxiliar</Text>
                  <Text>Todos os campos são obrigatórios</Text>
          
                  {/* <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex:.5}}>
                      <TextInput 
                        onChangeText={this.handleChange('cro')}
                        style={styles.formTextField} placeholder="CRO"  maxLength = {10}></TextInput>
                    </View>
                    <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40,
                        borderBottomWidth: 2, 
                        borderBottomColor: "#fff",
                        color: "#fff",
                        marginBottom: 15}}>
                        <Picker style={{color:"#fff"}}
                          selectedValue={this.state.cro_uf}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({cro_uf: itemValue})
                          }
                        >
                        {this.state.ufs.map((uf, i) => { 
                          return <Picker.Item key={i} value={uf.sigla} label={uf.sigla +' - '+ uf.nome } />
                        })}
                      </Picker>
                    </View>
                  </View>  */}
                  
                  <TextInput 
                      maxLength = {100}
                      onChangeText={this.handleChange('name')}
                      style={styles.formTextField} placeholder="Nome completo"></TextInput>
                  
                  <TextInputMask
                      value={this.state.cpf}
                      type={'cpf'}
                      options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                      }}
                      onChangeText={text => {
                        this.setState({
                          cpf: text
                        })
                      }}
                      //onChangeText={this.handleChange('cpf')}
                      style={styles.formTextField} placeholder="CPF" />
                        
                        <TextInput 
                            onChangeText={this.handleChange('rg')}
                            value={this.state.rg}
                            style={styles.formTextField} placeholder="RG"  maxLength = {150}></TextInput>

                    <Text style={[styles.textDivisor, {color: 'yellow'}]}>Data de nascimento</Text>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <View style={{flex:1}}>
                            <Button title={this.state.burned_at} onPress={()=>this.showDateTimePicker('burnedAtVisible')} />
                            <DateTimePicker
                            mode={'date'}
                            isVisible={this.state.burnedAtVisible}
                            onConfirm={(date)=>this.handleDatePicked({date:date, field: 'burned_at'})}
                            onCancel={() => this.hideDateTimePicker('burnedAtVisible')} 
                            />
                        </View>
                    </View> 

                    <TextInputMask
                        value={this.state.celphone}
                        type={'cel-phone'}
                        options={{
                        maskType: 'BRL',
                        withDDD: true,
                        dddMask: '(99) '
                        }}
                        onChangeText={text => {
                        this.setState({
                            celphone: text
                        })
                        }}
                        //onChangeText={this.handleChange('cpf')}
                        style={styles.formTextField} placeholder="celular" />
                    <TextInputMask
                        value={this.state.phone}
                        type={'custom'}
                        options={{
                        /**
                        * mask: (String | required | default '')
                        * the mask pattern
                        * 9 - accept digit.
                        * A - accept alpha.
                        * S - accept alphanumeric.
                        * * - accept all, EXCEPT white space.
                        */
                        mask: '(99) 9999-9999'
                        }}
                        onChangeText={text => {
                        this.setState({
                            phone: text
                        })
                        }}
                        //onChangeText={this.handleChange('cpf')}
                        style={styles.formTextField} placeholder="telefone comercial" />
                         
                         <TextInputMask
                            value={this.state.postal_code}
                            type={'zip-code'}
                            includeRawValueInChangeText={true}
                            onChangeText={(maskedText, rawText) => {
                            this.setState({
                                postal_code: rawText
                            })
                            
                            if(maskedText.length == 9 ) 
                            {
                                this.setState({
                                    activity: true,
                                    postal_code: rawText
                                });
                                //console.warn(this.state.postal_code);
                                fetch("https://viacep.com.br/ws/"+rawText+"/json/", { 
                                    method: "GET",  
                                    headers: {  
                                    'Accept' : 'application/json',
                                    'Content-Type': 'application/json; charset=utf-8' 
                                    } 
                                }).then((response) => response.json())
                                    .then(async responseJson => {
                                        this.setState({activity: false});
                                    if(responseJson.erro){
                                        this.setState({
                                        modalVisible: true,
                                        errors: ["Desculpe, não conseguimos encontrar este CEP"],
                                        numberVisivle: false,
                                        complementationVisible: false,
                                        postal_code: "",
                                        district: "",
                                        city: "",
                                        address: "",
                                        uf: "",
                                        });
                                    } else {
                                        this.setState({
                                        postal_code: responseJson.cep,
                                        district: responseJson.bairro,
                                        city: responseJson.localidade,
                                        address: responseJson.logradouro,
                                        uf: responseJson.uf,
                                        numberVisivle: true,
                                        complementationVisible: true,
                                        });
                                    }
                                })
                                .catch((error) => {
                                    this.setState({activity: false});
                                    console.error(error);
                                }); // fim do fetch
                            }
                            }}
                            //onChangeText={this.handleChange('cpf')}
                            style={styles.formTextField} placeholder="CEP" />
                        <Text style={[styles.textDivisor, {color: 'yellow'}]}>{this.state.postal_code} - {this.state.uf} - {this.state.city}</Text>
                        <Text style={[styles.textDivisor, {color: 'yellow'}]}>{this.state.address}</Text>
                        <TextInput 
                        value={this.state.number}
                        editable={this.state.numberVisivle}
                        onChangeText={this.handleChange('number')}
                        style={styles.formTextField} placeholder="Numero"  maxLength = {10}></TextInput>
                        
                    <TextInput 
                        value={this.state.complementation}
                        editable={this.state.complementationVisible}
                        onChangeText={this.handleChange('complementation')}
                        style={styles.formTextField} placeholder="Complemento"  maxLength = {20}></TextInput>
                  <TextInput 
                      maxLength = {150}
                      onChangeText={this.handleChange('email')}
                      style={styles.formTextField} placeholder="Digite o seu melhor e-mail"></TextInput>
                  <TextInput
                      maxLength = {13}
                      onChangeText={this.handleChange('password')}
                      style={styles.formTextField} placeholder="Escolha uma senha"  secureTextEntry={true}></TextInput> 
                  <TextInput 
                      maxLength = {13}
                      onChangeText={this.handleChange('c_password')}
                      style={styles.formTextField} placeholder="Confirme a sua senha"  secureTextEntry={true}></TextInput>
          
                  <TouchableOpacity
                    onPress={this.handleAuxiliarCreate}
                    style={{alignItems: 'center', width:200,
                  justifyContent: 'center', backgroundColor: '#052555', borderRadius: 10 }}                
                  title="botão">
                    <Text style={{padding:15, color:"white"}}>Cadastrar</Text>
                  </TouchableOpacity>
                </KeyboardAvoidingView>
                </ScrollView>
        
      );
    }
    }
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5199FF',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 20,
      paddingRight: 20
    },
    containerAgenda: {
      flex: 1,
      backgroundColor: '#5199FF',
      alignItems: 'center',
      //justifyContent: 'center',
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 50
    },
    containerForm: {
      flex: 1,
      backgroundColor: '#5199FF',
      alignItems: 'center',
      //justifyContent: 'center',
      paddingLeft: 20,
      paddingRight: 20,
      paddingTop: 50
    },
    containerLoading: {
      flex: 1,
      backgroundColor: '#5199FF',
      alignItems: 'center',
      justifyContent: 'center',
      paddingLeft: 50,
      paddingRight: 50
    },
    appImage: {
      padding: 5, width:280, height:280,  marginTop: 35, 
    },
    appImageMd: {
      padding: 5, width:100, height:100,  marginTop: 35, 
    },
    appName: {
      marginTop: 15,
      color: 'white',
      fontWeight: 'bold',
      fontSize: 25,
      textShadowColor: 'darkblue',
      letterSpacing: 5
    },
    btn: {
      backgroundColor: "#3095f3",
      borderRadius: 30,
      padding: 10,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center"
    },
    btnOptionsEdit: {
      backgroundColor: "#7EB3FF",
      borderRadius: 40,
      width:50,
      padding: 10,
      //alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center"
    },
    btnOptionsDelete: {
      backgroundColor: "#B40A1B",
      borderRadius: 40,
      padding: 10,
      width:50,
      //alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center"
    },
    btnOptionsCalendar: {
      backgroundColor: "#FF6B00",
      borderRadius: 40,
      padding: 10,
      width:50,
      //alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center"
    },
    btnEspecialidades: {
      backgroundColor: "#FF008B",
      //textColor: "#FFFFFF",
      borderRadius: 10,
      padding: 10,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10
    },
    btnPlanos: {
      backgroundColor: "#FE634E",
      //textColor: "#FFFFFF",
      borderRadius: 10,
      padding: 10,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10
    },
    btnCancel: {
      backgroundColor: "#E20338",
      borderRadius: 10,
      padding: 10,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10
    },
    btnNew: {
      //backgroundColor: "#E20338",
      borderRadius: 55,
      padding: 5,
      width: 50,
      //alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center",
      //marginTop: 10
    },
    btnSave: {
      backgroundColor: "#45D09E",
      borderRadius: 10,
      padding: 10,
      height:60,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 40
    },
    btnPerfil: {
      backgroundColor: "#3095f3",
      borderRadius: 10,
      padding: 10,
      marginTop:15,
      alignSelf: "stretch",
      justifyContent: "center",
      alignItems: "center"
    },
    textColor: {
        color: "#fff",
        fontSize: 15
    },
    textDivisor: {
      color: "#fff",
      fontSize: 11
    },
    formTextField: {
        height: 40,
        borderBottomWidth: 2,
        fontWeight: 'bold',
        borderBottomColor: "#fff",
        color: "#fff",
        alignSelf: "stretch",
        marginBottom: 15
    },
    selectBox:{
      height: 40,
      alignSelf: "stretch",
    },
    containerCrud: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingLeft: 50,
      paddingRight: 50
    },
  });