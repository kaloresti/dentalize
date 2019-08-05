import React, {Component} from 'react';
import { StyleSheet,  Platform, Alert, Text, Picker , Modal, View, Image, Button,TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, KeyboardAvoidingView, TextInput, ActivityIndicator } from 'react-native';
import {creatStackNavigator, createSwitchNavigator, createAppContainer, createStackNavigator, createBottomTabNavigator, withOrientation} from 'react-navigation';
import { AuthScreen } from './src/modules/Auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import DentalizeService from './src/modules/services/DentalizeService';
import {TokenManager} from './src/modules/infra/TokenManager';
import { TextInputMask } from 'react-native-masked-text';
import {CirclesLoader, PulseLoader, TextLoader, DotsLoader} from 'react-native-indicator';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { ScrollView } from 'react-native-gesture-handler';

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

export default class CadDentista extends Component {
    static navigationOptions = {
      title: "Login",
      header: null
    };
    state = {
      name: "",
      cro: "",
      cro_uf: "PA",
      cpf: "",
      ufs: [
        {nome: "Acre", sigla: "AC"},
        {nome: "Alagoas", sigla: "AL"},
        {nome: "Amapá", sigla: "AP"},
        {nome: "Amazonas", sigla: "AM"},
        {nome: "Bahia", sigla: "BA"},
        {nome: "Ceará", sigla: "CE"},
        {nome: "Distrito Federal", sigla: "DF"},
        {nome: "Espírito Santo", sigla: "ES"},
        {nome: "Goiás", sigla: "GO"},
        {nome: "Maranhão", sigla: "MA"},
        {nome: "Mato Grosso", sigla: "MT"},
        {nome: "Mato Grosso do Sul", sigla: "MS"},
        {nome: "Minas Gerais", sigla: "MG"},
        {nome: "Pará", sigla: "PA"},
        {nome: "Paraíba", sigla: "PB"},
        {nome: "Paraná", sigla: "PR"},
        {nome: "Pernambuco", sigla: "PE"},
        {nome: "Piauí", sigla: "PI"},
        {nome: "Rio de Janeiro", sigla: "RJ"},
        {nome: "Rio Grande do Norte", sigla: "RN"},
        {nome: "Rio Grande do Sul", sigla: "RS"},
        {nome: "Rondônia", sigla: "RO"},
        {nome: "Roraima", sigla: "RR"},
        {nome: "Santa Catarina", sigla: "SC"},
        {nome: "São Paulo", sigla: "SP"},
        {nome: "Sergipe", sigla: "SE"},
        {nome: "Tocantins", sigla: "TO"}
  
      ],
      email: "",
      password: "",
      c_password: "",
      errors: [],
      modalVisible: false,
      activity: false,
      selectedEspecialidades: []
    }
  
    onSelectedEspecialidadesChange = (selectedEspecialidades) => {
      this.setState({ selectedEspecialidades });
      console.log(selectedEspecialidades);
    };

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
  
    handleDoctorCreate = () => {
        
        this.setState({activity: true});
        fetch("http://192.168.0.20:81/api/register_doctor", {
            method: "POST",  
              body: JSON.stringify({
              name: this.state.name,
              cro:this.state.cro,
              cro_uf:this.state.cro_uf,
              cpf:this.state.cpf,
              email:this.state.email,
              specialities: this.state.selectedEspecialidades,
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
                await TokenManager.setDoctorId(responseJson.data.id);
                await TokenManager.setProfile(responseJson.data.profile_type);
                await TokenManager.setName(responseJson.data.name);
                console.warn(await TokenManager.getToken()); 
                console.warn(await TokenManager.getName()); 
                console.warn(await TokenManager.getProfile());
                console.warn(await TokenManager.getDoctorId());    
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
                  
                  <Text style={styles.appName}>Dentista</Text>
                  <Text>Todos os campos são obrigatórios</Text>
          
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
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
                  </View> 
                  
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
          
                  <Text style={[styles.textDivisor, {color: 'yellow'}]}>Suas Especialidades</Text>
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
                    onPress={this.handleDoctorCreate}
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
      paddingLeft: 50,
      paddingRight: 50
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
    spinnerTextStyle: {
        color: '#FFF'
      },
      instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5
      }
  });