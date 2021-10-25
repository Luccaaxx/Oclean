import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableOpacity, KeyboardAvoidingView, KeyboardAvoidingViewBase } from 'react-native'
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'

import Btn from '../components/Btn';
import CadastrarSinalizacao from '../components/CadastrarSinalizacao';
import VerSinalizacao from '../components/VerSinalizacao';

import axios from 'axios';
import { server } from './../comum'

export default props => {

    const [cadastrarView, setCadastrarView] = useState(false)
    const [origem,setOrigem] = useState(null)
    const [novoMarker, setNovoMarker] = useState(null)

    const mapRef = useRef(null)

    useEffect(() =>{
        (async function(){
          const { status } = await Location.requestForegroundPermissionsAsync()
          if (status === 'granted') {
                let location = await Location.getCurrentPositionAsync({ enableHighAccuracy: true })
                setOrigem({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.000922,
                    longitudeDelta: 0.000421
                })
                setNovoMarker({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude})
          }  else {
              throw new Error('Location permission not granted')
          }
        })()
    },[])

    const [sinalizar, setSinalizar] = useState(false)
    const [verSin, setVerSin] = useState(false)
    const [sinalizacoes, setSinalizacoes] = useState([])

    const getSinalizacoes = async () => {
        try{
            const sinalizacoes = await axios.get(`${server}/sinalizacao`)
            setSinalizacoes(sinalizacoes.data)
        }catch(erro){
            console.log(erro)
        }
    }

    const renderizarSinalizacoes = () => {

        getSinalizacoes()
        
        const views = []

        for(var sinalizacao in sinalizacoes){
            sinalizacao = sinalizacoes[sinalizacao]
            
            views.push(
                <Marker coordinate={{
                    latitude: Number.parseFloat(sinalizacao.latitude_sin),
                    longitude: Number.parseFloat(sinalizacao.longitude_sin)
                }}
                title={`${sinalizacao.praia_sin} - ${sinalizacao.cidade_sin}`}
                onPress={() => setVerSin(true)}
                pinColor="blue"
                description={sinalizacao.status_sin == "Limpo" ? "Já foi limpo" : "Ainda está sujo"}
                key={sinalizacao.id_sin} />
            )
        }

        return(
            <>
                { views }
            </>
        )
        
    }

    return(
    <View style={{ flex: 1, alignItems: "center" }}>
        {/* <Header navegacao={props.navigation} /> */}
        {/* <Text style={style.titulo}>Sinalizações de Lixo</Text> */}
        <MapView
            ref={mapRef}
            style={style.map}
            initialRegion={origem}
            showsUserLocation={true}
            mapPadding={{top:StatusBar.currentHeight + 16,right:0,bottom:0,left:0}}>
                {sinalizar == true && <Marker onDragEnd={res => 
                    {setNovoMarker(res.nativeEvent.coordinate)
                    console.log(novoMarker)}} draggable={true} coordinate={origem}/>}
                { renderizarSinalizacoes() }
        </MapView>
        {sinalizar == true &&
            <Btn estilo={[style.btnSinalizar, {bottom: 104}]} titulo="Confirmar" tamanhoFonte={20} funcaoPressionar={_ => setCadastrarView(true)} />
        }
        <Btn estilo={[style.btnSinalizar, {backgroundColor: sinalizar ? "#e00b0b" : "#63E1FD"}]} titulo={ sinalizar ? "Cancelar" : "Sinalizar Lixo"} tamanhoFonte={20} funcaoPressionar={() => {
            if(!sinalizar){
                mapRef.current.animateCamera({
                    center: origem,
                    zoom: 20,
                }, { duration: 1000 })
            }
            setSinalizar(!sinalizar)}} />
        {cadastrarView == true && 
            <CadastrarSinalizacao
                funcaoVoltar={_ => setCadastrarView(false)}
                id_usu={props.route.params.id_usu}
                latitude_sin={novoMarker.latitude.toString()}
                longitude_sin={novoMarker.longitude.toString()} />}
        {verSin == true &&
            <VerSinalizacao funcaoVoltar={_ => setVerSin(false)} />}
    </View>
    )
}

const style = StyleSheet.create({
    titulo: {
        position: "absolute",
        top: StatusBar.currentHeight + 16,

        fontSize: 30,
        fontWeight: "bold",
        color: "#333333"
    },
    map: {
        width: "100%",
        height: "100%",
        paddingTop: 16,

        borderRadius: 200
    },
    btnSinalizar: {
        position: "absolute",
        bottom: 48,
        height: 40,
        width: "55%",
    }
})