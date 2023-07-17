import { useLocation } from "react-router-dom";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import "./Chatroom.css";
import { MainContainer, ChatContainer, MessageList, Message, MessageInput, TypingIndicator} from "@chatscope/chat-ui-kit-react"
import { useState } from "react";
import axios from "axios";

const OPENAI_API_KEY = "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"
const Chatroom = (props) => {
  const [typing, setTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      message: "Hello, I am ChatGPT!",
      sender: "ChatGPT"
    }
  ])

  const handleSend = async (e) => {
    const regex = /(<([^>]+)>)/ig;
    const mess = e.replace(regex, '');
    const newMessage = {
      message: mess,
      sender: "user",
      direction: "outgoing"
    }

    const newMessages = [...messages, newMessage]; // all the old messages, + the new message

    //update our messages state
    setMessages(newMessages);
    console.log(messages);

    //set a typing indicator (chatgpt is typing)
    setTyping(true);
    //process message to chatGPT
    await processMessageToChatGPT(newMessages, mess);
  }

  async function processMessageToChatGPT(chatMessages, message) {
    // chatMessages { sender: "user" or "ChatGPT", message:"The message content here"}
    // apiMessages {role: "user" or "assistant"}
    console.log(message)
    var query = new FormData();
    query.append("query", message);
    axios.post("http://127.0.0.1:3801/api/ai/context",query).then((res) => {
   
      console.log(res);
      setMessages(
        [
          ...chatMessages, {
            message: res.data,
            sender: "ChatGPT"
          }
        ]
      )
      setTyping(false);
      
    })
  }

  const { state } = useLocation();
  return (
    // <div className="container">
      <div className="row">
        <div className="col-md-2"></div>
        <div className="col-md-8">
        <div className="chat-dialog">
        <div className="chat-rectangle">
          <div className="chat-row">
            <div className="chat-icon">
              <img src="chat-icon.png"/>                                 
              <h2> Chat With </h2>
            </div>
            <div className="chat-button">
              <button className="chat-btn-reset">Reset</button>                                
              <button className="chat-btn-close">
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M26 2L2 26" stroke="#131531" stroke-width="3" stroke-linecap="round"/>
                    <path d="M2 2L26 26" stroke="#131531" stroke-width="3" stroke-linecap="round"/>
                    </svg>
              </button>
            </div>               
          </div>
          <div class="chat-line">
          </div>
          <div class="chat-box">
            <MainContainer>
              <ChatContainer>
                <MessageList
                  scrollBehavior="smooth"
                  typingIndicator={typing? <TypingIndicator content="ChatGPT is typing" />: null}
                >
                  {messages.map((message, i) => {
                    return <Message key={i} model={message}  />
                  })}
                </MessageList>
                <MessageInput placeholder="Ask any Question..." onSend={handleSend} />
              </ChatContainer>
            </MainContainer>
          </div>
        </div>
      </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      
    // </div>
  );
};

export default Chatroom;
