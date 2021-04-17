import React, { createContext, useEffect, useReducer } from 'react'
import axios from 'axios'

const reducer = (state, action) => {
    switch (action.type) {
        case 'LOAD_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        case 'DELETE_NOTIFICATION': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        case 'CLEAR_NOTIFICATIONS': {
            return {
                ...state,
                notifications: action.payload,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const NotificationContext = createContext({
    notifications: [],
    deleteNotification: () => {},
    clearNotifications: () => {},
    getNotifications: () => {},
    createNotification: () => {},
})

export const NotificationProvider = ({ settings, children }) => {
    const [state, dispatch] = useReducer(reducer, [])

    const deleteNotification = async (notificationID) => {
        try {
            const res = await axios.post('/api/notification/delete', {
                id: notificationID,
            })
            dispatch({
                type: 'DELETE_NOTIFICATION',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const clearNotifications = async () => {
        try {
            const res = await axios.post('/api/notification/delete-all')
            dispatch({
                type: 'CLEAR_NOTIFICATIONS',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }

    const getNotifications = async () => {
        try {
            const notification_data = [
                {
                    heading: "Nuevo mensaje",
                    id: "K0MU_mC25UB", 
                    path: "chat",
                    subtitle: "Hello, Any progress...",
                    timestamp: 1570702802573,
                    title: "Nuevo mensaje de Devid",
                    icon: {
                        name: "chat", 
                        color: "primary"
                    }
                },
                {
                    heading: "Mensaje",
                    id: "lelnosabia", 
                    path: "page-layouts/user-profile",
                    subtitle: "Servidor sobre caragado",
                    timestamp: 1570702802573,
                    title: "Haz superado el tráfico permitido",
                    icon: {
                        name: "notifications", 
                        color: "error"
                    }
                },
                {
                    heading: "Nuevo mensaje",
                    id: "K0MU_mC25UB", 
                    path: "chat",
                    subtitle: "Qué tal",
                    timestamp: 1570702802573,
                    title: "Nuevo mensaje de Devid",
                    icon: {
                        name: "chat", 
                        color: "primary"
                    }

                }
            ]
        
             await axios.get('/api/notification')
            dispatch({
                type: 'LOAD_NOTIFICATIONS',
                payload: notification_data,
            }) 
            //console.log(notification_data)
        } catch (e) {
            console.error(e)
        }
    }
    const createNotification = async (notification) => {
        try {
            const res = await axios.post('/api/notification/add', {
                notification,
            })
            dispatch({
                type: 'CREATE_NOTIFICATION',
                payload: res.data,
            })
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        getNotifications()
    }, [])

    return (
        <NotificationContext.Provider
            value={{
                notifications: state.notifications,
                deleteNotification,
                clearNotifications,
                getNotifications,
                createNotification,
            }}
        >
            {children}
        </NotificationContext.Provider>
    )
}

export default NotificationContext
