import React, {Component} from 'react';
import { StyleSheet, Alert, Text, Dimensions, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import {creatStackNavigator, createSwitchNavigator, createAppContainer, createStackNavigator, createBottomTabNavigator, withOrientation} from 'react-navigation';
import { AuthScreen } from './src/modules/Auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import DentalizeService from './src/modules/services/DentalizeService';
import {TokenManager} from './src/modules/infra/TokenManager';
import { TextInputMask } from 'react-native-masked-text';
import CadDentista from './CadDentista';
import { Ionicons } from '@expo/vector-icons';
//import {Calendar, CalendarList} from 'react-native-calendars';
import CalendarPicker from 'react-native-calendar-picker';
import {CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
import DateTimePicker from "react-native-modal-datetime-picker";
import { ScrollView } from 'react-native-gesture-handler';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';

const host = "http://192.168.0.20:81/api/";

export default class Consultorio extends Component {
    constructor(props) {
      super(props);
      
    }
    static navigationOptions = {
      title: "Consultórios", 
      header: null
    };
  
    state = {
      plans: [
        {
          name: "Planos Odontológicos",
          id: 0,
          children: []
        }
      ],
      errors: [],
      modalVisible: false,
      modalNewVisible: false,
      activity: false,
      uniqueValue: 0,
      timeInput: '',
      consultorios: [],
      name:'',
      postal_code: '',
      city: '',
      district: '',
      address: '',
      complementation: '',
      number: '',
      celphone: '',
      phone: '',
      email: '',
      unique_code_cfo : '',
      numberVisivle: false,
      complementationVisible: false,
  
      segundaDataInicial: '00:00',
      segundaDataFinal: '00:00', 
      tercaDataInicial: '00:00',
      tercaDataFinal: '00:00',
      quartaDataInicial: '00:00',
      quartaDataFinal: '00:00',
      quintaDataInicial: '00:00',
      quintaDataFinal: '00:00',  
      sextaDataInicial: '00:00',
      sextaDataFinal: '00:00', 
      sabadoDataInicial: '00:00',
      sabadoDataFinal: '00:00', 
      domingoDataInicial: '00:00',
      domingoDataFinal: '00:00', 
   
      segundaDataInicialVisible: false,
      segundaDataFinalVisible: false,
      tercaDataInicialVisible:  false,
      tercaDataFinalVisible:  false,
      quartaDataInicialVisible:  false,
      quartaDataFinalVisible:  false,
      quintaDataInicialVisible:  false,
      quintaDataFinalVisible:  false,
      sextaDataInicialVisible:  false,
      sextaDataFinalVisible:  false,
      sabadoDataInicialVisible:  false,
      sabadoDataFinalVisible:  false,
      domingoDataInicialVisible:  false,
      domingoDataFinalVisible:  false ,
  
      selectedPlanos: [],
  
  
    }
    
    onSelectedPlanosChange = (selectedPlanos) => {
      this.setState({ selectedPlanos });
      //console.log(selectedPlanos);
    };
  
    onSelectedEspecialidadesChange = (selectedEspecialidades) => {
      this.setState({ selectedEspecialidades });
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
      this.setState({  
        [date.field]: date.date.getHours().toString() +":"+date.date.getMinutes().toString() 
      }); 
      this.hideDateTimePicker(this.state.timeInput);
    };
  
    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
  
    setModalNewVisible(visible) {
      this.setState({modalNewVisible: visible});
    }
  
    async componentDidMount(){
      var token = (await TokenManager.getToken());
      this.setState({activity: true});
      fetch(host + "list_officers_for_doctors", {  
          method: "GET",  
          headers: {  
            'Accept' : 'application/json',
            'Content-Type': 'application/json; charset=utf-8', 
            'Authorization': 'Bearer '+token, 
          } 
      }).then((response) => response.json())
          .then(async responseJson => {
              //this.setState({activity: false});
          if(responseJson.erro){
              this.setState({
                modalVisible: true,
                errors: ["Erro ao carregar consultórios"]
                
              });
          } else { 
            //console.warn(responseJson.data);
            this.setState({
              consultorios: responseJson.data
            });
          }
  
          fetch(host + "list_plans", { 
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
                    errors: ["Erro ao carregar planos"],
                    modalNewVisible: false
                  });
              } else {
                this.setState({
                  plans: [
                    {
                      name: "Planos Odontológicos",
                      id: 0,
                      children: responseJson.data
                    }
                  ],
                  modalNewVisible: false
                });
              }
          })
          .catch((error) => {
              this.setState({activity: false});
              console.error(error);
          }); // fim do fetch
  
      })
      .catch((error) => {
          this.setState({activity: false});
          console.error(error);
      }); // fim do fetch
    }
  
    handleChange = nomeDoCampo => {
        return valorDoCampo => {
            this.setState({[nomeDoCampo] : valorDoCampo})
        };
    }
  
    forceRemount = () => {
      this.setState({
        uniqueValue: this.state.uniqueValue ++
      })
    }
  
    async handleOfficersCreate(){
      var token = (await TokenManager.getToken());
      this.setState({activity: true});
      fetch(host + "register_officer", {
          method: "POST",  
            body: JSON.stringify({
              name: this.state.name,
              postal_code:this.state.postal_code,
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
              unique_code_cfo: this.state.unique_code_cfo
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
    };
  
    render(){
      const {time} = this.state;
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
                        paddingLeft: 10,
                        paddingRight: 10
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
                        {/* <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} /> */}
                        <Text style={[styles.textDivisor, {color: 'yellow'}]}>Dados Gerais</Text>
                        <TextInput 
                          onChangeText={this.handleChange('unique_code_cfo')}
                          value={this.state.unique_code_cfo}
                          style={styles.formTextField} placeholder="Código único"  maxLength = {150}></TextInput>

                        <TextInput 
                          onChangeText={this.handleChange('name')}
                          value={this.state.name}
                          style={styles.formTextField} placeholder="Nome do Consultório / Clínica"  maxLength = {150}></TextInput>
                        
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
  
                    <Text style={[styles.textDivisor, {color: 'yellow'}]}>Horários de Atendimento</Text>
                        <Text style={styles.textDivisor}>Segunda-feira</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.segundaDataInicial} onPress={()=>this.showDateTimePicker('segundaDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.segundaDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'segundaDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('segundaDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.segundaDataFinal} onPress={()=>this.showDateTimePicker('segundaDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.segundaDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'segundaDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('segundaDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={styles.textDivisor}>Terça-feira</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.tercaDataInicial} onPress={()=>this.showDateTimePicker('tercaDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.tercaDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'tercaDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('tercaDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.tercaDataFinal} onPress={()=>this.showDateTimePicker('tercaDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.tercaDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'tercaDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('tercaDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={styles.textDivisor}>Quarta-feira</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.quartaDataInicial} onPress={()=>this.showDateTimePicker('quartaDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.quartaDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'quartaDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('quartaDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.quartaDataFinal} onPress={()=>this.showDateTimePicker('quartaDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.quartaDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'quartaDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('quartaDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={styles.textDivisor}>Quinta-feira</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.quintaDataInicial} onPress={()=>this.showDateTimePicker('quintaDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.quintaDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'quintaDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('quintaDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.quintaDataFinal} onPress={()=>this.showDateTimePicker('quintaDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.quintaDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'quintaDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('quintaDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={styles.textDivisor}>Sexta-feira</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.sextaDataInicial} onPress={()=>this.showDateTimePicker('sextaDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.sextaDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'sextaDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('sextaDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.sextaDataFinal} onPress={()=>this.showDateTimePicker('sextaDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.sextaDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'sextaDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('sextaDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={styles.textDivisor}>Sábado</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.sabadoDataInicial} onPress={()=>this.showDateTimePicker('sabadoDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.sabadoDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'sabadoDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('sabadoDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.sabadoDataFinal} onPress={()=>this.showDateTimePicker('sabadoDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.sabadoDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'sabadoDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('sabadoDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={styles.textDivisor}>Domingo</Text>
                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                          <View style={{flex:.5}}>
                            <Button title={this.state.domingoDataInicial} onPress={()=>this.showDateTimePicker('domingoDataInicialVisible')} />
                            <DateTimePicker
                              mode={'time'}
                              isVisible={this.state.domingoDataInicialVisible}
                              onConfirm={(date)=>this.handleDatePicked({date:date, field: 'domingoDataInicial'})}
                              onCancel={() => this.hideDateTimePicker('domingoDataInicialVisible')} 
                            />
                          </View>
                          <View style={{flex:.5, alignSelf: "stretch", justifyContent:'center', height: 40 }}>
                            <Button title={this.state.domingoDataFinal} onPress={()=>this.showDateTimePicker('domingoDataFinalVisible')} />
                              <DateTimePicker
                                mode={'time'}
                                isVisible={this.state.domingoDataFinalVisible}
                                onConfirm={(date)=>this.handleDatePicked({date:date, field: 'domingoDataFinal'})}
                                onCancel={() => this.hideDateTimePicker('domingoDataFinalVisible')} 
                              />
                          </View>
                        </View> 
                        <Text style={[styles.textDivisor, {color: 'yellow'}]}>Planos de atendimento</Text>
                        <View> 
                          <SectionedMultiSelect
                            items={this.state.plans}     
                            uniqueKey="id"
                            subKey="children"
                            selectText="Escolha os planos de atendimento"
                            showDropDowns={true}
                            readOnlyHeadings={true}
                            onSelectedItemsChange={this.onSelectedPlanosChange}
                            selectedItems={this.state.selectedPlanos}
                          />
                        </View>
                                             
                        <TouchableHighlight
                          style={styles.btnSave}
                          onPress={() => {
                            this.handleOfficersCreate();
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
  
                
                
                  {this.state.consultorios.map((consultorio, i) => { 
                      return <View 
                              key={consultorio.id}
                              style={{
                                backgroundColor: "#052555",
                                borderRadius: 10,
                                padding:5,
                                marginTop:10,
                                alignSelf: "center",
                                alignItems: "stretch",
                                flex: 1,
                                //flexDirection: 'column',
                                justifyContent: 'center',
                                width:Dimensions.get('window').width - 50,
                              }}> 
                              {/* <View style={{backgroundColor: 'powderblue',  alignItems: "stretch",}}> */}
                                <Text style={{alignSelf:"center"}}>
                                <Ionicons name="md-briefcase" size={50} color={"#5199FF"}  />
                                </Text>
                                <Text style={{
                                  alignSelf: 'center',
                                  flex: 1,
                                  color: 'white',
                                  fontSize:14,
                                  fontWeight: 'bold'
                                }}> {consultorio.name}</Text>
                              
                                  <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}><Ionicons name="md-map" size={12} color={"#5199FF"} /> {consultorio.city} - {consultorio.address}, {consultorio.number}</Text>
                                  
                                  <Text style={[styles.textDivisor, {marginTop:10, alignSelf:'center'}]}> <Ionicons name="md-phone-portrait" size={12} color={"#5199FF"} /> {consultorio.celphone} <Ionicons name="md-mail" size={12} color={"#5199FF"} /> {consultorio.email}</Text>
                                  
                                  <View 
                                    key={consultorio.id}
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
      paddingLeft: 5,
      paddingRight: 5,
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
      alignSelf: "flex-end",
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