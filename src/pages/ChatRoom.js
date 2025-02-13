import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import  "../css/chatroom.css";

// 채팅방 목록 컴포넌트
const ChatList = ({ userId, onSelectChatroom }) => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    fetch("http://localhost:8000/chats", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setChatrooms(data.chatrooms || []))
      .catch((err) => console.error("채팅방 목록 불러오기 실패:", err));
  }, [userId]);

  return (
    <div className="chat-list-container">
      <h2 className="chat-list-title">채팅 목록</h2>
      {chatrooms.length > 0 ? (
        <ul className="chat-list">
          {chatrooms.map((room) => (
            <li key={room.id} className="chat-list-item">
              <button
                onClick={() => {
                  // seller_id와 receiver_id가 동일한지 확인
                  if (room.chat_seller === room.chat_buyer) {
                    alert("Seller와 Buyer가 동일합니다. 채팅방을 선택할 수 없습니다.");
                    return;  // 동일하면 onSelectChatroom을 호출하지 않음
                  }
                  // seller_id와 receiver_id가 다르면 onSelectChatroom 호출
                  onSelectChatroom(room.id, room.chat_seller, room.chat_buyer);
                  }}>
                  {room.id}번 채팅방 (상품 ID: {room.product_id})
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-chatrooms">참여한 채팅방이 없습니다.</p>
      )}
    </div>
  );  
};

const ChatRoom = ({ chatroomId, userId, sellerId, buyerId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);
  const [socketStatus, setSocketStatus] = useState("connecting");
  const [pendingMessages, setPendingMessages] = useState([]);

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 메시지 불러오기
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/chats/${chatroomId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setMessages(response.data.messages || []);
      } catch (error) {
        console.error("메시지 불러오기 실패", error);
      }
    };

    fetchMessages();

    // WebSocket 연결 설정
    const ws = new WebSocket(`ws://localhost:8000/chats/${chatroomId}/messages?user_id=${userId}`);

    ws.onopen = () => {
      setSocketStatus("open");
      console.log("WebSocket 연결 성공");

      // 연결된 상태에서 대기 중인 메시지 전송
      pendingMessages.forEach((msg) => {
        ws.send(JSON.stringify(msg));
      });
      setPendingMessages([]); // 대기 중인 메시지 초기화
    };

    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data);
        setMessages((prev) => [...prev, messageData]);
      } catch (error) {
        console.error("WebSocket 메시지 처리 오류:", error);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket 에러:", error);
    };

    ws.onclose = () => {
      setSocketStatus("closed");
      console.log("WebSocket 연결 종료");
    };

    setSocket(ws);

    // WebSocket 연결 상태를 계속 확인하는 setInterval
    const checkConnection = setInterval(() => {
      if (ws.readyState === WebSocket.CLOSED || ws.readyState === WebSocket.CLOSING) {
        console.log("WebSocket이 끊어졌습니다. 재연결 시도 중...");
        // 재연결을 위한 코드 추가
        setSocket(new WebSocket(`ws://localhost:8000/chats/${chatroomId}/messages?user_id=${userId}`));
      }
    }, 50000); // 50초마다 연결 상태 체크

    // 컴포넌트 언마운트 시 clean up
    return () => {
      clearInterval(checkConnection); // setInterval 제거
      ws.close(); // WebSocket 연결 종료
    };
  }, [chatroomId, userId, pendingMessages]);

  const sendMessage = async () => {
    if (message.trim()) {
      const accessToken = localStorage.getItem("access_token");
      const msgData = {
        id: 0,
        chatroom_id: chatroomId,
        sender_id: userId,
        receiver_id: userId === sellerId ? buyerId : sellerId,
        content: message,
        sent_at: new Date().toISOString(),
      };

      try {
        // 메시지 서버로 전송
        const response = await axios.post(
          `http://localhost:8000/chats/${chatroomId}/messages`,
          msgData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        setMessages((prev) => [...prev, response.data]);
        setMessage("");

        // WebSocket이 연결되었으면 메시지를 바로 전송
        if (socket && socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(msgData)); // 웹소켓으로 메시지 전송
        } else {
          // WebSocket 연결되지 않으면 메시지를 대기 중으로 저장
          setPendingMessages((prev) => [...prev, msgData]);
          console.log("WebSocket이 연결되지 않았습니다. 메시지가 대기 중입니다.");
        }
      } catch (error) {
        console.error("메시지 전송 실패", error);
      }
    }
  };

  return (
    <div>
      <h2>채팅방 {chatroomId}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender_id === userId ? "나" : `상대방`}</strong>: {msg.content}
          </p>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={sendMessage}>전송</button>
    </div>
  );
};


// 전체 채팅 애플리케이션 컴포넌트
const ChatApp = () => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);
  const accessToken = localStorage.getItem("access_token");
  const decodedToken = jwtDecode(accessToken); // access_token 디코딩
  const userId = decodedToken.id; // JWT payload에서 user_id 추출
  return (
    <div>
      {selectedChatroom ? (
        <ChatRoom chatroomId={selectedChatroom} userId={userId} sellerId={sellerId} buyerId={buyerId} />
      ) : (
        <ChatList
          userId={userId}
          onSelectChatroom={(id, seller, buyer) => {
            setSelectedChatroom(id);
            setSellerId(seller);
            setBuyerId(buyer);
          }}
        />
      )}
    </div>
  );
};

export default ChatApp;
