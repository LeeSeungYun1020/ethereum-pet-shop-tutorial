pragma solidity ^0.5.0;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Adoption.sol";

contract TestAdoption {
    // 테스트할 입양 계약의 주소
    Adoption adoption = Adoption(DeployedAddresses.Adoption());

    // 테스트에 사용될 펫의 ID
    uint expectedPetId = 8;

    // 입양된 펫의 소유자로 기대되는 사람은 바로 이 계약자
    address expectedAdopter = address(this);

    // adopt() 함수 테스트하기
    function testUserCanAdoptPet() public {
        uint returnedId = adoption.adopt(expectedPetId);
        Assert.equal(returnedId, expectedPetId, "예상되는 펫의 ID와 입양 결과가 일치해야 함!");
    }

    // 특정 펫의 소유자 검색하여 테스트
    function testGetAdopterAddressByPetId() public {
        address adopter = adoption.adopters(expectedPetId);
        Assert.equal(adopter, expectedAdopter, "해당 펫의 소유자는 이 계약이어야 함!");
    }

    // 모든 펫의 소유자 검색하여 테스트
    function testGetAdopterAddressByPetIdInArray() public {
        // 계약의 저장소가 아닌 메모리에 입양자를 저장
        address [16] memory adopters = adoption.getAdopters();
        Assert.equal(adopters[expectedPetId], expectedAdopter, "해당 펫의 소유자는 이 계약이어야 함!");
    }
}