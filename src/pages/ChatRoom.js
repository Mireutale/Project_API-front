import { useEffect, useState } from "react";

// 채팅방 목록 컴포넌트
const ChatList = ({ userId, onSelectChatroom }) => {
  const [chatrooms, setChatrooms] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/chats`)
      .then((res) => res.json())
      .then((data) => setChatrooms(data.chatrooms || [])) // data.chatrooms가 undefined일 경우 빈 배열로 처리
      .catch((err) => console.error("채팅방 목록 불러오기 실패:", err));
  }, [userId]);

  return (
    <div>
      <h2>채팅 목록</h2>
      {chatrooms.length > 0 ? (
        <ul>
          {chatrooms.map((room) => (
            <li key={room.id}>
              <button onClick={() => onSelectChatroom(room.id, room.chat_seller, room.chat_buyer)}>
                {room.id}번 채팅방 (상품 ID: {room.product_id})
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>참여한 채팅방이 없습니다.</p>
      )}
    </div>
  );
};

// 채팅방 컴포넌트
const ChatRoom = ({ chatroomId, userId, sellerId, buyerId }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // WebSocket 연결
    const ws = new WebSocket(`ws://localhost:8000/ws/${chatroomId}/${userId}`);
    ws.onmessage = (event) => {
      try {
        const messageData = JSON.parse(event.data); // 서버에서 온 메시지가 JSON 형태라고 가정
        setMessages((prev) => [...prev, messageData]); // 메시지를 추가
      } catch (error) {
        console.error("WebSocket 메시지 처리 오류:", error);
      }
    };
    ws.onclose = () => console.log("WebSocket 연결 종료");

    setSocket(ws);

    return () => ws.close();
  }, [chatroomId, userId]);

  const sendMessage = () => {
    if (socket && message.trim()) {
      const msgData = {
        sender_id: userId,
        receiver_id: userId === sellerId ? buyerId : sellerId, // 상대방에게 보낼 메시지
        content: message,
      };
      socket.send(JSON.stringify(msgData)); // 서버로 메시지 전송
      setMessages((prev) => [...prev, msgData]); // 본인 메시지도 화면에 표시
      setMessage(""); // 입력 필드 초기화
    }
  };

  return (
    <div>
      <h2>채팅방 {chatroomId}</h2>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender_id === userId ? "나" : `유저 ${msg.sender_id}`}</strong>: {msg.content}
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
const ChatApp = ({ userId }) => {
  const [selectedChatroom, setSelectedChatroom] = useState(null);
  const [sellerId, setSellerId] = useState(null);
  const [buyerId, setBuyerId] = useState(null);

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
