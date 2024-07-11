import React, { useEffect, useState, createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Input,
  Typography,
  Dialog,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { PlusIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";
import { db } from "../../firebase/firebase";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  or,
} from "firebase/firestore";
import { useAuth } from '../../context/authContext/';

export function Chat() {
  const { userLoggedIn, dbUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const selectedChatContext = createContext(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [uniqueChatList, setUniqueChatList] = useState([]);
  const [uniqueUsersList, setUniqueUsersList] = useState([]);
  const [initalized, setInitialized] = useState(false);
  const [finalInit, setFinalInit] = useState(false);
  const [recruiter, setRecruiter] = useState(null);
  const [jobTitle, setJobTitle] = useState(null);
  const [newMessagePost, setNewMessagePost] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(!open);

  const handleNewSendMessage = async () => {
    if (newMessagePost.trim()) {
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: recruiter,
        text: `New message for job: ${jobTitle} from ${dbUser.email}`,
        timestamp: Timestamp.now(),
      });
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: recruiter,
        text: newMessagePost,
        timestamp: Timestamp.now(),
      });
      setNewMessagePost("");
      handleOpen();
      window.location.href = '/dashboard/home';
    }
  };

  const handleNewKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (finalInit && recruiter) {
      handleOpen();
    } else {
      setSelectedChat(uniqueUsersList[0]);
    }
  }, [finalInit]);

  useEffect(() => {
    if (initalized) {
      try {
        const q = query(
          collection(db, "users"),
          where("email", "in", uniqueChatList),
          orderBy("createdAt")
        );
        const unsubscribe2 = onSnapshot(q, (snapshot) => {
          setUniqueUsersList(snapshot.docs.map((doc) => doc.data()));
          setFinalInit(true);
        });
        return () => unsubscribe2();
      } catch (err) {
        console.log(err);
        setFinalInit(true);
      }
    }
  }, [initalized]);

  useEffect(() => {
    if (!dbUser) return;
    const q = query(
      collection(db, "messages"),
      or(
        where("from", "==", dbUser.email),
        where("to", "==", dbUser.email)
      ),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUniqueChatList([
        ...new Set(snapshot.docs.map((doc) => doc.data().to)),
      ]);
      setInitialized(true);
      const urlParams = new URLSearchParams(window.location.search);
      setRecruiter(urlParams.get('reference'));
      setJobTitle(decodeURI(urlParams.get('job')));
    });
    return () => unsubscribe();
  }, [dbUser]);

  useEffect(() => {
    if (!selectedChat) return;
    const q = query(
      collection(db, "messages"),
      where("to", "==", selectedChat.email),
      orderBy("timestamp")
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data()
      })));
    });
    return () => unsubscribe();
  }, [selectedChat]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      await addDoc(collection(db, 'messages'), {
        from: dbUser.email,
        to: selectedChat.email,
        text: newMessage,
        timestamp: Timestamp.now(),
      });
      setNewMessage("");
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredChats = uniqueUsersList.filter((chat) =>
    chat.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 100px)' }}>
      <Dialog open={open} handler={handleOpen}>
        <DialogBody>
          <form onSubmit={handleNewSendMessage} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
            <div className="mb-4">
              {recruiter && (
                <Typography variant="regular" color="blue-gray" className="font-medium">
                  Applying for {jobTitle ? jobTitle : null}
                </Typography>
              )}
              <Input
                size="lg"
                placeholder="name@mail.com"
                className="border border-gray-300 rounded-md mt-2"
                value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <Typography variant="small" color="blue-gray" className="font-medium">Add a message</Typography>
              <div className="flex items-center">
                <Input
                  type="text"
                  value={newMessagePost}
                  onChange={(e) => setNewMessagePost(e.target.value)}
                  onKeyPress={handleNewKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 rounded-lg mr-4"
                />
                <Button color="blue" onClick={handleNewSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          </form>
        </DialogBody>
        <DialogFooter>
          <Button variant="text" color="red" onClick={handleOpen} className="mr-1">
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
      <div className="w-full lg:w-1/4 bg-white border-r border-gray-200 p-4 overflow-y-auto" style={{ height: 'calc(100vh - 120px)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center w-full">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search chats..."
              icon={<MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />}
              className="flex-1"
            />
            <Button onClick={handleOpen} variant="gradient" className="ml-2">
              <PlusIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
        {filteredChats && filteredChats.map((chat) => (
          <div
            key={chat.displayName}
            className={`flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-100 ${selectedChat && selectedChat.email === chat.email ? 'bg-gray-100' : ''}`}
            onClick={() => setSelectedChat(chat)}
          >
            <div>
              <Typography variant="small" color="blue-gray" className="font-semibold">
                {chat.displayName}
              </Typography>
              <Typography className="text-xs font-normal text-blue-gray-500">
                {chat.role}
              </Typography>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full lg:flex-1 p-4 bg-white">
        <div className="border border-gray-200 rounded-lg h-full flex flex-col overflow-hidden">
          {selectedChat && (
            <div className="border-b border-gray-200 p-4 flex items-center">
              <Avatar src={selectedChat.img} alt={selectedChat.displayName} size="sm" variant="rounded" />
              <Typography variant="h6" color="blue-gray" className="ml-4">
                {selectedChat.displayName} <span>{selectedChat.email}</span>
              </Typography>
            </div>
          )}
          <selectedChatContext.Provider value={selectedChat}>
            <div className="flex-1 overflow-y-auto p-4">
              {messages.map((message) => (
                <div key={message.data.timestamp} className={`flex ${message.data.from === dbUser.email ? "justify-end" : ""} mb-4`}>
                  <div className={`flex flex-col ${message.data.from === dbUser.email ? "items-end" : "items-start"}`}>
                    <Typography variant="small" color="blue-gray" className='font-semibold'>
                      {message.data.from}
                    </Typography>
                    <Typography className="bg-blue-100 p-2 rounded-md text-blue-gray-800">
                      {message.data.text}
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-500">
                      {message.data.timestamp.toDate().toUTCString()}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </selectedChatContext.Provider>
          {selectedChat && (
            <div className="border-t border-gray-200 p-4">
              <div className="flex items-center">
                <Input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 p-2 rounded-lg mr-4"
                />
                <Button color="blue" onClick={handleSendMessage}>
                  Send
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chat;
