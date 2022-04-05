# Pet Shop 튜토리얼

![펫샵](./image/petshop.png)

[가이드](https://trufflesuite.com/guides/pet-shop/index.html) 를 따라가며 진행하는 튜토리얼

첫번째 dApp으로 펫샵 입양 추적 시스템을 만들어 보자.

## 배경

상점에는 한 번에 최대 16마리를 수용할 수 있으며 펫 데이터베이스를 보유하고 있다.  
상점은 이더리움 주소를 입양할 애완동물과 연결하는 dApp을 원한다.

## 개발 환경 세팅

node.js와 git, ganache 설치가 필요하다.

```bash
npm install -g truffle
```

## Truffle box로 Truffle 프로젝트 만들기

```bash
mkdir pet-shop-tutorial
cd pet-shop-tutorial
```

```bash
truffle unbox pet-shop
```

### 디렉토리 구조

* contracts: 스마트 컨트랙트용 솔리디티 소스 파일 디렉토리
* migrations: 스마트 컨트랙트 배포를 위한 마이그레이션 시스템, 마이그레이션은 변경 사항을 추적할 수 있는 특수한 스마트 계약이다.
* test: 스마트 컨트랙트에 대한 자바스크립트와 솔리디티 테스트
* truffle-config.js: Truffle 설정 파일

## 스마트 컨트랙트 작성하기

1. `/contracts` 디렉토리를 생성하고 `Adiotion.sol` 파일을 만들자.
2. 파일을 아래와 같이 작성한다.

```solidity
pragma solidity ^0.5.0;

contract Adoption {

}
```

3. adopters 변수를 추가해보자.

```solidity
address[16] public adopters;
```

### 첫번째 함수: 펫 입양하기

1. 위에서 작성한 변수 선언 다음에 아래 함수를 추가하자. 이 함수는 스마트 컨츠랙트롤 사용될 것이다.

```solidity
function adopt(uint petId) public returns (uint) {
    require(0 <= petId && petId <= 15);
    // require 조건 확인
    adopters[petId] = msg.sender;
    // 이 함수 실행하는 사람이나 스마트 컨트랙트는 msg.sender
    return petId;
}
```

### 두번째 함수: 입양자 검색하기

array getter는 주어진 키에 대해 한가지 값만 반환할 수 있다.  
UI는 모든 입양 상태를 고려해야 하므로 array 전체를 반환하는 함수가 필요하다.

1. 스마트 컨트랙트에 getAdopters() 함수를 추가해보자.

```solidity
function getAdopters() public view returns (address[16] memory) {
    return adopters;
}
```

## 스마트 컨트랙트 컴파일 및 마이그레이션

### 컴파일

솔리디티는 컴파일이 필요한 언어이다. EVM(이더리움 가상 머신)에서 실행하기 위해 바이트 코드로 솔리디티 코드를 컴파일해야한다.

1. root 디렉토리에서 아래 명령을 입력해보자.

```bash
truffle compile
```

아래와 같은 출력이 나올 것이다.

```bash
Compiling your contracts...
===========================
> Compiling .\contracts\Adoption.sol
> Compiling .\contracts\Migrations.sol
> Artifacts written to D:\develop\project\pet-shop-tutorial\build\contracts
> Compiled successfully using:
   - solc: 0.5.16+commit.9c3226ce.Emscripten.clang
```

### 마이그레이션

스마트 컨트랙트 컴파일이 성공적으로 완료되었으므로 블록체인에 마이그레이션할 시간입니다!  
마이그레이션은 한 상태에서 다른 상태로 이동하여, 어플리케이션 컨트랙트의 상태를 변경하는 것을 의미하는 스크립트를 배포합니다. 첫번째 마이그레이션에서는 새 코드를 배포할 수 있습니다. 그러나 이미 배포된 경우라면
다른 마이그레이션에서 데이터를 이동하거나 계약을 새로운 계약으로 교체할 수 있습니다.

`migrations` 디렉토리에는 `1_initial_migration.js` 파일이 있습니다. 이 파일은 다음 스마트 컨트랙트 마이그레이션을 관찰하기 위해 `Migrations.sol` 계약을 배포하고 향후
변경되지 않은 계약을 중복해서 마이그레이션하지 않도록 합니다.

그렇다면 우리만의 마이그레이션 스크립트를 작성해보시죠!

1. `migrations`디렉토리에 `2_deploy_contracts.js` 파일을 새로 만들자.
2. 아래 코드를 파일에 작성하자.

```javascript
const Adoption = artifacts.require("Adoption");

module.exports = (deployer) => {
    deployer.deploy(Adoption);
};
```

3. 계약을 블록체인으로 마이그레이션하기 전에 블록체인을 실행해야 한다. Ganache를 이용하여 이더리움 개발용 개인 블록체인을 만들고 계약 배포, 어플리케이션 개발, 테스트를 실행하는데 사용하자.
4. 터미널에서 계약을 블록체인으로 마이그레이션하자.

```bash
truffle migrate 
```

아래와 같은 결과가 출력될 것이다.

```bash
1_initial_migration.js
======================

   Deploying 'Migrations'
   ----------------------
   > transaction hash:    0xdb78ebb96ad6fd5ed9dd19d8fa5e2bcd55a937e949b449b09179833c27b975d1
   > Blocks: 0            Seconds: 0
   > contract address:    0xA47a6D846E957f8eb43F01b89F217ABa1DbbD0Cc
   > block number:        1
   > block timestamp:     1649158663
   > account:             0x8fF0792d265281edCD05766a43150F5291148cB5
   > balance:             99.99616114
   > gas used:            191943 (0x2edc7)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00383886 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00383886 ETH


2_deploy_contracts.js
=====================

   Deploying 'Adoption'
   --------------------
   > transaction hash:    0x04963f826495c5fd54e7388c0c54c7ada7ede8814ded7e15ce6f1f1dc68a0891
   > Blocks: 0            Seconds: 0
   > contract address:    0xb612C1Bd368fBcDfbb06C8265F92190f3e9C4Fbe
   > block number:        3
   > block timestamp:     1649158664
   > account:             0x8fF0792d265281edCD05766a43150F5291148cB5
   > balance:             99.99123376
   > gas used:            204031 (0x31cff)
   > gas price:           20 gwei
   > value sent:          0 ETH
   > total cost:          0.00408062 ETH

   > Saving migration to chain.
   > Saving artifacts
   -------------------------------------
   > Total cost:          0.00408062 ETH

Summary
=======
> Total deployments:   2
> Final cost:          0.00791948 ETH
```

마이그레이션이 순서대로 실행되고 관련 정보가 함께 출력되는 것을 확인할 수 있다.

가나슈에서 블록체인 상태가 바뀐 것을 확인할 수 있다. 현재 블록이 0에서 4로 변경되고 첫번째 계정의 이더가 마이그레이션 거래 비용 때문에 감소한 것을 확인할 수 있다.

지금까지 첫번째 스마트 계약을 작성하고 로컬 블록체인에 배포해 보았다. 이제부터는 우리가 원하는대로 작동하는지 작성한 스마트 계약과 상호작용 해보자!


