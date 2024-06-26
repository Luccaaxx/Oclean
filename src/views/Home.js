import React, { useState } from 'react'
import { ScrollView, StyleSheet, View, Text, Image, RefreshControl  } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons'

import axios from 'axios'
import { server, showError } from '../comum'

import estilo from '../components/estilo'
import Header from '../components/Header'
import Post from '../components/Post'
import Btn from '../components/Btn'
import CardComu from '../components/CardComu'

export default  props => {
    // Apagar depois
    const imagem = `${server}/img/default.png`

    const parametros = props.route.params

    const id = parametros.id_usu

    var [usu, setUsu] = useState("Carregando...")

    const [posts, setPosts] = useState()


    const getUsuario = async () => {
        // if evita múltiplas chamadas para a api
        if(usu == "Carregando...")  {      
            try{
                const res = await axios.get(`${server}/usuarios/${id}`)
                setUsu(res.data[0])
                getComunidades()
            }catch(e){
                showError(e)
                res = { erro: "erro"}
            }
        }
    }
    getUsuario()
    const getComunidades = async() => {
        try{
            const resPosts = await axios.get(`${server}/post/${id}/buscar`)
            const postsArray = new Array()
            for(const post in resPosts.data){
                const postagens = resPosts.data[post]
                postsArray.push(postagens)
            }
            setPosts(postsArray)
        } catch(e) {
            showError(e)
        }
    }
        
    const renderizarPosts = () => {

        const postagens = []

        for( var postagem in posts){
            const postRenderizado = posts[postagem]
            const possuiImagem = false
            if(postRenderizado.foto_post != ""){
                possuiImagem = true
            }

            // const comunidade = await axios.get(`${server}/comunidades/id/${postRenderizado.id_comu}`)
            // console.log(comunidade)
            postagens.push(
                <Post key={postRenderizado.id_post} 
                    post={postRenderizado}
                    possuiImagem={possuiImagem}
                    funcaoPressionar={_ => props.navigation.navigate("Comunidade", { nome_comu: postRenderizado.nome_comu})}
                    navigation={props.navigation}
                />
            )
        }

        if(!postagens[0]){
            postagens.push(
                <View key={1} style={{width: "100%", marginTop: 40, alignItems: "center"}}>
                    <Text style={{fontSize: 28, textAlign: "center", fontWeight: "bold", color: "#333333"}}>
                        Você ainda não entrou em nenhuma comunidade!
                    </Text>
                    <View style={{width: "80%"}}>
                        <Text style={{fontSize: 16, textAlign: "center", fontWeight: "100", color: "#333333"}}>
                            Pesquise e entre em alguma comunidade para conseguir ver posts de outras pessoas
                        </Text>
                    </View>
                    <Image 
                        source={require('../img/cryp_dead.png')} 
                        style={{
                            width: 160,
                            height: 150,
                            marginTop: 24               
                        }}
                        resizeMode="cover"
                    />
                </View>
            )
        }

        

        return(
            <>
                { postagens }
            </>
        )
    }

    const BotaoAdd = _ => {
        if(usu.tipo_usu == "ONG"){
            return [
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: "#FFF", fontSize: 15}}>Criar Comunidade</Text>
                    <Btn 
                        altura={52}
                        largura={52}
                        marginHorizontal={6.5}
                        svg={<MaterialIcons name="groups" size={16} color="#FFF" />}
                        somenteSvg={true}
                        borderRadius={400}
                        funcaoPressionar={_ => props.navigation.navigate("CriarComunidade")}/>
                </View>,
                <View style={{flexDirection: "row", alignItems: "center"}}>
                    <Text style={{color: "#FFF", fontSize: 15}}>Criar Post</Text>
                    <Btn 
                        altura={52}
                        largura={52}
                        marginHorizontal={6.5}
                        marginVertical={6}
                        svg={<MaterialIcons name="create" size={16} color="#FFF" />}
                        somenteSvg={true}
                        borderRadius={400}
                        funcaoPressionar={_ => props.navigation.navigate("CriarPost")} />
                </View>,
                <View style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0, 0, 0, 0.45)"}} />
            ]
        } else {
            return []
        }
    }

    const [botoes, setBotoes] = useState(false)
    const [refresh, setRefresh] = useState(false)

    const wait = (timeout) => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    }

    const onRefresh = React.useCallback(() => {
        setRefresh(true);
        getComunidades().then(() => setRefresh(false));
    }, []);

    return(
        <>
            <View style={[style.addBtn, botoes ? {} : {width: 65, height: 65}]}>
                {/* Pequeno esquerda */}
                {botoes ? BotaoAdd()[0] : []}
                    {/* Pequeno esquerda */}
                    {botoes ? BotaoAdd()[1] : []}
                    <Btn
                        altura={65}
                        largura={65}
                        svg={<MaterialIcons name={usu.tipo_usu == "ONG" ? "add" : "create"} size={24} color="#fff" />}
                        somenteSvg={true}
                        borderRadius={400}
                        funcaoPressionar={() => usu.tipo_usu == "ONG" ? setBotoes(!botoes) : props.navigation.navigate("CriarPost") } />
            </View>
            <ScrollView 
                refreshControl={
                    <RefreshControl
                      refreshing={refresh}
                      onRefresh={onRefresh}
                    />
                }>
                <Header navegacao={props.navigation} />
                <View style={style.Container}>
                    { renderizarPosts() }
                </View>
            </ScrollView>
            {botoes ? BotaoAdd()[2] : []}
        </>
    )
}
const style = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
    },
    addBtn: {
        flexDirection: "column",
        position: "absolute",
        justifyContent:"flex-end",
        alignItems:"flex-end",
        width: 200,
        height: 200,
        bottom: 16,
        right: 16,
        zIndex: 1
    }
})
