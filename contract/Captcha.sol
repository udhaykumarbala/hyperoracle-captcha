// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;


contract Captcha{
    mapping(uint256=>string) public capchaHashMap;
    mapping(uint256=>string) public capchaImageMap;
    mapping(address=>bool) public isVerified;
    event Verify(string userValue,string systemHash);

    modifier isCapchaVerified(){
        require(isVerified[msg.sender],"Please verify the capcha before any transaction");
        // setting it to false, the need to verify again for the next request
        isVerified[msg.sender] = false;
        _;
    }

    modifier isAlreadyVerified(){
        require(!isVerified[msg.sender],"Already Verified please proceed with transaction");
        _;
    }

    function addCapcha(uint256 _capchaID, string calldata _capchaHash, string calldata _capchaImage) external {
        capchaHashMap[_capchaID] = _capchaHash;
        capchaImageMap[_capchaID] = _capchaImage;
    }

    function verifyCapcha(uint256 _capchaID, string calldata _capchavalue) external isAlreadyVerified{
        emit Verify(_capchavalue, capchaHashMap[_capchaID]);
    }

    function run(address _validatedUser) external{
        isVerified[_validatedUser] = true;
    }

    // this add function is only accessable when completed the verification
    function add(uint256 _a, uint256 _b) external isCapchaVerified returns(uint256 c) {
        c = _a+_b;
    }
}