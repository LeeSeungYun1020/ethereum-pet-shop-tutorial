App = {
    // initWeb3에서 설정
    web3Provider: null,
    contracts: {},

    init: async function () {
        // Load pets.
        $.getJSON('../pets.json', function (data) {
            var petsRow = $('#petsRow');
            var petTemplate = $('#petTemplate');

            for (i = 0; i < data.length; i++) {
                petTemplate.find('.panel-title').text(data[i].name);
                petTemplate.find('img').attr('src', data[i].picture);
                petTemplate.find('.pet-breed').text(data[i].breed);
                petTemplate.find('.pet-age').text(data[i].age);
                petTemplate.find('.pet-location').text(data[i].location);
                petTemplate.find('.btn-adopt').attr('data-id', data[i].id);

                petsRow.append(petTemplate.html());
            }
        });

        return await App.initWeb3();
    },

    initWeb3: async function () {
        // 모던 dApp 브라우저
        if (window.ethereum) {
            console.log("모던 dApp 브라우저")
            App.web3Provider = window.ethereum;
            try {
                // 계정 액세스 요청
                await window.ethereum.enable();
            } catch (e) {
                // 사용자가 계정 액세스 거부
                console.error("사용자가 계정 액세스 거부")
                alert("계정 액세스가 거부되었습니다.")
            }
        }
        // 이전 dApp 브라우저
        else if (window.web3) {
            console.log("이전 dApp 브라우저")
            App.web3Provider = window.web3.currentProvider;
        }
        // 주입된 web3 인스턴스가 감지되지 않는 경우, 가나슈로 대체
        else {
            console.log("가나슈로 대체")
            App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
        }
        web3 = new Web3(App.web3Provider)
        return App.initContract();
    },

    initContract: function () {
        $.getJSON('Adoption.json', (data) => {
            // 필요한 계약 아티팩트 파일을 가져와 @truffle/contract로 인스턴스화한다.
            const AdoptionArtifact = data;
            App.contracts.Adoption = TruffleContract(AdoptionArtifact);

            // 우리 계약으로 공급자를 설정한다.
            App.contracts.Adoption.setProvider(App.web3Provider);

            // 입양된 펫을 탐색하고 표시하기 위해 우리 계약을 사용한다.
            return App.markAdopted();
        });

        return App.bindEvents();
    },

    bindEvents: function () {
        $(document).on('click', '.btn-adopt', App.handleAdopt);
    },

    markAdopted: function () {
        let adoptionInstance;

        App.contracts.Adoption.deployed().then((instance) => {
            adoptionInstance = instance;
            return adoptionInstance.getAdopters.call();
        }).then((adopters) => {
            for (let i = 0; i < adopters.length; i++) {
                if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
                    $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
                }
            }
        }).catch((err) => {
            console.log(err.message);
        });
    },

    handleAdopt: function (event) {
        event.preventDefault();

        const petId = parseInt($(event.target).data('id'))

        let adoptionInstance;
        web3.eth.getAccounts((error, accounts) => {
            if (error)
                console.log(error);
            const account = accounts[0];
            App.contracts.Adoption.deployed().then((instance) => {
                adoptionInstance = instance;
                // 계정을 전송하여 트랙잭션으로 입양 실행
                return adoptionInstance.adopt(petId, {from: account})
            }).then((result) => {
                return App.markAdopted();
            }).then((err) => {
                console.log(err.message);
            })
        });
    }

};

$(function () {
    $(window).load(function () {
        App.init();
    });
});
