import React, {Component} from 'react';
import { StyleSheet, Alert, Dimensions, Text, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import {creatStackNavigator, createSwitchNavigator, createAppContainer, createStackNavigator, createBottomTabNavigator, withOrientation} from 'react-navigation';
import { AuthScreen } from './src/modules/Auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import DentalizeService from './src/modules/services/DentalizeService';
import {TokenManager} from './src/modules/infra/TokenManager';
import { TextInputMask } from 'react-native-masked-text';

import CadDentista from './CadDentista';
import CadConsultorio from './CadConsultorio';
import CadPaciente from './CadPaciente';
import CadAuxiliar from './CadAuxiliar';

import { Ionicons } from '@expo/vector-icons';
//import {Calendar, CalendarList} from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import {CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const host = "http://192.168.0.20:81/api/";

export default class CadConvite extends Component {
        constructor(props) {
            super(props);
            
        }

        static navigationOptions = {
            title: "Auxiliares", 
            header: null
        };
        state = {
            errors: [],
            modalVisible: false,
            modalNewVisible: false,
            activity: false,
            officers: [],
            officers_id: 0,
            invites: [],
            
            typeHelper: 'odontologo',
            cpf: '',
            invitesDoctors: []
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
        async handleOfficers()
        {
            var token = (await TokenManager.getToken());
            fetch(host + "list_officers_for_doctors", { 
                method: "GET",  
                headers: {  
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json; charset=utf-8',
                    'Authorization': 'Bearer '+token, 
                } 
            }).then((response) => response.json())
                .then(async responseJson => {
                   
                if(responseJson.erro){
                    this.setState({
                        modalVisible: true,
                        errors: ["Erro ao carregar planos"],
                        modalNewVisible: false
                    });
                } else {
                    this.setState({
                        officers: responseJson.data,
                        searchOfficers: responseJson.data,
                        modalNewVisible: false
                    });
                }
            })
            .catch((error) => {
                this.setState({activity: false});
                console.error(error);
            }); // fim do fetch
        }
        async handleInvites()
        {
            var token = (await TokenManager.getToken());
           
            fetch(host + "list_invites_by_me", {
                method: "POST",  
                body: JSON.stringify({}),
                headers: {  
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json; charset=utf-8' ,
                    'Authorization': 'Bearer '+token, 
                } 
            }).then((response) => response.json())
                .then(async responseJson => {
                    
                if(responseJson.error){
                    this.setState({
                        modalVisible: true,
                        errors: responseJson.error
                    });
                } else {
                    console.log(responseJson.data)
                    this.setState({
                        invites : responseJson.data.helpers,
                        invitesDoctors: responseJson.data.doctors
                    });
                    
                }
            })
            .catch((error) => {
                
                console.error(error);
            });
        }
 
        async handleCreateInvite()
        {
            var token = (await TokenManager.getToken());
            this.setState({activity: true});
            fetch(host + "create_invite", {
                method: "POST",  
                body: JSON.stringify({
                    typeHelper: this.state.typeHelper,
                    cpf: this.state.cpf,
                    officers_id: this.state.officers_id
                }),
                headers: {  
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json; charset=utf-8' ,
                    'Authorization': 'Bearer '+token, 
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
                    
                    this.props.navigation.navigate("Auxiliares", this.componentDidMount());
                }
            })
            .catch((error) => {
                this.setState({activity: false});
                console.error(error);
            });
        }

        async componentDidMount()
        {
            this.setState({activity: true});

            await this.handleOfficers();
            await this.handleInvites();

            this.setState({activity: false});
        }

        async cancelarInvite(idInvite, type)
        {
            //console.log("Status: "+idStatus);
            var token = (await TokenManager.getToken());
            this.setState({activity: true});
            fetch(host + "cancel_invite", {
                method: "POST",  
                body: JSON.stringify({
                    idInvite: idInvite,
                    typeHelper: type
                }),
                headers: {  
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json; charset=utf-8' ,
                    'Authorization': 'Bearer '+token, 
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
                    
                    this.props.navigation.navigate("Auxiliares", this.componentDidMount());
                }
            })
            .catch((error) => {
                this.setState({activity: false});
                console.error(error);
            });
        }

        async reenviarInvite(idInvite, type)
        {
            //console.log("Status: "+idStatus);
            var token = (await TokenManager.getToken());
            this.setState({activity: true});
            fetch(host + "resend_invite", {
                method: "POST",  
                body: JSON.stringify({
                    idInvite: idInvite,
                    typeHelper: type
                }),
                headers: {  
                    'Accept' : 'application/json',
                    'Content-Type': 'application/json; charset=utf-8' ,
                    'Authorization': 'Bearer '+token, 
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
                    
                    this.props.navigation.navigate("Auxiliares", this.componentDidMount());
                }
            })
            .catch((error) => {
                this.setState({activity: false});
                console.error(error);
            });
        }

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
                    
                    <KeyboardAvoidingView behavior="padding" enabled  style={styles.containerForm}>
                        <ScrollView>
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
            
                    <Modal
                            animationType="slide"
                            transparent={false}
                            visible={this.state.modalNewVisible}>
                                <ScrollView>
                                    <View style={{
                                        flex: 1,
                                            backgroundColor: '#01142F',
                                            //alignItems: 'center',
                                            justifyContent: 'center', 
                                            paddingTop:20,
                                            paddingLeft: 50,
                                            paddingRight: 50,
                                            height:Dimensions.get('window').height
                                        }}> 
                                        {/* <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} /> */}
                                                <Text style={[{color: 'yellow'}]}>Quem você gostaria de convidar?</Text>
                                                <View style={{flex:.1, alignSelf: "stretch", justifyContent:'center',
                                                        borderBottomWidth: 2, 
                                                        borderBottomColor: "#fff",
                                                        color: "#fff",
                                                        marginBottom: 10}}>
                                                    <Picker style={{color:"#fff"}}
                                                        selectedValue={this.state.typeHelper}
                                                        onValueChange={(itemValue, itemIndex) =>
                                                            this.setState({typeHelper: itemValue}) }>
                                                                <Picker.Item key={0} value={0} label={'Selecione'} />
                                                                <Picker.Item key={1} value={'odontologo'} label={'Odontólogo'} />
                                                                <Picker.Item key={2} value={'auxiliar'} label={'Auxiliar'} />
                                                    
                                                    </Picker>
                                                </View>
                                                <Text style={[{color: 'yellow'}]}>Para qual consultório?</Text>
                                                <View style={{flex:.1, alignSelf: "stretch", justifyContent:'center', height: 40,
                                                        borderBottomWidth: 2, 
                                                        borderBottomColor: "#fff",
                                                        color: "#fff",
                                                        marginBottom: 10}}>
                                                    <Picker style={{color:"#fff"}}
                                                        selectedValue={this.state.officers_id}
                                                        onValueChange={(itemValue, itemIndex) =>
                                                            this.setState({officers_id: itemValue}) }>
                                                                <Picker.Item key={0} value={0} label={'Selecione'} />
                                                    {this.state.officers.map((office, i) => { 
                                                        return <Picker.Item key={i} value={office.id} label={office.name } />
                                                    })}
                                                    </Picker>
                                                </View>
                                                <Text style={[styles.textDivisor, {color: 'yellow'}]}>Digite o CPF do convidado</Text>
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
                                        
                                                
                                            <TouchableHighlight
                                                style={styles.btnSave}
                                                onPress={() => {
                                                    this.handleCreateInvite();
                                                }}>
                                                <Text>Enviar convite</Text>
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                style={styles.btnCancel}
                                                onPress={() => {
                                                    this.setModalNewVisible(!this.state.modalNewVisible);
                                                }}>
                                                <Text>cancelar</Text>
                                            </TouchableHighlight>
                                        </View>
                                    </ScrollView>
                            </Modal>
                            <TouchableHighlight
                                style={[styles.btnNew, {backgroundColor: "#052555"}]}
                                onPress={() => {
                                    this.setModalNewVisible(true);
                                }}>
                                    <View>
                                    <Text style={{alignSelf:"center"}}>
                                        <Ionicons name="ios-add-circle" size={40} color={"#5199FF"}  />
                                    </Text>
                                    </View>
                            </TouchableHighlight>
    
                            

                            
                            {this.state.invites.map((invite, i) => { 
                                return <View 
                                        key={invite.id}
                                        style={{
                                            backgroundColor: "#052555",
                                            borderRadius: 10,
                                            padding:5,
                                            marginTop:10,
                                            alignSelf: "center",
                                            alignItems: "stretch",
                                            flex: 1,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            width:Dimensions.get('window').width - 50,
                                        }}> 
                                        {/* <View style={{backgroundColor: 'powderblue',  alignItems: "stretch",}}> */}
                                            <Text style={{alignSelf:"center"}}>
                                            <Ionicons name="ios-contacts" size={50} color={"#5199FF"}  />
                                            </Text>
                                            <Text style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            color: 'white',
                                            fontSize:14,
                                            fontWeight: 'bold' 
                                            }}> {invite.helper}</Text> 
                                         
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}><Ionicons name="md-map" size={12} color={"#5199FF"} /> {invite.officer} </Text>

                                            { invite.status == 'pendente' ? <Text style={[styles.statusPendente, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}               
                                            { invite.status == 'confirmado' ? <Text style={[styles.statusAceito, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                            { invite.status == 'cancelado' ? <Text style={[styles.statusCancelado, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                            { invite.status == 'rejeitado' ? <Text style={[styles.statusRejeitado, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                              
                                            { invite.status == 'pendente' ? <TouchableHighlight
                                                style={[styles.btnOptionsDelete, {marginLeft:10}]}
                                                onPress={() => {
                                                this.cancelarInvite(invite.id, 'auxiliar');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-trash" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            { invite.status == 'confirmado' ? <TouchableHighlight
                                                style={[styles.btnOptionsDelete, {marginLeft:10}]}
                                                onPress={() => {
                                                this.cancelarInvite(invite.id, 'auxiliar');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-trash" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            { invite.status == 'cancelado' ?  <TouchableHighlight
                                                style={[styles.btnOptionsSuccess, {marginLeft:10}]}
                                                onPress={() => {
                                                this.reenviarInvite(invite.id, 'auxiliar');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-checkmark-circle-outline" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}  
                                           {/*  <View 
                                                style={{
                                                backgroundColor: "#052555",
                                                borderRadius: 10,
                                                padding:5,
                                                marginTop:10,
                                                alignSelf: "center",
                                                alignItems: "center",
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                }}>                                             
                                            
                                            </View> */}
                                            
                                        {/*  </View> */}
                                        </View>
                            })}


                        

                            {this.state.invitesDoctors.map((invite, i) => { 
                                return <View 
                                        key={invite.id}
                                        style={{
                                            backgroundColor: "#460000",
                                            borderRadius: 10,
                                            padding:5,
                                            marginTop:10,
                                            alignSelf: "center",
                                            alignItems: "stretch",
                                            flex: 1,
                                            flexDirection: 'column',
                                            justifyContent: 'center',
                                            width:Dimensions.get('window').width - 50,
                                        }}> 
                                        {/* <View style={{backgroundColor: 'powderblue',  alignItems: "stretch",}}> */}
                                            <Text style={{alignSelf:"center"}}>
                                            <Ionicons name="ios-contacts" size={50} color={"#5199FF"}  />
                                            </Text>
                                            <Text style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            color: 'white',
                                            fontSize:14,
                                            fontWeight: 'bold' 
                                            }}> {invite.doctor_invited}</Text> 
                                         
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}><Ionicons name="md-map" size={12} color={"#5199FF"} /> {invite.officer} </Text>
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}><Ionicons name="ios-barcode" size={12} color={"#5199FF"} />  {'CRO: '+invite.invited_cro+' - '+invite.invited_cro_uf} </Text>
                                            { invite.status == 'pendente' ? <Text style={[styles.statusPendente, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}               
                                            { invite.status == 'confirmado' ? <Text style={[styles.statusAceito, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                            { invite.status == 'cancelado' ? <Text style={[styles.statusCancelado, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                            { invite.status == 'rejeitado' ? <Text style={[styles.statusRejeitado, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                              
                                            { invite.status == 'pendente' ? <TouchableHighlight
                                                style={[styles.btnOptionsDelete, {marginLeft:10}]}
                                                onPress={() => {
                                                this.cancelarInvite(invite.id, 'odontologo');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-trash" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            { invite.status == 'confirmado' ? <TouchableHighlight
                                                style={[styles.btnOptionsDelete, {marginLeft:10}]}
                                                onPress={() => {
                                                this.cancelarInvite(invite.id, 'odontologo');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-trash" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            { invite.status == 'cancelado' ?  <TouchableHighlight
                                                style={[styles.btnOptionsSuccess, {marginLeft:10}]}
                                                onPress={() => {
                                                this.reenviarInvite(invite.id, 'odontologo');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-checkmark-circle-outline" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight> : null}  
                                           {/*  <View 
                                                style={{
                                                backgroundColor: "#052555",
                                                borderRadius: 10,
                                                padding:5,
                                                marginTop:10,
                                                alignSelf: "center",
                                                alignItems: "center",
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                                }}>                                             
                                            
                                            </View> */}
                                            
                                        {/*  </View> */}
                                        </View>
                            })}
                            </ScrollView>
                    </KeyboardAvoidingView>
                  
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
    btnOptionsSuccess:{
        backgroundColor: "#00CF91",
        borderRadius: 40,
        padding: 10,
        width:50,
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center"
    },  
    btnOptionsDelete: {
      backgroundColor: "#B40A1B",
      borderRadius: 40,
      padding: 10,
      width:50,
      alignSelf: "flex-end",
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
    statusPendente: {
        color: "#FFD600",
        fontSize: 11,
        fontWeight:"bold"
      },
      statusRejeitado: {
        color: "#F85C50",
        fontSize: 11,
        fontWeight:"bold"
      },
      statusCancelado: {
        color: "#F85C50",
        fontSize: 11,
        fontWeight:"bold"
      },
      statusAceito: {
        color: "#00DC7D",
        fontSize: 11,
        fontWeight:"bold"
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