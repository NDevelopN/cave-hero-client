import { useState, useEffect, useRef } from 'react';
import {  } from '@mui/material';

import TextBlock from './Components/TextBlock.js';
import ChoiceBlock from './Components/ChoiceBlock.js';

import './App.css';

function App() {
  let [Header, setHeader] = useState("");
  let [Msg, setMsg] = useState([]);
  let [Options, setOptions] = useState([]);

  let once = useRef(true);
  let socket = useRef();

  let endpoint = "ws://localhost:8090/"

  let input = [];


  useEffect(() => {
    if (once.current) {
      once.current = false;
      return;
    }

    connect();

    const timer = setInterval(() => processInput(), 1000)
    
    return () => {
      clearInterval(timer);
    }
  }, []);

  function connect() {
    let sock = new WebSocket(endpoint);

    sock.onopen = onOpen;
    sock.onmessage = onReceive;
    sock.onclose = onClose;
    sock.onerror = (e) => {
      console.error("Websocket issue: " + e.data);
      sock.close();
    }

    socket.current = sock;
  };

  function onOpen() {
    console.log("Connected");
  }

  function onClose() {
    alert("Connection closed.");
  }

  const MsgType = {
    HEADER: 0,
    TEXT: 1,
    OPTION: 2,
  }

  function onReceive(event) {
    input.push(JSON.parse(event.data));
  }

  function processInput() {
    if (input.length > 0) {
      let data = input.shift();
      switch (data.MType) {
        case MsgType.HEADER:
          setHeader(data.Text);
          break;
        case MsgType.TEXT:
          setMsg((prevState) => [...prevState, data.Text]);
          break;
        case MsgType.OPTION:
          setOptions(data.Options);
          setMsg((prevState) => [...prevState, data.Text]);
          break;
        default:
          console.log("Invalid message type received: " + data);
          break;
      }
    }
  }

  function SendMsg(message) {
    if (socket.current === undefined) {
      console.error("Socket is undefined.");
      return;
    }

    socket.current.send(JSON.stringify(message));
  }

  function selectChoice(op) {
      let message = {
        Type: MsgType.TEXT,
        Text: op,
        Options: [],
      }
      
      SendMsg(message);
      setOptions([]);
      setMsg([]);
  }

  return (
    <div className="App">
      <h2>{Header}</h2>
      <TextBlock text={Msg}/>
      {Options.length > 0 ? <ChoiceBlock ops={Options} choose={selectChoice}/> : <></>}
    </div>
  );
}

export default App;
