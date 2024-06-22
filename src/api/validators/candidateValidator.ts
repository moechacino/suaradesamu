export class candidateValidator {
  static create(): object {
    const schema = {
      body: {
        type: "object",
        required: ["name", "age"],
        properties: {
          username: { type: "string" },
          age: { type: "integer" },
        },
      },
    };
    return schema;
  }
}
