// const {
//   createVotation,
//   getVotations,
//   incrementVote,
//   incrementVotes,
//   getVotation,
// } = require("../socket/socket");

// class Sockets {
//   constructor(io) {
//     this.io = io;

//     this.socketEvents();
//   }

//   socketEvents() {
//     // On connection
//     this.io.on("connect", async (socket) => {
//       // Escuchar cuando el cliente cree una votacion

//       socket.on("create-votation", async (payload) => {
//         // const votation = await createVotation(payload);
//         try {
//           console.log("create-votation",payload);
//           await createVotation(payload);
//           this.io.emit("get-votations", await getVotations());
//         } catch (error) {
//           console.log(error);
//         }
//       });

//       socket.on("get-votations", async () => {
//         console.log("get-votations");
//         socket.emit("get-votations", await getVotations());
//       });

//       socket.on("increment-vote", async (payload) => {
//         console.log("increment-vote");
//         const { id } = payload;
//         await incrementVote(id);
//         this.io.emit("get-votations", await getVotations());
//       });

//       socket.on("increment-votes", async (payload) => {
//         console.log("increment-votes");
//         // idVotes es un array de ids
//         // console.log(payload);
//         const { idVotes, idVotation } = payload;
//         if (!(idVotes.length > 0)) return;
//         await incrementVotes(idVotes);
//         this.io.emit("get-votation", await getVotation(idVotation));
//       });
//       // socket.on("create-votation", async (votation) => {
//       //   await createVotation(votation);
//       //   this.io.emit("get-votations", await getVotations());
//       // });
//     });
//     // On disconnection
//     this.io.on("disconnect", () => {
//       console.log("cliente desconectado");
//     });
//   }
// }

// module.exports = Sockets;
