import React, {Component} from 'react';
import { StyleSheet, Alert, Text, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
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

class Paciente extends Component {
  static navigationOptions = {
    title: "Pacientes", 
    header: null
  };
  
  render(){
    return (
      
      <View style={styles.container}>
        <Text>PACIENTES</Text> 
      </View>
    );
  }
}
const items = [
  // this is the parent or 'item'
  {
    name: 'Fruits',
    id: 0,
    // these are the children or 'sub items'
    children: [
      {
        name: 'Apple',
        id: 10,
      },
      {
        name: 'Strawberry',
        id: 17,
      },
      {
        name: 'Pineapple',
        id: 13,
      },
      {
        name: 'Banana',
        id: 14,
      },
      {
        name: 'Watermelon',
        id: 15,
      },
      {
        name: 'Kiwi fruit',
        id: 16,
      },
    ],
  },
 /*  {
    // next parent item
   ...
  }, */

];
class Consultorio extends Component {
  constructor(props) {
    super(props);
    
  }
  static navigationOptions = {
    title: "Consultórios", 
    header: null
  };

  state = {
    errors: [],
    modalVisible: false,
    modalNewVisible: false,
    activity: false,
    timeInput: '',

    nome:'',
    cep: '',
    uf: '',
    municipio: '',
    bairro: '',
    logradouro: '',
    numero: '',
    celular: '',
    telefone: '',
    email: '',
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

    selectedEspecialidades: [],
    selectedPlanos: [],
  }
  
  onSelectedPlanosChange = (selectedPlanos) => {
    this.setState({ selectedPlanos });
  };
  onSelectedEspecialidadesChange = (selectedEspecialidades) => {
    this.setState({ selectedEspecialidades });
  };

  showDateTimePicker = (field) => {
    //console.log(field);
    this.setState({ [field]: true , timeInput: field});
  };

  hideDateTimePicker = (field) => {
    console.log(field);
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

  componentDidMount(){
  }

  handleChange = nomeDoCampo => {
      return valorDoCampo => {
          this.setState({[nomeDoCampo] : valorDoCampo})
      };
  }

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
          <KeyboardAvoidingView behavior="padding" enabled style={styles.containerForm}>
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
                      paddingRight: 50
                    }}>
                      {/* <Image style={styles.appImageMd} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} /> */}
                      <Text style={[styles.textDivisor, {color: 'yellow'}]}>Dados Gerais</Text>
                      <TextInput 
                        onChangeText={this.handleChange('nome')}
                        style={styles.formTextField} placeholder="Nome do Consultório / Clínica"  maxLength = {10}></TextInput>
                      
                      <TextInputMask
                          value={this.state.cep}
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
                            mask: '99.999-999'
                          }}
                          onChangeText={text => {
                            this.setState({
                              cep: text
                            })
                          }}
                          //onChangeText={this.handleChange('cpf')}
                          style={styles.formTextField} placeholder="CEP" />
                      <TextInputMask
                          value={this.state.celular}
                          type={'cel-phone'}
                          options={{
                            maskType: 'BRL',
                            withDDD: true,
                            dddMask: '(99) '
                          }}
                          onChangeText={text => {
                            this.setState({
                              celular: text
                            })
                          }}
                          //onChangeText={this.handleChange('cpf')}
                          style={styles.formTextField} placeholder="celular" />
                      <TextInputMask
                          value={this.state.telefone}
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
                              telefone: text
                            })
                          }}
                          //onChangeText={this.handleChange('cpf')}
                          style={styles.formTextField} placeholder="telefone comercial" />
                      <TextInput 
                        onChangeText={this.handleChange('email')}
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
                      
                      <Text style={[styles.textDivisor, {color: 'yellow'}]}>Especialidades</Text>
                      <View>
                        <SectionedMultiSelect
                          items={items}     
                          uniqueKey="id"
                          subKey="children"
                          selectText="Escolha as especialidades"
                          showDropDowns={true}
                          readOnlyHeadings={true}
                          onSelectedItemsChange={this.onSelectedEspecialidadesChange}
                          selectedItems={this.state.selectedEspecialidades}
                        />
                      </View>
                      <Text style={[styles.textDivisor, {color: 'yellow'}]}>Planos de atendimento</Text>
                      <View> 
                        <SectionedMultiSelect
                          items={items}     
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
                          this.setModalNewVisible(!this.state.modalNewVisible);
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
              <View style={{justifyContent:'flex-start', flexDirection: 'row'}}>
                {/* <Image style={{padding: 5, width:20, height:20,  marginTop: 5}} source={{ uri: 'http://odontologiadrkikuchi.com.br/wp-content/uploads/2017/03/cropped-tooth-icon.png' }} /> */}
                <Text style={{color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                  textShadowColor: 'darkblue',
                  letterSpacing: 5}}>Consultórios</Text>
              </View>
              <TouchableHighlight
                style={styles.btn}
                onPress={() => {
                  this.setModalNewVisible(true);
                }}>
                  <Text>Novo consultório</Text>
              </TouchableHighlight>
          </KeyboardAvoidingView>
      );
    }
  }
}

class Auxiliar extends Component {
  static navigationOptions = {
    title: "Auxiliares", 
    header: null
  };
  render(){
    return (
      <View style={styles.container}>
        <Text>AUXILIARES</Text> 
      </View>
    );
  }
}

class AgendaAuxiliar extends Component {
  static navigationOptions = {
    title: "Agenda Auxiliar", 
    header: null
  };
  render(){
    return (
      <View style={styles.container}>
        <Text>AGENDA AUXILIAR</Text> 
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
        <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("CadPacienteStack")}
                  style={styles.btnPerfil}><Text style={styles.textColor}>Paciente</Text></TouchableOpacity>
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
    fetch("http://192.168.0.20:81/api/login", {
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
            console.warn(await TokenManager.getToken()); 
            console.warn(await TokenManager.getName()); 
            console.warn(await TokenManager.getProfile());  
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
    paddingLeft: 50,
    paddingRight: 50
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
    paddingLeft: 50,
    paddingRight: 50,
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
    borderRadius: 10,
    padding: 10,
    alignSelf: "stretch",
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
    screen: Paciente
  }
});

const ConsultorioStack = createStackNavigator({
  ConsultorioStackHome: {
    screen: Consultorio
  }
});

const AuxiliarStack = createStackNavigator({
  AuxiliarStackHome: {
    screen: Auxiliar
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
const AreaLogadoAuxiliar = createBottomTabNavigator({
  AgendaAuxiliar: {
    screen: AgendaAuxiliarStack
  }
}); 

const AreaDeslogado = createStackNavigator({
  InitStackHome: {
    screen: Init
  },
  CadDentistaStack: {
    screen: CadDentista
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


