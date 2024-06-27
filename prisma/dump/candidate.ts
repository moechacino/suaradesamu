type Candidate = {
  name: string;
  age: number;
  noUrut: number;
  photoProfileUrl: string;
  photoProfileAlt: string;
};
export const candidateData: Candidate[] = [
  {
    name: "John Doe",
    age: 42,
    noUrut: 1,
    photoProfileUrl:
      "https://dory-liberal-uniformly.ngrok-free.app/profile/PP_John-Doe.jpeg",
    photoProfileAlt: "PP_John-Doe.jpeg",
  },
  {
    name: "Alice",
    age: 35,
    noUrut: 2,
    photoProfileUrl:
      "https://dory-liberal-uniformly.ngrok-free.app/profile/PP_Alice.jpg",
    photoProfileAlt: "PP_Alice.jpg",
  },
  {
    name: "Bob",
    age: 47,
    noUrut: 3,
    photoProfileUrl:
      "https://dory-liberal-uniformly.ngrok-free.app/profile/PP_Bob.jpg",
    photoProfileAlt: "PP_Bob.jpg",
  },
];
