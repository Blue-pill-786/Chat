const Chat = () => {
  const { data } = useContext(ChatContext);

  if (!data.chatId) {
    return (
      <div className="chat empty">
        <span className="noChatText">
          Select a conversation to start chatting
        </span>
      </div>
    );
  }

  return (
    <div className="chat">
      <div className="chatInfo">
        <span>{data.user?.displayName}</span>
        <div className="chatIcons">
          <img src={Cam} alt="Video call" />
          <img src={Add} alt="Add user" />
          <img src={More} alt="More options" />
        </div>
      </div>

      <Messages />
      <Input />
    </div>
  );
};
