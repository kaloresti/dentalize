import React from 'react';
import { View, Image, Dimensions } from 'react-native';
import {CardPostHeader} from './CardPostHeader';
import {CardPostFooter} from './CardPostFooter';

export default class App extends React.Component {
    render() {
      const widthScreen = Dimensions.get("screen").width;
      const item = this.props.post;
      return (
        <View key={item.id}>
            <CardPostHeader usuario={item.loginUsuario} imagem={item.urlPerfil}/>
            <Image style={{ width: widthScreen, height: 300, padding: 5 }} source={{ uri: item.urlFoto }} />
            <CardPostFooter texto={item.comentario} data={item.horario} /> 
        </View>
      );
    }
  }