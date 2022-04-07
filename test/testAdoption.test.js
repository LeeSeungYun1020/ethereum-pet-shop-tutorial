const Adoption = artifacts.require("Adoption");

contract("Adoption", (accounts) => {
    let adoption;
    let expectedPetId;

    before(async () => {
        adoption = await Adoption.deployed();
    });

    describe("펫을 입양하고 계정의 주소를 검색함", async () => {
        before("accounts[0]가 펫을 입양", async () => {
            await adoption.adopt(8, {from: accounts[0]});
            expectedAdopter = accounts[0];
        });

        it("펫 id로 소유자의 주소를 가져올 수 있다.", async () => {
            const adopter = await adoption.adopters(8);
            assert.equal(adopter, expectedAdopter, "첫번째 계정이 소유자여야 함!");
        });

        it("모든 펫 소유자의 주소를 가져올 수 있다.", async () => {
            const adopters = await adoption.getAdopters();
            assert.equal(adopters[8], expectedAdopter, "컬렉션에 입양된 펫의 소유가자 있어야 함!");
        });
    });
});