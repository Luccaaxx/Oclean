import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import Comunidade from '../views/Comunidade'
import Home from '../views/Home'
import Lixo from '../views/Lixo'
import Perfil from '../views/Perfil'
import Configuracoes from '../views/Configuracoes'
import CriarComunidade from '../views/CriarComunidade'

const Stack = createNativeStackNavigator()

export default props => {
    const r = props.route
    const parametros = r.params
    const tela = r && r.params && r.params.Tela ? r.params.Tela : "Home"
    return (
        <Stack.Navigator initialRouteName={tela} screenOptions={{headerShown: false}} >
            <Stack.Screen name="Home" component={Home} initialParams={parametros} />
            <Stack.Screen name="Lixo" component={Lixo} />
            <Stack.Screen name="Perfil" component={Perfil} initialParams={parametros} />
            <Stack.Screen name="Comunidade" component={Comunidade} />
            <Stack.Screen name="Configuracoes" component={Configuracoes} />
            <Stack.Screen name="CriarComunidade" component={CriarComunidade} initialParams={parametros} />
        </Stack.Navigator>
    )
}