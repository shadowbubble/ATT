"use strict";

const path = require("path");
const {
    randomCards,
    settlement,
    getCardGroup
} = require('./util');
const rootDir = path.join(__dirname, '../public');
const viewDir = `${rootDir}/views`;
let gameStart = false;
let gameCards; // 游戏分配的卡牌
let gameCoin = 10000; // 当前用户的金币数
let pourCoin = 0; // 当前下注金币

/**
 * home page
 */
const getIndex = (req, res) => {
    const home = path.join(rootDir, 'index.html');
    res.sendFile(home);
};
const postPour = (req, res) => {
    if (gameStart) {
        res.json({
            code: 1,
            desc: '游戏已经开始，不能下注',
        });
        return;
    }
    const {
        coin
    } = req.body;
    pourCoin = coin;
    if (gameCoin < coin) {
        res.json({
            code: 1,
            desc: '游戏金币不足',
        });
        return;
    }
    gameCards = randomCards(); // {0,12,1,3,4}
    const cards = (getCardGroup(gameCards)).cards;
    gameCoin -= coin;
    gameStart = true;
    res.json({
        cards,
        code: 0,
    });
};
// 下注
/**
 * 处理 switch
 */
const postSwitch = (req, res) => {
    if (!gameStart) {
        res.json({
            code: 2,
            desc: 'Game not start',
        });
        return;
    }
    let keep = req.body['keep[]'];
    if (!keep) {
        keep = [];
    }
    const temp = []; // 暂存卡牌的编号
    for (let i = 0; i < 5; i += 1) {
        if (keep.includes(i.toFixed())) {
            temp.push(gameCards[i]);
        } else {
            temp.push(undefined);
        }
    }
    gameCards = randomCards(temp); // {0,12,1,3,4}
    const cardGroup = getCardGroup(gameCards);
    const cards = cardGroup.cards;
    const result = cardGroup.judge();
    const winCoin = settlement(pourCoin, result);
    gameCoin += winCoin;
    gameStart = false;
    // gameCards = [];
    res.json({
        cards,
        code: 0,
        currentCoin: gameCoin,
        result,
        winCoin,
    });
};
const postInit = (req, res) => {
    res.json({
        code: 0,
        currentCoin: gameCoin,
    });
};
const errorHandle = (req, res) => {
    const home = path.join(viewDir, 'error.html');
    res.sendFile(home);
};

module.exports = {
    getIndex,
    postPour,
    postSwitch,
    postInit,
    errorHandle
}