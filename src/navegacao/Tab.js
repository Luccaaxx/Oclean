import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialIcons } from '@expo/vector-icons';

import SubStack from './SubStack';

const tab = createBottomTabNavigator()

export default props => {
    return (
        <tab.Navigator
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size}) => {
                    let iconName

                    switch(route.name) {
                        case 'HomeStack':
                            iconName = focused
                                ? 'home'
                                : 'home'
                            break;
                        case 'LixoStack':
                            iconName = focused
                                ? 'map'
                                : 'map'
                            break;
                        case 'PerfilStack':
                            iconName = focused
                                ? 'person'
                                : 'person'
                            break;
                    }
        
                    return <MaterialIcons name={iconName} size={size} color={color}/>;
                },
                headerShown: false,     
                tabBarActiveBackgroundColor: '#63E1FD',
                tabBarActiveTintColor: '#fff',
                tabBarinactiveTintColor: 'rgba(255, 255, 255, 0.68)',
                tabBarShowLabel: false,
                tabBarStyle:{ elevation: 24, height: "5%" },

            })}>
            <tab.Screen name="HomeStack" component={SubStack} initialParams={{ Tela: "Home"}} />
            <tab.Screen name="LixoStack" component={SubStack} initialParams={{ Tela: "Lixo", parametrosReais: props.route.params}} />
            <tab.Screen name="PerfilStack" component={SubStack} initialParams={{ Tela: "Perfil", id_usu: props.route.params.id_usu }} />
        </tab.Navigator>
    )
}