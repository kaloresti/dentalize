import React, {Component} from 'react';
import { StyleSheet,RefreshControl, Alert, Dimensions, Text, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import {creatStackNavigator, createSwitchNavigator, createAppContainer, createStackNavigator, createBottomTabNavigator, withOrientation} from 'react-navigation';
import { AuthScreen } from './src/modules/Auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import DentalizeService from './src/modules/services/DentalizeService';
import {TokenManager} from './src/modules/infra/TokenManager';
import { TextInputMask } from 'react-native-masked-text';

import CadDentista from './CadDentista';
import CadConsultorio from './CadConsultorio';

import { Ionicons } from '@expo/vector-icons';
//import {Calendar, CalendarList} from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import {CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const host = "http://192.168.0.20:81/api/";

export default class Paciente extends Component {
    
    constructor(props) {
        super(props);
        

       /*  this.handleOfficers();
        this.handlePlans(); */
        
    }
    
    /* async componentWillMount(){
        await  this.handleOfficers();
    } */

    static navigationOptions = { 
        title: "Pacientes", 
        header: null
    };
    
    state = {
        plans: [],
        officers: [],
        searchOfficers: [],
        searchPlans: [],
        search_officers_id: 0,
        search_plans_id: 0,
        
        errors: [],
        modalVisible: false,
        modalNewVisible: false,
        activity: false,
        pacientes: [],
        burnedAtVisible: false,
        timeInput: "",
        officers_id: 0,
        plans_id: 0,
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

        refreshing: false,
    }

    onSelectedPlanosChange = (selectedPlanos) => {
        this.setState({ selectedPlanos });
    //console.log(selectedPlanos);
    };
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
    
    async handlePlans()
    {
        fetch(host + "list_plans", { 
            method: "GET",  
            headers: {  
                'Accept' : 'application/json',
                'Content-Type': 'application/json; charset=utf-8' 
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
                    plans: responseJson.data,
                    searchPlans: responseJson.data,
                    modalNewVisible: false
                });
            }
        })
        .catch((error) => {
            this.setState({activity: false});
            console.error(error);
        }); // fim do fetch
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

    async handlePatients() 
    {
        var token = (await TokenManager.getToken());
        fetch(host+"list_patients_for_doctors", {  
          method: "POST",
          body: JSON.stringify({
              officers_id: this.state.search_officers_id,
              plans_id: this.state.search_plans_id
          }),  
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
                    errors: ["Erro ao carregar consultórios"]
                    
                });
            } else { 
                
                this.setState({
                    pacientes: responseJson.data
                });
            }
        })
        .catch((error) => {
          
            console.error(error);
        }); // fim do fetch
    }

