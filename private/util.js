const config = require("./config/config");
const Card = require("./models/Card");
const CardGroup = require("./models/CardGroup");

/**
 * @description 创建一个扑克牌组，存放所有扑克
 */
const pokers = [];
for (let i = 0; i < 5; i += 1) {
    if (i === config.type.JOKER) {
        pokers.push(new Card(i, 0));
        pokers.push(new Card(i, 1));
    } else {
        for (let j = 2; j < 15; j += 1) {
            const card = new Card(i, j);
            pokers.push(card);
        }
    }
}

/**
 * @description 随机返回一组卡牌的编号
 * @param {array} origin 保留的牌 undefined or null, [1,null,2,3,null]
 * @return {array} resultObjects 得到的牌
 */
module.exports = {
    randomCards(origin = new Array(5).fill(undefined)) {
        const result = [];
        for (let i = 0; i < origin.length; i += 1) {
            let id = origin[i];
            if (id) {
                // 如果id不为空，直接赋值
                result[i] = id;
            } else {
                // 如果id为空，摇号 -> 判断是否在origin中 -> 赋值
                while (!id) {
                    id = Math.floor(Math.random() * 54);
                    if (origin.includes(id) || result.includes(id)) {
                        id = undefined;
                    } else {
                        result[i] = id;
                    }
                }
            }
        }
        return result;
    },

    /**
     * @description 将卡组下标转为CardGroup类型
     * @param {array} indexes 卡组的下标
     */
    getCardGroup(indexes) {
        const cards = [];
        indexes.forEach((id) => {
            cards.push(pokers[id]);
        });
        const cardGroup = new CardGroup(cards);
        return cardGroup;
    },
    
    /**
     * @description 结算金币
     * @param {number} coin 下注金额
     * @param {string} result 随机牌的结果
     */
    settlement(coin, result) {
        let winCoin = 0;
        switch (result) {
            case '5K':
                winCoin = coin * config.winRates['5K'];
                break;
            case 'RS':
                winCoin = coin * config.winRates.RS;
                break;
            case 'SF':
                winCoin = coin * config.winRates.SF;
                break;
            case '4K':
                winCoin = coin * config.winRates['4K'];
                break;
            case 'FH':
                winCoin = coin * config.winRates.FH;
                break;
            case 'FL':
                winCoin = coin * config.winRates.FL;
                break;
            case 'ST':
                winCoin = coin * config.winRates.ST;
                break;
            case '3K':
                winCoin = coin * config.winRates['3K'];
                break;
            case '2P':
                winCoin = coin * config.winRates['2P'];
                break;
            case '1P':
                winCoin = coin * config.winRates['1P'];
                break;
            default:
                winCoin = 0;
        }
        return winCoin;
    }
}