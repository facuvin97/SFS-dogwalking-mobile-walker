import React, { createContext, useState, useContext, useEffect, useCallback  } from 'react';
import { useUserLog } from './UserLogContext';
import { useWebSocket } from '../contexts/WebSocketContext';
import { getToken } from '../utils/authStorage';
import globalConstants from '../const/globalConstants';

const ChatsContext = createContext();

export const useChatsContext = () => useContext(ChatsContext);

export const ChatsProvider = ({ children }) => {
  const [usersWithChat, setUsersWithChat] = useState([]); // Estado para almacenar los chats del usuario
  const [userWithUnreadMessage, setUserWithUnreadMessage] = useState(new Set()); // Estado para almacenar el id del usuario con mensajes no leidos en un Set
  const [unreadChatsCount, setUnreadChatsCount] = useState(0); // Estado para almacenar el número de chats con mensajes no leídos
  const { userLog } = useUserLog();
  const socket = useWebSocket();



  

  const removeUnreadChat = async (chatId) => {
    try {
      setUserWithUnreadMessage((prevUnreadChats) => {
        const updatedUnreadChats = new Set(prevUnreadChats); // Crear una copia del Set
        updatedUnreadChats.delete(chatId); // Eliminar el ID del Set
        return updatedUnreadChats;
      });
      setUnreadChatsCount((prevCount) => (prevCount > 0 ? prevCount - 1 : 0));
      setUsersWithChat((prevUsersWithChat) => 
        prevUsersWithChat.map((user) => 
          user.id === chatId 
            ? { ...user, lastMessageReceived: { ...user.lastMessageReceived, read: true } }
            : user
        )
      );
    } catch (error) {
      console.error('Error al eliminar el chat de los no leidos:', error);
    }

  };
  
  

  const fetchUsersChats = async () => {
    try {
      const token = await getToken();

      let response;

      response = await fetch(`${globalConstants.URL_BASE}/contacts/clients/${userLog.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener la respuesta del servidor');
      }
      const data = await response.json();
      setUsersWithChat(data.body);
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }
  };

  const fetchUnreadChats = async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${globalConstants.URL_BASE}/unread/${userLog.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      if (data.body.length > 0) {
        // Crea un conjunto para almacenar senderId únicos
        const uniqueSenderIds = new Set();
  
        // Recorre los mensajes y agrega los senderId al conjunto
        data.body.forEach(message => {
          uniqueSenderIds.add(message.senderId);
        });
  
        setUserWithUnreadMessage(uniqueSenderIds);
      }
    } catch (error) {
      console.error('Error al obtener los clientes:', error);
    }        
  }

  //useEffect que actualiza el contador cada vez que cambia el estado de unreadChats
  useEffect(() => {
    setUnreadChatsCount(userWithUnreadMessage.size);
  }, [userWithUnreadMessage]);
  
  // useEffect que carga los estados de los chats del usuario logueado
  useEffect(() => {
    if (userLog) {
      fetchUsersChats(); 
      fetchUnreadChats();
    } else { // si no hay usuario logueado, limpia el estado de chats
      setUsersWithChat([]);
      setUserWithUnreadMessage(new Set());
      setUnreadChatsCount(0);
    }
  }, [userLog]);

  const addChat = async (userChat) => {
    // agrego el chat recibido al estado
    setUsersWithChat((prevChats) => [...prevChats, userChat]);
  }

  const addUnreadChat = (userId) => {
    setUserWithUnreadMessage((prevChats) => {
      const newChats = new Set(prevChats); // Crea un nuevo Set basado en el anterior
      newChats.add(userId); // Agrega el nuevo userId
      return newChats; // Retorna el nuevo Set
    });
  };

  useEffect(() => {
    try {
      // Definimos `handleNewMessage` dentro del useEffect para que siempre acceda a los valores más recientes de usersChats y unreadChats
      const handleNewMessage = async (newMessage) => {

        if (newMessage.senderId === userLog.id) return; // No se procesa el mensaje de mi mismo

        const token = await getToken();

        // me traigo la info del mensaje nuevo desde la api para tener los datos completos
        const response = await fetch(`${globalConstants.URL_BASE}/messages/single/${newMessage.id}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });


        const data = await response.json();
        const fullMessage = data.body;

        

        // chequeo si el senderId que viene en el mensaje, ya existe en el estado
        const existingChat = usersWithChat.find((chat) => {
          return chat.id === newMessage.senderId;
        });

        let existingUnreadChat;

        if (userWithUnreadMessage.size > 0) {
          // chequeo si el senderId ya está en el estado de unreadChats
          existingUnreadChat = userWithUnreadMessage.has(newMessage.senderId);
        }

        // si no existia ya un chat con ese usuario, busco el cliente con el senderId que me llega con el mensaje y lo agrego al estado
        if (!existingChat) {

          // hago un fetch para obtener el cliente que envia con el senderId
          const response = await fetch(`${globalConstants.URL_BASE}/clients/body/${newMessage.senderId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          const user = await response.json();      

          // agrego el usuario a los estados
          addChat(user.body);
          addUnreadChat(user.body.id);
          // si existe el chat, pero no está en el estado de unreadChats, lo agrego
        } else if (existingChat && !existingUnreadChat) { 
          // modifico el estado usersChats para asignarle el ultimo mensaje al chat en el atributo lastMessage
          setUsersWithChat((prevUsersWithChat) => {

            const updatedUsersChats = [...prevUsersWithChat]; // Crear una copia de los chats existentes
            const chatIndex = updatedUsersChats.findIndex((chat) => chat.id === newMessage.senderId);
            updatedUsersChats[chatIndex].lastMessage = fullMessage;
            if (fullMessage.receiverId === userLog.id) {
              updatedUsersChats[chatIndex].lastMessageReceived = fullMessage;
            }
            return updatedUsersChats;
          });


          addUnreadChat(newMessage.senderId);
        }
      
        setUsersWithChat((prevUsersWithChat) => {
          const updatedChats = [...prevUsersWithChat]; // Crear una copia de los chats existentes 
          const orderedChats = updatedChats.sort((b, a) => new Date(a.lastMessage?.createdAt) - new Date(b.lastMessage?.createdAt));
          return orderedChats; // Actualiza el estado con los chats ordenados
        });
      };
      // Vinculamos el evento del socket dentro del useEffect
      if (!socket) return;
      socket.on('receiveMessage', handleNewMessage);

      // Cleanup para eliminar el evento cuando se desmonte el componente o cambie socket
      return () => socket.off('receiveMessage', handleNewMessage);

    } catch (error) {
      console.error("Error al ejecutar useEffect", error);
    }
    
    




  }, [socket, usersWithChat, userWithUnreadMessage]); // Dependencias para que el useEffect se actualice con los valores más recientes



  return (
    <ChatsContext.Provider
      value={{ removeUnreadChat, usersWithChat, addChat, userWithUnreadMessage, setUserWithUnreadMessage, unreadChatsCount, setUnreadChatsCount, setUsersWithChat }}
    >
      {children}
    </ChatsContext.Provider>
  );
};
