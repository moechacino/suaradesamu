export class VoterValidator {
  static register(): object {
    const schema = {
      body: {
        type: "object",
        required: ["nfcSN", "pin"],
        properties: {
          nfcSN: { type: "string" },
          pin: { type: "string" },
        },
      },
    };
    return schema;
  }

  static vote(): object {
    const schema = {
      body: {
        type: "object",
        required: ["nik", "address", "phone", "candidateId"],
        properties: {
          nik: { type: "string" },
          address: { type: "string" },
          phone: { type: "string" },
          candidateId: { type: "integer" },
        },
      },
    };
    return schema;
  }

  static getVote(): object {
    const schema = {
      body: {
        type: "object",
        required: ["address", "nfcSN"],
        properties: {
          address: { type: "string" },
          nfcSN: { type: "string" },
        },
      },
    };
    return schema;
  }
}