/*     async componentDidMount()
    {
        this.setState({activity: true});

        await this.handleOfficers();
        await this.handlePlans();
        await this.handlePatients();

        this.setState({activity: false});
    } */

    async componentDidMount()
    {
        this.setState({activity: true});

        await this.handleOfficers();
        await this.handlePlans();
        await this.handlePatients();

        this.setState({activity: false});
    }
    
    async handlePacientCreate(){
        this.setState({activity: true});
        var token = (await TokenManager.getToken());
        //this.setState({activity: false});
        fetch(host+"register_patient", {
            method: "POST",  
              body: JSON.stringify({
                name: this.state.name,
                plans_id: this.state.plans_id,
                officers_id: this.state.officers_id,
                postal_code:this.state.postal_code,
                address: this.state.address,
                uf: this.state.uf,
                city:this.state.city,
                district:this.state.district,
                number:this.state.number,
                address: this.state.address,
                complementation: this.state.complementation,
                phone:this.state.phone,
                celphone:this.state.celphone,
                email: this.state.email,
                plans: this.state.selectedPlanos,
                rg: this.state.rg,
                cpf: this.state.cpf,
                burned_at: this.state.burned_at
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
              
              this.props.navigation.navigate("Pacientes", this.componentDidMount());
            }
        })
        .catch((error) => {
            this.setState({activity: false});
            console.error(error);
        });
      };
      _onRefresh = () => {
        this.setState({refreshing: true});
        this.handleOfficers();
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
              
                <KeyboardAvoidingView behavior="padding" enabled style={styles.containerForm} key={this.state.uniqueValue}>
                    <ScrollView
                    refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }>
                          <View style={{alignSelf:"center", alignContent:"center", alignItems:"center"}}>
                    <Text style={{fontSize:18, color:"#052555", alignContent:"center"}}>Pacientes</Text>
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
                  </View>
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
                                paddingLeft: 20,
                                paddingRight: 20
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
                                        paddingLeft: 20,
                                        paddingRight: 20
                                    }}>
                                         <View style={{alignSelf:"center", alignContent:"center", alignItems:"center"}}>
                                  <Text style={{fontSize:18, color:"#E5F0FF", alignContent:"center"}}>Novo Paciente</Text>
                                  
                                </View>
                                    {/* <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} /> */}
                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>Escolha um consultório</Text>
                                            <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40,
                                                    borderBottomWidth: 2, 
                                                    borderBottomColor: "#fff",
                                                    color: "#fff",
                                                    marginBottom: 15}}>
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
                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>Escolha o Plano do Paciente</Text>
                                            <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40,
                                                    borderBottomWidth: 2, 
                                                    borderBottomColor: "#fff",
                                                    color: "#fff",
                                                    marginBottom: 15}}>
                                                <Picker style={{color:"#fff"}}
                                                    selectedValue={this.state.plans_id}
                                                    onValueChange={(itemValue, itemIndex) =>
                                                        this.setState({plans_id: itemValue}) }>
                                                            <Picker.Item key={0} value={0} label={'Selecione'} />
                                                {this.state.plans.map((plan, i) => { 
                                                    return <Picker.Item key={i} value={plan.id} label={plan.name } />
                                                })}
                                                </Picker>
                                            </View>

                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>Nome completo</Text>
                                            <TextInput 
                                            onChangeText={this.handleChange('name')}
                                            value={this.state.name}
                                            style={styles.formTextField} placeholder="Nome completo"  maxLength = {150}></TextInput>
                                            

                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>RG</Text>
                                            <TextInput 
                                            onChangeText={this.handleChange('rg')}
                                            value={this.state.rg}
                                            style={styles.formTextField} placeholder="RG"  maxLength = {150}></TextInput>


                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>CPF</Text>
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


                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>Endereço / Localização</Text>
                                            
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
                                            <Text style={{color: 'yellow'}}>{this.state.postal_code} - {this.state.uf} - {this.state.city}</Text>
                                            <Text style={{color: 'yellow'}}>{this.state.address}</Text>
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
                                            
                    
                                            <Text style={[styles.textDivisor, {color: 'yellow'}]}>Contato</Text>
                                            
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
                                            <TextInput 
                                            onChangeText={this.handleChange('email')}
                                            value={this.state.email}
                                            style={styles.formTextField} placeholder="Email principal"  maxLength = {250}></TextInput>

                                        <TouchableHighlight
                                            style={styles.btnSave}
                                            onPress={() => {
                                                this.handlePacientCreate();
                                            }}>
                                            <Text>Salvar</Text>
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
                        
                            
                            <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40,
                                borderBottomWidth: 2, 
                                borderBottomColor: "#fff",
                                color: "#fff",
                                marginBottom: 15}}>
                                <Picker style={{color:"#fff"}}
                                    selectedValue={this.state.search_officers_id}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({search_officers_id: itemValue})
                                        //this.handlePatients(itemValue, itemIndex);
                                    }
                                    >
                                    <Picker.Item key={0} value={0} label={'Filtrar por consultório'} />
                                {this.state.searchOfficers.map((office, i) => { 
                                    return <Picker.Item key={i} value={office.id} label={office.name } />
                                })}
                            </Picker>
                            </View>
                           
                            <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40,
                                borderBottomWidth: 2, 
                                borderBottomColor: "#fff",
                                color: "#fff",
                                marginBottom: 15}}>
                                <Picker style={{color:"#fff"}}
                                    selectedValue={this.state.search_plans_id}
                                    onValueChange={(itemValue, itemIndex) =>
                                        this.setState({search_plans_id: itemValue})
                                    }
                                    >
                                        <Picker.Item key={0} value={0} label={'Filtrar por plano'} />
                                {this.state.searchPlans.map((plan, i) => { 
                                    return <Picker.Item key={i} value={plan.id} label={plan.name } />
                                })}
                            </Picker>
                            </View>
                            {this.state.pacientes.map((pacient, i) => { 
                                return <View 
                                        key={pacient.id}
                                        style={{
                                            backgroundColor: "#052555",
                                            borderRadius: 10,
                                            padding:15,
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
                                            <Ionicons name="ios-contact" size={50} color={"#5199FF"}  />
                                            </Text>
                                            <Text style={{
                                            alignSelf: 'center',
                                            flex: 1,
                                            color: 'white',
                                            fontSize:14,
                                            fontWeight: 'bold'
                                            }}> {pacient.name}</Text>
                                        
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}><Ionicons name="md-map" size={12} color={"#5199FF"} /> {pacient.city} - {pacient.address}, {pacient.number}</Text>
                                            
                                            <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}> <Ionicons name="md-phone-portrait" size={12} color={"#5199FF"} /> {pacient.celphone} <Ionicons name="md-mail" size={12} color={"#5199FF"} /> {pacient.email}</Text>
                                            
                                            <View 
                                                key={pacient.id}
                                                style={{
                                                    backgroundColor: "#052555",
                                                    borderRadius: 10,
                                                    padding:15,
                                                    marginTop:10,
                                                    alignSelf: "center",
                                                    alignItems: "center",
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    justifyContent: 'center',
                                                }}> 
                                            <TouchableHighlight
                                                style={[styles.btnOptionsEdit, {marginLeft:10}]}
                                                onPress={() => {
                                                this.setModalNewVisible(true);
                                                }}>
                                                <View>
                                                    <Ionicons name="md-brush" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                style={[styles.btnOptionsCalendar, {marginLeft:10}]}
                                                onPress={() => {
                                                this.setModalNewVisible(true);
                                                }}>
                                                <View>
                                                    <Ionicons name="md-calendar" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>
                                            <TouchableHighlight
                                                style={[styles.btnOptionsDelete, {marginLeft:10}]}
                                                onPress={() => {
                                                this.setModalNewVisible(true);
                                                }}>
                                                <View>
                                                    <Ionicons name="md-trash" size={18} color={"#FFFFFF"} />
                                                </View>
                                            </TouchableHighlight>
                                            </View>
                                            
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
        marginTop: 15,
        marginBottom: 15,
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
  