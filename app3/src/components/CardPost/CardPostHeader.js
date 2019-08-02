import React from 'react';
import { Text, View, Image } from 'react-native';

export const CardPostHeader = function(props) {
    return (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start', padding: 5 }}>
            <Image style={{ width: 50, height: 50, borderRadius: 50, padding: 5 }} source={{ uri: props.imagem }} />
            <Text style={{padding:5}}>@{props.usuario}</Text>
        </View>
    );
}


