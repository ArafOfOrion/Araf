import { React, useState, useRef } from 'react';
import { Alert, ScrollView, Dimensions, SafeAreaView, Text, StyleSheet, TextInput, TouchableHighlight, Image } from 'react-native'; 
import getCookie from './files/Cookies';

function generateId() {
    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
    length = Math.floor(Math.random() * chars.length);
    var str = '';
    for (var i = 0; i < length; i++) {
      str += chars[Math.floor(Math.random() * chars.length)];
    }
    return str;
  }

const { width, height } = Dimensions.get('window');
const cookie = getCookie();
const userid = cookie.get("userid");
if (userid == undefined) {
cookie.set("userid", {key: generateId()}, {path: '/', maxAge: new Date(Date.now()+2592000)});
}

function getUserId() {
    const newUserId = cookie.get("userid");
    return newUserId.key;
}

function ChatWindow(props) {
    const [userMessage, setUserMessage] = useState("");
    const [isTextInputFocused, setFocused] = useState(false);
    const styles = StyleSheet.create({
        mainSafeAreaView: {
            flex: 1,
            backgroundColor: 'white'
        },
        bottomSafeAreaView: {
            flex: 1,
            alignItems: 'center',
            position: 'absolute', 
            top: '93%', 
            left: '2%',
            bottom: '2%',
            marginBottom: '10%',
            flexDirection: 'row',
            justifyContent: 'space-between'
        },
        userMessageTextInput:  {
            height: 40,
            width: width / 1.2,
            borderColor: isTextInputFocused == true ? "blue" : "gray",
            alignItems: 'center', 
            borderWidth: 1,
            borderRadius: 20,
            paddingLeft: 10,
            paddingRight: 10
        },
        sendButton: { 
            marginLeft: 5,
            height: 40,
            width: 40,
        },
        usersMessage: {
            backgroundColor: "#3386ff",
            borderRadius: 20,
            padding: 7,
            margin: 3,
            color: "white",
            textAlign: "center"
        },
        userMessageAreaView: {
            flexDirection: "row",
            justifyContent: "flex-end",
            marginRight: 10
        },
        botMessage: {
            backgroundColor: "#e7e0e0",
            borderRadius: 20,
            padding: 7,
            margin: 3,
            color: "black",
            textAlign: "center"
        },
        botMessageAreaView: {
            flexDirection: "row",
            justifyContent: "flex-start",
            marginLeft: 10
        },
        scrollArea: {
            marginTop: 40,
            flex: 1,
            marginBottom: 80
        }
    }) 
    const [userMessagesSent, setUserMessagesSent] = useState([
        {sentBy: "araf", content: "Hello my friend! Please say something!"},
    ]);
    const scrollViewRef = useRef();
    function sendMessage(messageSent) {
        if (messageSent == "") {
            Alert.alert("Warning", "Message cannot be empty");
            return;
        }
        setUserMessagesSent(prevState => ([...prevState, {sentBy: "user", content: messageSent}]));
        setUserMessage("");
        const axios = require("axios");
        const options = {
        method: 'GET',
        url: 'https://random-stuff-api.p.rapidapi.com/ai',
        params: {
            msg: userMessage,
            bot_name: 'Araf',
            bot_gender: 'male',
            bot_master: 'Araf',
            bot_age: '15',
            bot_company: 'HS International (Araf\'s Company)',
            bot_location: 'Araf\'s Computer',
            bot_email: 'kamrozzaman.azad@gmail.com',
            bot_build: 'Public',
            bot_birth_year: '2007',
            bot_birth_date: '30th September, 2007',
            bot_birth_place: 'Araf\'s House',
            bot_favorite_color: 'Cyan',
            bot_favorite_book: 'Science Book',
            bot_favorite_band: 'Nothing',
            bot_favorite_artist: 'Leonardo Da Vinci',
            bot_favorite_actress: 'Nobody',
            bot_favorite_actor: 'Burak and Engin Atlan',
            id: getUserId()
        },
        headers: {
            Authorization: '', // Random Stuff Api authorization token
            'X-RapidAPI-Host': 'random-stuff-api.p.rapidapi.com',
            'X-RapidAPI-Key': '', // Rapid APi key
            useQueryString: true
        }
        };
        axios.request(options).then(function (response) {
            setUserMessagesSent(prevState => ([...prevState, {sentBy: "araf", content: response.data.AIResponse}]));
        }).catch(function (error) {
            setUserMessagesSent(prevState => ([...prevState, {sentBy: "araf", content: "I am having some trouble. Please try later!"}]));
        });
    }
    return (
        <SafeAreaView style={styles.mainSafeAreaView}>
            <ScrollView 
                style={styles.scrollArea}
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
            >
                {
                    userMessagesSent.map((item, index) =>
                        <SafeAreaView key={index} style={item.sentBy == "user" ? styles.userMessageAreaView : styles.botMessageAreaView}>
                            <Text key={index} style={item.sentBy == "user" ? styles.usersMessage : styles.botMessage}>{item.content}</Text>
                        </SafeAreaView>
                    )
                }
            </ScrollView>
            <SafeAreaView style={styles.bottomSafeAreaView}>
                <TextInput
                    value={userMessage}
                    style={styles.userMessageTextInput}
                    placeholder="Enter a message"
                    onChangeText={(text) => setUserMessage(text)}
                    onFocus={() => setFocused(true)}
                    onSubmitEditing={() => setFocused(false)}
                    onEndEditing={() => setFocused(false)}
                />
                <TouchableHighlight 
                    onPress={() => sendMessage(userMessage.trim())}
                    underlayColor={'white'}
                >
                    <Image 
                        source={require(".././assets/send.png")}
                        style={styles.sendButton}
                        resizeMode='cover'
                    />
                </TouchableHighlight>
            </SafeAreaView>            
        </SafeAreaView> 
    );
}

export default ChatWindow;
