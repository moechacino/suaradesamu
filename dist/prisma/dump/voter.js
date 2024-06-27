"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dumpVoter = void 0;
const nfcSN = [
    "7B:Q3:WB:F1:IU",
    "67:58:U4:AE:58",
    "M4:FE:VI:FV:X1",
    "EE:A5:QO:U4:A4",
    "V5:TY:4A:ML:2C",
    "O1:Y6:NB:CM:NS",
];
const pinVoter = ["183562", "093516", "546217", "452617", "562846", "956371"];
// function regexify(pattern: string): string {
//   const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
//   return pattern.replace(/\[A-Z0-9\]\{2\}/g, () => {
//     return (
//       chars.charAt(Math.floor(Math.random() * chars.length)) +
//       chars.charAt(Math.floor(Math.random() * chars.length))
//     );
//   });
// }
// async function getuid(): Promise<string> {
//   let uid: string;
//   const segments: string[] = [];
//   for (let i = 0; i < 5; i++) {
//     segments.push(regexify("[A-Z0-9]{2}"));
//   }
//   uid = segments.join(":");
//   return uid;
// }
exports.dumpVoter = [
    {
        nfsSerialNumber: "04:3E:0C:22:DF:5D:80",
        name: "Priyono NFC",
        NIK: "350204087862271",
        PIN: pinVoter[0],
    },
    {
        nfsSerialNumber: "95:F3:BC:AB",
        name: "Supardi NFC",
        NIK: "350204087862272",
        PIN: pinVoter[1],
    },
    {
        nfsSerialNumber: nfcSN[2],
        name: "User 3",
        NIK: "350204087862273",
        PIN: pinVoter[2],
    },
    {
        nfsSerialNumber: nfcSN[3],
        name: "User 4",
        NIK: "350204087862274",
        PIN: pinVoter[3],
    },
    {
        nfsSerialNumber: nfcSN[4],
        name: "User 5",
        NIK: "350204087862275",
        PIN: pinVoter[4],
    },
    {
        nfsSerialNumber: nfcSN[5],
        name: "User 6",
        NIK: "350204087862276",
        PIN: pinVoter[5],
    },
];
