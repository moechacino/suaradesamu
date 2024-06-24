export class VoterValidator {
  static addVoter(): object {
    const schema = {
      body: {
        type: "object",
        required: ["nik", "nfcSN", "name"],
        properties: {
          nik: { type: "string" },
          nfcSN: { type: "string" },
          name: { type: "string" },
        },
      },
    };
    return schema;
  }
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
        required: ["nik", "candidateId"],
        properties: {
          nik: { type: "string" },
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
        required: ["privateKey"],
        properties: {
          privateKey: { type: "string" },
        },
      },
    };
    return schema;
  }
}
