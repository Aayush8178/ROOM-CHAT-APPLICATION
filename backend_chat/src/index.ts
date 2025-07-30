import { WebSocket, WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080, host: '0.0.0.0' });

interface User {
    socket: WebSocket,
    RoomID: string,
    UserID: string,
    imgURL: string
}

let socket_arr: User[] = [];
wss.on('connection', function connection(server) {


    server.on("message", (e) => {
        const parsedmssg = JSON.parse(e.toString());
        console.log("one")
        if (parsedmssg.type === "join") {
            socket_arr.push({
                socket: server,
                RoomID: parsedmssg.payload.RoomID,
                UserID: parsedmssg.payload.UserID,
                imgURL: parsedmssg.payload.imgURL
            });

            // const { RoomID, UserID } = parsedmssg.payload;
            // socket_arr.push({ socket: server, RoomID, UserID });

            console.log(`User ${parsedmssg.payload.UserID} joined room ${parsedmssg.payload.RoomID}`);


            console.log(parsedmssg.payload.RoomID);
            console.log(parsedmssg.payload.UserID)
            console.log("two")
        }

        if (parsedmssg.type === "chat") {
            console.log("three - chat")
            const currentUser = socket_arr.find((x) => x.socket === server);

            // let roomid = undefined;
            // for (let i = 0; i < socket_arr.length; i++) {
            //     if (socket_arr[i].socket == server) roomid = socket_arr[i].RoomID
            // }

            if (!currentUser) return;
            const roomid = currentUser.RoomID
            const outgoing = {
                type: "chat",
                payload: {
                    message: `${currentUser.UserID} :  ${parsedmssg.payload.message}`,
                    imgURL: currentUser.imgURL,
                    UserID: currentUser.UserID
                }
            }

            for (let i = 0; i < socket_arr.length; i++) {
                if (socket_arr[i].RoomID == roomid) {
                    socket_arr[i].socket.send(JSON.stringify(outgoing))
                }
            }

            // const roomUsers = socket_arr.filter(u => u.RoomID === currentUser.RoomID);

            // for (const user of roomUsers) {
            //     user.socket.send(`${currentUser.UserID}: ${parsedmssg.payload.message}`);

            //     // console.log(parsedmssg.payload.message);
            //     //console.log(socket_arr);
            // }
        }
    });

    server.on("close", () => {
        socket_arr = socket_arr.filter(u => u.socket !== server);
    });
});