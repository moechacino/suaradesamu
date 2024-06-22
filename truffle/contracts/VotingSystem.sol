// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract VotingSystem {
    struct Candidate {
        uint256 id;
        string name;
        uint256 voteCount;
    }

    struct Voter {
        bool hasVoted;
        uint256 candidateId;
        string NIK;
        string name;
    }

    address public owner;
    uint256 public candidateCount;
    uint256 public voterCount;
    mapping(uint256 => Candidate) public candidates;
    mapping(address => Voter) private voters;
    mapping(string => bool) private registeredNIKs;
    mapping(string => bool) private usedNIKs;
    string[] public NIKs;

    event Voted(address voter, uint256 candidateId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier notOwner() {
        require(msg.sender != owner, "Owner cannot vote");
        _;
    }

    modifier hasNotVoted() {
        require(!voters[msg.sender].hasVoted, "You have already voted");
        _;
    }

    modifier validNIK(string memory _NIK) {
        require(registeredNIKs[_NIK], "NIK is not registered");

        _;
    }

    modifier hasUsedNIK(string memory _NIK) {
        require(!usedNIKs[_NIK],
            "NIK has already been used to vote"
        );
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function addCandidate(string memory _name, uint256 _candidateId)
        public
        onlyOwner
    {
        require(_candidateId > 0, "Candidate ID must be greater than zero");
        require(
            candidates[_candidateId].id == 0,
            "Candidate with this ID already exists"
        );

        candidateCount++;
        candidates[_candidateId] = Candidate(_candidateId, _name, 0);
    }

    function addNIK(string memory _NIK) public onlyOwner {
        require(bytes(_NIK).length > 0, "NIK is required");
        require(!registeredNIKs[_NIK], "NIK is already registered");
        registeredNIKs[_NIK] = true;
        NIKs.push(_NIK);
        voterCount++;
    }

    function vote(uint256 _candidateId, string memory _NIK, string memory _name)
        public
        notOwner
        hasNotVoted
        validNIK(_NIK)
        hasUsedNIK(_NIK)
    {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate ID"
        );

        voters[msg.sender] = Voter({
            hasVoted: true,
            candidateId: _candidateId,
            NIK: _NIK,
            name: _name
        });

        candidates[_candidateId].voteCount++;
        usedNIKs[_NIK] = true;

        emit Voted(msg.sender, _candidateId);
    }

    function getCandidate(uint256 _candidateId)
        public
        view
        returns (
            uint256,
            string memory,
            uint256
        )
    {
        require(
            _candidateId > 0 && _candidateId <= candidateCount,
            "Invalid candidate ID"
        );
        Candidate memory candidate = candidates[_candidateId];
        return (candidate.id, candidate.name, candidate.voteCount);
    }

    function getAllCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory candidateList = new Candidate[](candidateCount);
        for (uint256 i = 1; i <= candidateCount; i++) {
            candidateList[i - 1] = candidates[i];
        }
        return candidateList;
    }

    function getVoter()
        public
        view
        returns (
            bool,
            uint256,
            string memory
        ) 
    {
        Voter memory voter = voters[msg.sender];
        return (voter.hasVoted, voter.candidateId, voter.NIK);
    }

    function getAllNIKs() public view returns (string[] memory) {
        return NIKs;
    }

    function getVoterCount() public view returns (uint256) {
        return voterCount;
    }
}
