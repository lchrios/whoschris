import React, { createContext, useEffect, useReducer } from 'react'
import firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseConfig } from 'config.js'
import { MatxLoading } from 'app/components'
import api from 'app/services/api'

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}


const initialAuthState = {
    isAuthenticated: false,
    isInitialised: false,
    user: null,
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'FB_AUTH_STATE_CHANGED': {
            const { isAuthenticated, user } = action.payload

            return {
                ...state,
                isAuthenticated,
                isInitialised: true,
                user,
            }
        }
        default: {
            return { ...state }
        }
    }
}

const AuthContext = createContext({
    ...initialAuthState,
    method: 'FIREBASE',
    createUserWithEmailAndPassword: () => Promise.resolve(),
    createTherapistWithEmailAndPassword: () => Promise.resolve(),
    signInWithEmailAndPassword: () => Promise.resolve(),
    signInWithGoogle: () => Promise.resolve(),
    assignUserRole: () => Promise.resolve(),
    logout: () => Promise.resolve(),
})

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialAuthState)

    const signInWithEmailAndPassword = (email, password) => {
        return firebase.auth().signInWithEmailAndPassword(email, password)
    }

    const assignUserRole = (uid) => {
        api.put(`/auth/${uid}/user`)
            .then(res => {
                console.log("Rol actualizado a: user")
            })
    }

    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider()
        
        return firebase.auth().signInWithPopup(provider)
    }

    // const signInWithFacebook = () => {
    //     const provider = new firebase.auth.FacebookAuthProvider()
        
    //     return firebase.auth().signInWithPopup(provider)
    // }

    // const signInWithTwitter = () => {
    //     const provider = new firebase.auth.TwitterAuthProvider()
        
    //     return firebase.auth().signInWithPopup(provider)
    // }

    const createUserWithEmailAndPassword = async (state) => {
        let { email, password } = state;
        
        delete state.age_agree;
        delete state.password;
        delete state.withProvider; 
        delete state.file
        
        // let data = new FormData();
        // data.append('file', file, file.name);
        // console.log("data", data.get("file"))
        // console.log("state", state)
        // await api.post(`/auth/uid1/uploadimg`, data, {
        //     headers: {
        //         'accept': 'application/json',
        //         'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
        //     }
        // })
        return api.post('/auth/signuser', { 
            userdata: {
                ...state, 
                answered: false, 
                img: "usuarios/placeholders/none-user.png", 
                therapist: "", 
                payment_met: [], 
            }, 
            email: email, 
            password: password
        })
    }

    const createTherapistWithEmailAndPassword = async (state) => {
        let {email, password} =  state
        delete state.password
        return api.post('/auth/signtherapist', { 
            therapistdata: {
                ...state, 
                name: state.name,
                lname: state.lastname,
                answered: false,
                experiencia:"therapist/cv", 
                img: "usuarios/placeholders/none-user.png",
                stripeId: "",
                charges_enabled: false, 
            }, 
            email: email, 
            password: password
        })
    }


    const logout = () => {
        return firebase.auth().signOut()
    }

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                user.getIdTokenResult()
                .then( idTokenResult => {
                    api.defaults.headers.common["Authorization"] = `Bearer ${idTokenResult.token}`
                    if (idTokenResult.claims.role === "user") {
                        api.get(`/u/${user.uid}`)
                        .then(res => {
                            dispatch({
                                type: 'FB_AUTH_STATE_CHANGED',
                                payload: {
                                    isAuthenticated: true,
                                    user: {
                                        uid: user.uid,
                                        name: res.data.name,
                                        lname: res.data.lname,
                                        img: user.photoURL,
                                        email: user.email,
                                        age: res.data.age,
                                        payment_met: res.data.payment_met,
                                        answered: res.data.answered,
                                        phone: res.data.phone,
                                        role: idTokenResult.claims.role,
                                        token: idTokenResult.token,
                                    },
                                },
                            })
                        })
                    } else {
                        api.get(`/t/${user.uid}`)
                        .then(res => {
                            dispatch({
                                type: 'FB_AUTH_STATE_CHANGED',
                                payload: {
                                    isAuthenticated: true,
                                    user: {
                                        uid: user.uid,
                                        name: res.data.name,
                                        lname: res.data.lname,
                                        img: user.photoURL,
                                        email: user.email,
                                        age: res.data.age,
                                        payment_met: res.data.payment_met,
                                        answered: res.data.answered,
                                        phone: res.data.phone,
                                        role: idTokenResult.claims.role,
                                        token: idTokenResult.token,
                                    },
                                },
                            })
                        })
                    }
                })
            } else {
                dispatch({
                    type: 'FB_AUTH_STATE_CHANGED',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                    },
                })
            }
        })

        return unsubscribe
    }, [dispatch])

    if (!state.isInitialised) {
        return <MatxLoading />
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'FIREBASE',
                createUserWithEmailAndPassword,
                createTherapistWithEmailAndPassword,
                signInWithEmailAndPassword,
                signInWithGoogle,
                logout,
                assignUserRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthContext
