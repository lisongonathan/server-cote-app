const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { createServer } = require('node:http');

const { join } = require('node:path');
const { Server} = require('socket.io');


const PORT = process.env.PORT || 3000

//API-REALSTREAM
const server = createServer(app);
const io = new Server(server)
let usersConnected = []
let currentChats = []

const baseUrl = 'http://172.20.10.5:8181';
// const baseUrl = 'https://whynot-api.alwaysdata.net';

const updateUser = async () => {
  const req = await fetch(`${baseUrl}/contact-listUsers`)
  const resp = await req.json()

  if (resp.code == 200) {
    console.log(resp.data.users)
    io.emit('listUsers', {success: true, data : resp.data.users}); // Informer tous les utilisateurs connectés

  } else {
    io.emit('listUsers', {success: false, message : resp.data.message});
    
  }
}

const addPieceUser = async (data) => {
    try {
      const response = await fetch(
        `${baseUrl}/chat-addPiece`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      
      if (result.code == 200) {
        const friendSocket = usersConnected.find(
          user => user.pseudo == data.user
        )
        
        if(friendSocket) { 
          console.log(friendSocket)     
          friendSocket.emit(
            'addPiece',
            {
              success: true, 
              data: result.data 
            }
          )
        }

      } else {
        const friendSocket = usersConnected.find(
          user => user.pseudo == data.user
        )

        if(friendSocket) {      
          console.log(friendSocket)   
          friendSocket.emit(
            'addPiece',
            {
              success: false, 
              data: result.data.message
            }
          )
        }
      }
    } catch (error) {
      console.log(error)
      socket.emit('signinResponse', { success: false, message: error });
    }
}

io.on('connect', (socket) => {

  socket.on('disconnect', () => {
    console.log('users connected', usersConnected)
    usersConnected = usersConnected.filter(user => user.pseudo !== socket.pseudo)

    socket.emit('register', usersConnected)

  })

  socket.on('listUsers', data=>{
    updateUser()
  })


  socket.on('new_insert', (data) => {
    console.log('infos : ', data);

    io.emit('new_insert', data.description)
  });

  socket.on('register', (client) => {
    socket.pseudo = client.id
    usersConnected.push(socket)
  })

  socket.on('signin', async (data) => {
    try {
      const response = await fetch(
        `${baseUrl}/user-signup`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      
      if (result.code == 200) {

        await updateUser()

      } else {
        socket.emit('signinResponse', { success: false, message: result.data.message });
      }
    } catch (error) {
      console.log(error)
      socket.emit('signinResponse', { success: false, message: 'Erreur lors de l\'inscription' });
    }
  })

  socket.on('login', async (data) => {
    try {
      const response = await fetch(
        `${baseUrl}/user-login`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      
      const result = await response.json();
      
      if (result.code == 200) {
        socket.emit('loginResponse', {success:true, data: result.data})
        await updateUser()

      } else {
        socket.emit('loginResponse', { success: false, message: result.data.message });
      }
    } catch (error) {
      console.log(error)
      socket.emit('loginResponse', { success: false, message: error.toString() });
    }
  })

  socket.on('updatingPiecesUser', async (data) => {
    try {
      const response = await fetch(
        `${baseUrl}/user-pieces`,
        {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      
      if (result.code == 200) {
        socket.emit('updatingPiecesUser', {success:true, data: result.data})
        
      } else {
        socket.emit('updatingPiecesUser', { success: false, message: result.data.message });
      }
    } catch (error) {
      console.log(error)
      socket.emit('updatingPiecesUser', { success: false, message: error });
    }
  })

  socket.on('updatingSoldeUser', async (data) => {
    try {
      const response = await fetch(
        `${baseUrl}/user-solde`,
        {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      
      if (result.code == 200) {
        socket.emit('updatingSoldeUser', {success:true, data: result.data})

      } else {
        socket.emit('updatingSoldeUser', { success: false, message: result.data.message });
      }
    } catch (error) {
      console.log(error)
      socket.emit('updatingSoldeUser', { success: false, message: error });
    }
  })

  socket.on('signout', async (data) => {
    try {
      const response = await fetch(
        `${baseUrl}/user-disconnect`,
        {
        method: "POST", // or 'PUT'
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        }
      );
  
      const result = await response.json();
      
      if (result.code == 200) {
        socket.emit('signout', {success:true, message: result.data})

        await updateUser()

      } else {
        socket.emit('signout', { success: false, message: result.data.message });
      }
    } catch (error) {
      console.log(error)
      socket.emit('signout', { success: false, message: error });
    }
  })

  socket.on('updatePhoto', async data => {
    await updateUser()
    
  })

  socket.on('updateIdentite', async data => {
    await updateUser()
  })

  socket.on('updateSecret', async data => {
    await updateUser()
  })

  socket.on('sendPiece', async data => {
    // console.log('users rooms', socket)
    try {
      const response = await fetch(
        `${baseUrl}/contact-sendPiece`,
        {
          method: "POST", // or 'PUT'
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      if (result.code == 200) {
        socket.emit('sendPiece', {success:true, data: result.data})
        
        const friendSocket = usersConnected.find(user => user.pseudo == data.friend)
       
        if(friendSocket) {
          friendSocket.emit(
            'sendPiece', 
            {
              success:true, 
              data: {
                pieces : result.data.totalFriend
              } 
            }
          )

        }
      } else {
        socket.emit('sendPiece', { success: false, message: result.data.message });
      }
    } catch (error) {
      console.log(error)
      socket.emit('sendPiece', { success: false, message: error });
    }
  })

  socket.on('writingMessage', async data => {
    
    const friendSocket = usersConnected.find(
      user => user.pseudo == data.friend
    )

    if(friendSocket) {      
      friendSocket.emit(
        'writingMessage',
        {
          success: data.statut, 
          message: "Entrain d'écrire..." 
        }
      )
    }
  })

  socket.on('sendMessage', data => {
    const message = data.data;
    
    if (currentChats) {
      const isChat = currentChats.find(chat => chat.id == message.chat)
  
      if (isChat) {
        if (isChat.user2) {
          if (isChat.user1.id == message.user) {
            isChat.user2.compt = isChat.user2.compt + 1
            
            if (isChat.user2.compt == 8) {
              addPieceUser({user: isChat.user2.id})
              isChat.user2.compt = 0
            }
            
          } else {
            isChat.user1.compt = isChat.user1.compt + 1 

            if (isChat.user1.compt == 4) {
              addPieceUser({user: isChat.user1.id})
              isChat.user1.compt = 0
            }
          }
          
        } else {
          if (isChat.user1.id != message.user) {
            isChat.user2 = {
              id: message.user,
              compt: 0
            }
            isChat.user1.compt = isChat.user1.compt + 1
          } 
        }
      } else {
        currentChats.push({
          id : message.chat,
          user1: {
            id: message.user,
            compt: 0
          },
          user2: false
        })
  
      }
      
      socket.emit('statBonus', isChat)
    } else {
      currentChats.push({
        id : message.chat,
        user1: {
          id: message.user,
          compt: 0
        },
        user2: false
      })
      
    }
    console.log('Liste des chats => ', currentChats)


    io.emit('sendMessage', data)
  })
})

//API-RESTFULL
const userRoutes = require('./routes/userRoutes');
const logsRoutes = require('./routes/logsRoutes');
const dashRoutes = require('./routes/dashboardRoutes')

app.use(bodyParser.json());

//Routes Api
app.use('/user', userRoutes)
app.use('/logs', logsRoutes)
app.use('/dash', dashRoutes)


server.listen(PORT, () => {
  console.log('server running at http://localhost:' + PORT);
});