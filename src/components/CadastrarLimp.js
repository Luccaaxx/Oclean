import React, { useState } from 'react'
import { StyleSheet, View, Text, Image, Keyboard } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import axios from 'axios'
import { server, showError } from '../comum'

import VoltarBtn from './VoltarBtn'
import estilo from './estilo'
import BtnImg from './BtnImg'
import IptFundo from './InputFundo'
import Btn from './Btn'
import { uploadFoto } from '../components/imgComum'

export default props => {
    const fechar = props.fechar || null
    const terminar = props.terminar || null
    const id_sin = props.id_sin || 0
    // Tive que passar o id_usu externamente pois não dá para pegá-lo aqui dentro
    const id_usu = props.id_usu || null

    const [foto, setFoto] = useState({ uri: `${server}/img/placeholder.png`})
    const [descricao, setDescricao] = useState("")

    const [erro, setErro] = useState("")

    const cadastrar = async () => {
        setErro("")
        try{ 
            // Precisa de otimização (Talvez um switch?)
            if(foto.uri == `${server}/img/placeholder.png` || descricao == ""){
                setErro("Insira todas as informações!")
            } else {
                const data_limp = new Date()
                linkFoto = await uploadFoto(foto, 'foto_sinalizacao', props.id_usu)
                const sinalizacoes = await axios.put(`${server}/sinalizacao/${id_sin}/alterar`, {
                    status_sin: "limpo",
                    foto_limp: linkFoto,
                    desc_limp: descricao,
                    data_limp: data_limp,
                    id_usu_limpo: id_usu,
                }).then(() => {
                    terminar()
                })
            }
        }catch(e){
            console.log(e)
        }
    }

    return(
        <View style={style.fundo}>
            <View style={style.container}>
                <VoltarBtn 
                    titulo={<MaterialIcons name="arrow-back" size={18} color="#333333" />}
                    navegacao={props.navigation}
                    style={estilo.VoltarBtn}
                    funcaoPressionar={fechar} />
                <Text style={style.titulo}>Limpeza</Text>

                <View style={{ width: "100%", alignItems: "center"}}>
                        {foto &&
                            <Image 
                                source={foto} 
                                style={{
                                    maxWidth: "100%",
                                    width: "80%",
                                    height: 150,  
                                    marginBottom: 16,
                                    borderRadius: 20
                            }}
                            resizeMode="cover" />}

                    </View>
                    <View style={{justifyContent: "center", flexDirection: "row"}}>
                        <BtnImg permitirEdicao={true} aspectoLargura={400} aspectoAltura={150} funcaoPressionar={async result => {
                            setFoto(result)}}/>
                    </View>

                    <View style={{width: "80%"}}>
                        <Text style={{color: "#333333", fontSize: 22, marginBottom: 8, fontWeight: "bold"}}>Descrição</Text>
                        <IptFundo placeholder="Ex: Copacabana" largura="100%" valor={descricao} setValor={setDescricao}/>
                    </View>

                    <Btn estilo={style.btnLimpar} corFonte="white" titulo="Limpar" tamanhoFonte={20} funcaoPressionar={async () => cadastrar()} />
                    <Text style={{fontSize: 10, color: "red", marginTop: 8,marginBottom: 40}}>{erro}</Text>
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    fundo:{
        position: "absolute",
        top: 0,
        width: "100%",
        height: "100%",
        alignItems: "center",

        backgroundColor: "rgba(51, 51, 51, 0.5)",
        
        elevation: 19
    },
    container: {
        width: "80%",
        alignItems: "center",

        backgroundColor: "white",
        borderRadius: 20,
    },
    titulo: {
        marginTop: 25,
        marginBottom: 16,

        fontSize: 23,
        fontWeight: "bold",
        color: "#333333"
    },
    btnLimpar: {
        height: 40,
        width: "55%",
        marginTop: 16,

        backgroundColor: "#333333",
    }
})