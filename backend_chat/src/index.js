import { WebSocketServer } from 'ws';
const wss = new WebSocketServer({ port: 8080 });
let socket_arr = [];
wss.on('connection', function connection(server) {
    server.on("message", (e) => {
        //@ts-ignore
        const parsedmssg = JSON.parse(e);
        console.log("one");
        if (parsedmssg.type === "join") {
            socket_arr.push({
                socket: server,
                RoomID: parsedmssg.payload.RoomID,
                UserID: parsedmssg.payload.UserID
            });
            console.log(parsedmssg.payload.RoomID);
            console.log(parsedmssg.payload.UserID);
            console.log("two");
        }
        if (parsedmssg.type === "chat") {
            console.log("three - chat");
            //const room_id = socket_arr.find((x) => x.socket===server ).RoomID ;
            let roomid = undefined;
            for (let i = 0; i < socket_arr.length; i++) {
                if (socket_arr[i].socket == server)
                    roomid = socket_arr[i].RoomID;
            }
            for (let i = 0; i < socket_arr.length; i++) {
                if (socket_arr[i].RoomID == roomid) {
                    socket_arr[i].socket.send(parsedmssg.payload.message);
                }
            }
            // console.log(parsedmssg.payload.message);
            console.log(socket_arr);
        }
    });
});
