"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const TronWeb = require("tronweb");
const axios_1 = __importDefault(require("axios"));
/*
// 获取测试币地址: http://testnet.tronex.io/join/getJoinPage
const TEST_NET_CONFIG={
    fullNode: 'https://suntest.tronex.io',
    solidityNode: 'https://suntest.tronex.io',
    eventServer: 'https://suntest.tronex.io',
};*/
const NET_CONFIG = {
    fullNode: 'https://nile.trongrid.io',
    solidityNode: 'https://nile.trongrid.io',
    eventServer: 'https://nile.trongrid.io',
};
const PRIVATE_KEY_1 = "4830EC8DBE1E91557F6AE6A2EFED706821EEA5AD39FEC431B8C6860F486EF572";
const PUBLIC_KEY_1 = "04779D7BD7B5A316DE28C30FB5B12E215718AA423F42B6C1CDA8EF61E845F2978A58529458D6D4B31FB2328DB62CBB341FC0815172F79C3423C42B7D5A5F1888E2";
const ADDR_1 = "TYJWHBcoRe3cDp79M2R6WiY37EiHn9w7oe";
const ADDR_HEX_1 = "41f4f917ee28322a788a8e712fa6bbcf4f8e149f34";
const PRIVATE_KEY_2 = "9D4ED983D5A0B97CC428DB653B83C391613DF168E6267C39D74426EB19C6A55A";
const PUBLIC_KEY_2 = "04240FC04FD997E7A466BD592BA364691EBA0AF23AD53BF343687D05667E4CAC1E0E0649112F770E9C5D10350644C4D4FF8B3AE3F0D3993A03AA3131C5E631CCF7";
const ADDR_2 = "THpuXbUBxFWhzUKdTves8HKUJ4CEGoYscG";
const ADDR_HEX_2 = "41562f17a8d2f0897ff5396d646df7bd705ddaa747";
//参考文档: https://gist.github.com/andelf/f05f5403e352346e04aad0deec48aad1
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        // let connObj = await createConn();
        // let hexVal = Buffer.from(Uint8Array.from( connObj.utils.crypto.decodeBase58Address(ADDR_2))).toString("hex");
        // console.log("hex addr:", hexVal);
        console.log(getTokenType("TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj"));
    });
}
main().then(() => {
    console.log("execute finish");
}).catch((err) => {
    console.error("execute error", err);
});
function createConn() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = new TronWeb(NET_CONFIG.fullNode, NET_CONFIG.solidityNode, NET_CONFIG.eventServer);
        return connObj;
    });
}
function generateAddress() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let addr = connObj.utils.accounts.generateAccount();
        console.log("private key:", addr.privateKey);
        console.log("public key:", addr.publicKey);
        console.log("address:", addr.address.base58);
        console.log("address hex:", addr.address.hex);
    });
}
// https://cn.developers.tron.network/docs/token-standards-trx
// 手续费计算参考文档:https://cn.developers.tron.network/docs/resource-model
function getBalance() {
    return __awaiter(this, void 0, void 0, function* () {
        let addr = ADDR_1;
        let connObj = yield createConn();
        let account = yield connObj.trx.getAccount(addr);
        console.info("trx balance:", account);
        console.info("TRC10 token:", account.assetV2);
        // 获取带宽与能量相关信息
        let resource = yield connObj.trx.getAccountResources(addr);
        console.info("accountResource:", resource);
    });
}
function getTRC10TokenInfo() {
    return __awaiter(this, void 0, void 0, function* () {
        let tokenId = "1000016";
        let connObj = yield createConn();
        let tokenInfo = yield connObj.trx.getTokenByID(tokenId);
        console.info("tokenInfo:", tokenInfo);
    });
}
function transferTrx() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let tradeObj = yield connObj.transactionBuilder.sendTrx(ADDR_2, 10000000, ADDR_1);
        // 签名
        let signedTxn = yield connObj.trx.sign(tradeObj, PRIVATE_KEY_1);
        // 广播
        const receipt = yield connObj.trx.sendRawTransaction(signedTxn);
        console.info("receipt:", receipt);
    });
}
function transferTrx2() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let private_bytes = connObj.utils.code.hexStr2byteArray(PRIVATE_KEY_1);
        const signature = connObj.utils.crypto.ECKeySign(connObj.utils.code.hexStr2byteArray("4652b1d1c6e444e9b21fddec1b0ceb0d3e29d7b06daeec9d8f1e8b73c27c465e"), private_bytes);
        console.log("signature:", signature);
        /*
            let tradeObj = await connObj.transactionBuilder.sendTrx(
                ADDR_2,10000000,ADDR_1
            );
        
            const signature = connObj.utils.crypto.ECKeySign(connObj.utils.code.hexStr2byteArray(tradeObj.txID), private_bytes);
            tradeObj.signature = [signature];
            console.log("txId:", tradeObj.txID);
            console.log("signature:", signature);
            console.info("tranasction:", tradeObj);
        */
        // 广播
        //const receipt = await connObj.trx.sendRawTransaction(tradeObj);
        //console.info("receipt:", receipt);
    });
}
function transferTRC10Token() {
    return __awaiter(this, void 0, void 0, function* () {
        let toAddress = ADDR_2;
        let tokenID = "1000016";
        let amount = 100000;
        let fromAddress = ADDR_1;
        //创建一个未签名的 TRC10 转账交易
        let connObj = yield createConn();
        let tradeobj = yield connObj.transactionBuilder.sendToken(toAddress, amount, tokenID, fromAddress);
        //签名
        const signedtxn = yield connObj.trx.sign(tradeobj, PRIVATE_KEY_1);
        //广播
        const receipt = yield connObj.trx.sendRawTransaction(signedtxn);
        console.info("receipt:", receipt);
    });
}
function getTRC20Info() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let contractAddr = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
        let contractHandler = yield connObj.contract().at(contractAddr);
        connObj.setAddress(contractAddr); // 必须得要这句才能正常执行
        let contractName = yield contractHandler.name().call();
        console.info("contractName:", contractName);
        let symbol = yield contractHandler.symbol().call();
        console.info("symbol:", symbol);
        let decimal = yield contractHandler.decimals().call();
        console.info("decimal:", decimal);
        let totalSupply = yield contractHandler.totalSupply().call(); // 总供应量
        console.info("totalSupply", totalSupply);
    });
}
function getTRC20Balance() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let addr = ADDR_1;
        let contractAddr = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
        let contractObj = yield connObj.contract().at(contractAddr);
        connObj.setAddress(contractAddr); // 必须得要这句才能正常执行
        let result = yield contractObj.balanceOf(addr).call();
        console.info("trc20 balance:", result.toString(10));
    });
}
function transferTRC20() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let fromAddr = ADDR_HEX_1;
        let fromPrivateKey = PRIVATE_KEY_1;
        let toAddr = ADDR_2;
        let amount = 5000000;
        let contractAddr = "TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj";
        connObj.setAddress(fromAddr);
        let result = yield connObj.transactionBuilder.triggerSmartContract(contractAddr, 'transfer(address,uint256)', {
            feeLimit: 10000000,
            callValue: 0
        }, [{
                type: 'address',
                value: toAddr
            }, {
                type: 'uint256',
                value: amount.toString()
            }], fromAddr);
        console.info("transfer origin:", result);
        if (!result.result.result) {
            console.error("error:", result);
            return;
        }
        console.info("transaction =>", JSON.stringify(result.transaction, null, 2));
        // result.transaction.raw_data_hex
        const signature = yield connObj.trx.sign(result.transaction, fromPrivateKey);
        console.info("Signature:", signature);
        //result.transaction["signature"] = [signature];
        const broadcast = yield connObj.trx.sendRawTransaction(signature);
        if (broadcast.code != "SUCCESS") {
            console.info("broadcast error result:", broadcast);
        }
        else {
            console.info("broadcast success result:", broadcast);
        }
    });
}
function getTransactionHistory() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let addr = ADDR_1;
        let limit = 30;
        let result = yield axios_1.default.get(`${NET_CONFIG.solidityNode}/v1/accounts/${addr}/transactions?limit=${limit}'`);
        //let transactionList = await connObj.trx.getTransactionsRelated(ADDR_1);
        console.log("transaction list:", JSON.stringify(result.data, null, 2));
    });
}
function getTransactionItem() {
    return __awaiter(this, void 0, void 0, function* () {
        let connObj = yield createConn();
        let transactionInfo = yield connObj.trx.getTransactionInfo("469de0b594442e90c156de748ea899414b4a6a9db4d258b66666e5d9d393f948");
        let jsonStr = JSON.stringify(transactionInfo, null, 2);
        console.log("result:", jsonStr);
    });
}
function decodeTRC20ParamTest() {
    return __awaiter(this, void 0, void 0, function* () {
        let data = "a9059cbb000000000000000000000000562f17a8d2f0897ff5396d646df7bd705ddaa74700000000000000000000000000000000000000000000000000000000004c4b40";
        let connObj = yield createConn();
        let objList = connObj.utils.abi.decodeParams(["address", "uint256"], data, true);
        console.log("num:", objList[1].toString(10));
        let addrHex = connObj.utils.code.hexStr2byteArray(objList[0]);
        let addr = connObj.utils.crypto.getBase58CheckAddress(addrHex);
        console.log("addr hex:", objList[0]);
        console.log("addr:", addr);
    });
}
function getTRC10AssestList() {
    return __awaiter(this, void 0, void 0, function* () {
        let assetResult = yield axios_1.default.get(`${NET_CONFIG.fullNode}/wallet/getassetissuelist`);
        console.info(assetResult.data);
    });
}
function getTokenType(tokenId) {
    if (/^\d+$/.test(tokenId) == false) {
        return 1;
    }
    return 2;
}
