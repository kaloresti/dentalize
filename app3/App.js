import React, {Component} from 'react';
import { StyleSheet, RefreshControl, Alert,Dimensions, Text, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
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
import CadConvite from './CadConvite';

import { Ionicons } from '@expo/vector-icons';
//import {Calendar, CalendarList} from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import {CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const host = "http://192.168.0.20:81/api/";


class CadInvitesAuxiliar extends Component {
  static navigationOptions = {
    title: "Invites", 
    header: null
  };
  state = {
    errors: [],
    modalVisible: false,
    activity: false,
    invitesDoctors: [],
    refreshing: false,

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
                
                this.props.navigation.navigate("Consultorios", this.componentDidMount());
            }
        })
        .catch((error) => {
            this.setState({activity: false});
            console.error(error);
        });
    }

    async acceptInvite(idInvite, type)
    {
        //console.log("Status: "+idStatus);
        var token = (await TokenManager.getToken());
        this.setState({activity: true});
        fetch(host + "accept_helpers_invite", {
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
                
                this.props.navigation.navigate("Consultorios", this.componentDidMount());
            }
        })
        .catch((error) => {
            this.setState({activity: false});
            console.error(error);
        });
    }
    async handleInvites()
        {
          console.log("renderizando invites");
            var token = (await TokenManager.getToken());
           
            fetch(host + "list_invites_helpers_for_me", {
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
                        //invites : responseJson.data.helpers,
                        invitesDoctors: responseJson.data
                    });
                    
                }
            })
            .catch((error) => {
                
                console.error(error);
            });
        }
  async componentDidMount(){
    var token = (await TokenManager.getToken());
    this.setState({activity: true});
    await this.handleInvites();
    this.setState({activity: false});
  }
  async logOff(){
    await TokenManager.setToken('');
    this.props.navigation.navigate("Auth");
  }
  _onRefresh = () => {
    this.setState({refreshing: true});
    this.handleInvites();
    this.setState({refreshing: false});
    /* fetchData().then(() => {
      this.setState({refreshing: false});
    }); */
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
          
              <KeyboardAvoidingView behavior="padding" enabled style={styles.containerForm}>
                <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                  />
                }>
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
                                            { invite.status == 'pendente' ? <Ionicons name="ios-notifications" size={50} color={"#FFD600"}  /> : <Ionicons name="md-briefcase" size={50} color={"#FFD600"} />}
                                            </Text>
                                            <Text style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            color: 'white',
                                            fontSize:14,
                                            fontWeight: 'bold' 
                                            }}><Ionicons name="md-map" size={12} color={"#5199FF"} /> {invite.officer} </Text> 
                                         
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}>{invite.doctor}</Text> 
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}><Ionicons name="ios-barcode" size={12} color={"#5199FF"} />  {'CRO: '+invite.cro+' - '+invite.cro_uf} </Text>
                                            { invite.status == 'pendente' ? <Text style={[styles.statusPendente, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}               
                                            { invite.status == 'confirmado' ? <Text style={[styles.statusAceito, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                            { invite.status == 'cancelado' ? <Text style={[styles.statusCancelado, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                            { invite.status == 'rejeitado' ? <Text style={[styles.statusRejeitado, {marginTop:10, alignSelf:'center'}]}> {invite.status} </Text> : null}
                                              
                                            <View 
                                              key={invite.id} 
                                              style={{
                                                backgroundColor: "#460000",
                                                borderRadius: 10,
                                                //padding:5,
                                                marginTop:10,
                                                alignSelf: "center",
                                                alignItems: "center",
                                                flex: 1,
                                                flexDirection: 'row',
                                                justifyContent: 'center',
                                              }}> 
                                              {invite.status == 'confirmado' ?  <TouchableHighlight
                                              style={[styles.btnOptionsCalendar, {marginLeft:10}]}
                                              onPress={() => {
                                                this.setModalNewVisible(true);
                                              }}>
                                                <View>
                                                  <Ionicons name="md-calendar" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            { invite.status == 'pendente' ? <TouchableHighlight
                                                style={[styles.btnOptionsSuccess, {marginLeft:10}]}
                                                onPress={() => {
                                                this.acceptInvite(invite.id, 'auxiliar');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-checkmark-circle-outline" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            { (invite.status == 'confirmado' || invite.status == 'pendente') ? <TouchableHighlight
                                                style={[styles.btnOptionsDelete, {marginLeft:10}]}
                                                onPress={() => {
                                                this.cancelarInvite(invite.id, 'auxiliar');
                                                }}>
                                                <View>
                                                    <Ionicons name="md-trash" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>: null}
                                            
                                             </View>
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


class AgendaAuxiliar extends Component {
  static navigationOptions = {
    title: "Agenda Auxiliar", 
    header: null
  };
  async logOff(){
    await TokenManager.setToken('');
    this.props.navigation.navigate("Auth");
  }
  render(){
    return (
      <View style={styles.container}>
        <Text>AGENDA AUXILIAR</Text> 
        <TouchableOpacity
            onPress={()=> this.logOff()}
            style={styles.btnCancel}><Text style={styles.textColor}>Sair</Text></TouchableOpacity>
      </View>
    );
  }
}

class Broadcast extends Component {
  static navigationOptions = {
    title: "", 
    header: null
  };
  render(){
    return (
      <View style={styles.container}>
        <Text>BROADCAST</Text> 
      </View>
    );
  }
}

class Agenda extends Component {
  
  static navigationOptions = {
    title: "",
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      selectedEndDate: null,
    };
    this.onDateChange = this.onDateChange.bind(this);
  }

  onDateChange(date, type) {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }
  async logOff(){
    await TokenManager.setToken('');
    this.props.navigation.navigate("Auth");
  }
  render(){
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date(2017, 12, 30); // Today
    const maxDate = new Date(2019, 12, 31);
    const startDate  =  selectedStartDate ? selectedStartDate.toString() : '';
    const endDate = selectedEndDate ? selectedEndDate.toString() : '';


    return (
      <View style={styles.containerAgenda}>
        <View
          style={{backgroundColor: '#E5F0FF', borderRadius: 10}}>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            maxDate={maxDate}
            weekdays={['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab', 'Dom']}
            months={['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']}
            previousTitle="Anterior"
            nextTitle="Próximo"
            todayBackgroundColor="#01142F"
            selectedDayColor="#1771F1"
            selectedDayTextColor="#FFFFFF"
            scaleFactor={375}
            onDateChange={this.onDateChange}
          />
        </View>
        <View>
          <Text>SELECTED START DATE:{ startDate }</Text>
          <Text>SELECTED END DATE:{ endDate }</Text>
        </View>
        <TouchableOpacity
                  onPress={()=> this.logOff()}
                  style={styles.btnCancel}><Text style={styles.textColor}>Sair</Text></TouchableOpacity>
      </View>
    );
  }
}

class Init extends Component {
  static navigationOptions = {
    header: null,
  }

  render() {
    return (
        <View style={styles.container}>
        <Image style={styles.appImage} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} />
        <Text style={styles.appName}>DENTALIZE</Text>
        <View style={styles.container}>
          <View style={{padding:10}}>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("PerfilScreen")}
              style={{alignItems: 'center', width: 200,
              justifyContent: 'center', backgroundColor: '#0043A4', borderRadius: 10 }}                
                      title="botão">
                      <Text style={{padding:15, color:"white"}}>Quero me cadastrar</Text>
            </TouchableOpacity>
          </View>
          <View style={{padding:10}}>
            <TouchableOpacity
               onPress={() => this.props.navigation.navigate("LoginScreen")}
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

class Perfil extends Component {
  static navigationOptions = {
    title: "Perfil",
    header: null
  };

  render(){
    return (
      <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
        <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} />
              <Text style={styles.appName}>Perfil</Text>
        <Text>Escolha um perfil para continuar</Text>
        <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("CadDentistaStack")}
                  style={styles.btnPerfil}><Text style={styles.textColor}>Odontólogo</Text></TouchableOpacity>
        <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("CadAuxiliarStack")}
                  style={styles.btnPerfil}><Text style={styles.textColor}>Auxiliar</Text></TouchableOpacity>
       {/*  <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("CadPacienteStack")}
                  style={styles.btnPerfil}><Text style={styles.textColor}>Paciente</Text></TouchableOpacity> */}
      </KeyboardAvoidingView>
    ); 
  }
}

class LoginScreen extends Component {
  static navigationOptions = {
      title: "Login",
      header: null
  };
  
  state = {
    email: '',
    password: '',
    errors: [],
    modalVisible: false,
    activity: false
    
  }
 
  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  componentDidMount(){
  }

  handleChange = nomeDoCampo => {
      return valorDoCampo => {
          this.setState({[nomeDoCampo] : valorDoCampo})
      };
  }

  handleUserLogin = () => {
    this.setState({activity: true});
    fetch(host + "login", {
        method: "POST",  
        body: JSON.stringify({
          email: this.state.email,
          password:this.state.password
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
            await TokenManager.setProfile(responseJson.data.profile_type);
            await TokenManager.setName(responseJson.data.name);
           /*  console.warn(await TokenManager.getToken()); 
            console.warn(await TokenManager.getName()); 
            console.warn(await TokenManager.getProfile());  */ 
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
          <KeyboardAvoidingView behavior="padding" enabled style={styles.container}>
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
              <Text style={styles.appName}>Login</Text>
              <TextInput 
                  onChangeText={this.handleChange('email')}
                  style={styles.formTextField} placeholder="E-mail"></TextInput>
              <TextInput 
                  onChangeText={this.handleChange('password')}
                  style={styles.formTextField} placeholder="Senha" secureTextEntry={true}></TextInput>
              <TouchableOpacity
                  onPress={this.handleUserLogin}
                  style={styles.btn}><Text style={styles.textColor}>Logar</Text></TouchableOpacity>
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
  btnOptionsEdit: {
    backgroundColor: "#7EB3FF",
    borderRadius: 40,
    width:50,
    padding: 10,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  btnOptionsDelete: {
    backgroundColor: "#B40A1B",
    borderRadius: 40,
    padding: 10,
    width:50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
  },
  btnOptionsCalendar: {
    backgroundColor: "#FF6B00",
    borderRadius: 40,
    padding: 10,
    width:50,
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center"
  },
  btnOptionsSuccess:{
    backgroundColor: "#00CF91",
    borderRadius: 40,
    padding: 10,
    width:50,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center"
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

// -----------

const AgendaStack = createStackNavigator({
  AgendaStackHome: {
    screen: Agenda
  }
});

const BroadcastStack = createStackNavigator({
  BriadcastStackHome: {
    screen: Broadcast
  }
});

const PacienteStack = createStackNavigator({
  PacienteStackHome: {
    screen: CadPaciente
  }
});

const ConsultorioStack = createStackNavigator({
  ConsultorioStackHome: {
    screen: CadConsultorio
  }
});

const AuxiliarStack = createStackNavigator({
  AuxiliarStackHome: {
    screen: CadConvite
  }
});

const AreaLogado = createBottomTabNavigator({
  Agenda: {
    screen: AgendaStack,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-calendar" size={32} color={tintColor} />
      )
    })  
  },
  Broadcast: {
    screen: BroadcastStack ,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-globe" size={32} color={tintColor} />
      )
    }) 
  },
  Consultorios: {
    screen: ConsultorioStack,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-briefcase" size={32} color={tintColor} />
      )
    }) 
  },
  Pacientes: {
    screen: PacienteStack,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-people" size={32} color={tintColor} />
      )
    }) 
  },
  Auxiliares: {
    screen: AuxiliarStack,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-git-network" size={32} color={tintColor} />
      )
    }) 
  }
}, {
  tabBarOptions: {
      showLabel: true, // hide labels
      activeTintColor: '#E5F0FF', // active icon color
      inactiveTintColor: '#0043A4',  // inactive icon color
      style: {
          backgroundColor: '#5199FF' // TabBar background
      }
    }
  }); 

// ---------

const AgendaAuxiliarStack = createStackNavigator({
  AgendaAuxiliarStackHome: {
    screen: AgendaAuxiliar
  }
});

const InvitesAuxiliarStack = createStackNavigator({
  InvitesAuxiliarStackHome: {
    screen: CadInvitesAuxiliar
  } 
});

const AreaLogadoAuxiliar = createBottomTabNavigator({
  Agenda: {
    screen: AgendaAuxiliarStack,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-calendar" size={32} color={tintColor} />
      )
    })  
  },
  Consultorios: {
    screen: InvitesAuxiliarStack,
    navigationOptions: () => ({
      tabBarIcon: ({tintColor}) => (
        <Ionicons name="md-briefcase" size={32} color={tintColor} />
      )
    }) 
  }
}, {
  tabBarOptions: {
      showLabel: true, // hide labels
      activeTintColor: '#E5F0FF', // active icon color
      inactiveTintColor: '#0043A4',  // inactive icon color
      style: {
          backgroundColor: '#5199FF' // TabBar background
      }
    }
  }); 

const AreaDeslogado = createStackNavigator({
  InitStackHome: {
    screen: Init
  },
  CadDentistaStack: {
    screen: CadDentista
  },
  CadAuxiliarStack: {
    screen: CadAuxiliar
  },
  LoginScreen:
  {
    screen: LoginScreen
  },
  PerfilScreen:
  {
    screen: Perfil
  }
});

const SistemaDeNavegacao = createSwitchNavigator({
  Auth: AuthScreen,
  Deslogado: AreaDeslogado,
  Logado: AreaLogado,
  LogadoAuxiliar: AreaLogadoAuxiliar
}, {initialRouteName: "Auth"}); 

export default createAppContainer(SistemaDeNavegacao);


