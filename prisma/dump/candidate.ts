type Candidate = {
  name: string;
  age: number;

  photoProfileUrl: string;
  photoProfileAlt: string;
};
export const candidateData: Candidate[] = [
  {
    name: "John Doe",
    age: 42,
    photoProfileUrl: "johndoe.com",
    photoProfileAlt: "johndoe",
  },
  {
    name: "Alice",
    age: 35,
    photoProfileUrl: "alice.com",
    photoProfileAlt: "alice",
  },
  {
    name: "Bob",
    age: 47,
    photoProfileUrl: "bob.com",
    photoProfileAlt: "bob",
  },
];
