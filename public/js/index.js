"use strict";

// environment variables
const baseUrl = ''; // 基础的url
const pokersRate = [
    750, 250, 150, 60, 10, 7, 5, 3, 2, 1,
];
const gameState = {
    waiting: 0,
    running: 1,
    ending: 2,
};

// //////////////////////////////////
// DOM 对象 (Jquery)
// //////////////////////////////////

const statusLab = $('#gameStatus'); // 状态提示 - label
const resultText = $('#result'); // 结果 - label
const bonusCoinLab = $('#bonus_coin'); // 奖金牌 - label
const pourCoinLab = $('#pour_coin'); // 下注金额 - label
const totalCoinLab = $('#total_coin'); // 总分牌 - label

const pourInput = $('#pour_input'); // 加注输入框 - input
const startBtn = $('#startBtn'); // 开始按钮 - button
const plusBtn = $('#plus'); // 加注按钮 - button
const minusBtn = $('#minus'); // 减注按钮 - button

//
// label型对象
//
// const bonusText = []; // 奖金池记分牌 - label
const pokersText = []; // 牌型记分牌 - label
const cardImages = []; // 卡牌的图片 - image 
const cardLabels = []; // 卡牌的label - label
// for (let i = 0; i < 4; i += 1) {
//     // 获取彩金的html对象
//     bonusText.push($(`#bonus_${i}`));
// }

for (let i = 0; i < 10; i += 1) {
    // 获取牌组组合的html对象
    pokersText.push($(`#poker_${i}`));
}

for (let i = 0; i < 5; i += 1) {
    // 获取牌和提示标签的html对象
    cardImages.push($(`#cardImg_${i}`));
    cardLabels.push($(`#card_label_${i}`));
}

// 控制数据
let keep = []; // 保留下来的扑克牌
let pourScore = 0; // 下注金额
let currCoin = 0; // 总金额
let gameStatus = gameState.waiting; // 游戏是否已经开始


// /////////////////////////////////////////////////////////////////////////////
//
// 初始化
// /////////////////////////////////////////////////////////////////////////////

(() => {
    startBtn.text('开始');
    statusLab.text('WAITING');

    $.post('/init', {
        code: 0,
    }, (res) => {
        currCoin = res.currentCoin;
        totalCoinLab.text(currCoin);
    });
})();

// /////////////////////////////////////////////////////////////////////////////
//
// 事件绑定
// /////////////////////////////////////////////////////////////////////////////
/**
 * 更新奖金表格
 * @param {number} score 下注金额
 */
const updateDisplay = (score) => {
    pourInput.val(score);
    pourCoinLab.text(pourScore);
    for (let i = 0; i < pokersRate.length; i += 1) {
        const td = pokersText[i];
        td.text(score * pokersRate[i]);
    }
};

/**
 * 修改下注金额
 * @param {number} score 下注金额变化量 > 0 为 +, < 0 为 -
 */
const changePour = (score) => {
    pourScore += score;
    // }
    // 限制 pourScore 区间 [0, 2000]
    if (pourScore < 0) {
        pourScore = 0;
    } else if (pourScore > 2000) {
        pourScore = 2000;
    }
}

/**
 * 加注按钮, 绑定点击事件
 */
plusBtn.on('click', () => {
    changePour(100);
    updateDisplay(pourScore);
});

let handle;
plusBtn.on('mousedown', () => {
    handle = setInterval(() => {
        changePour(100);
        updateDisplay(pourScore);
    }, 200);
});

plusBtn.on('mouseup', () => {
    clearInterval(handle);
});

plusBtn.on('mouseout', () => {
    clearInterval(handle);
});

/**
 * 减注按钮, 绑定点击事件
 */
minusBtn.on('click', () => {
    changePour(-100);
    updateDisplay(pourScore);
});

minusBtn.on('mousedown', () => {
    handle = setInterval(() => {
        changePour(-100);
        updateDisplay(pourScore);
    }, 200);
});

minusBtn.on('mouseup', () => {
    clearInterval(handle);
});

minusBtn.on('mouseout', () => {
    clearInterval(handle);
});

/**
 * 设置每张牌的click事件
 */
for (let i = 0; i < 5; i += 1) {
    const card = cardImages[i];
    const text = cardLabels[i];
    text.isShown = false;
    text.hide();
    // 显示文字 text.show()
    // 隐藏文字 text.hide()
    card.on('click', () => {
        text.isShown = !text.isShown;
        if (text.isShown) {
            text.show();
            keep.push(i);
        } else {
            text.hide();
            delete keep[keep.indexOf(i)];
        }
        const temp = [];
        keep.forEach((e) => {
            console.log(e);
            if (e || e === 0) {
                temp.push(e);
            }
        });
        keep = temp; // keep => [0,1,2,4]
        keep.sort();
        // console.log(keep);
    });
}

/**
 * 界面设置
 * @param {status} toStatus 游戏进行状态（下一步）
 */
const setToStatus = (toStatus) => {
    gameStatus = toStatus;
    // 完全重置游戏状态
    if (gameStatus === gameState.waiting) {
        //
        // 重置控制数据
        // 
        pourScore = 0;
        keep = [];        
        
        //
        // 重置界面
        //

        // 奖金表格
        statusLab.text('Waiting');
        resultText.text('...');
        pourCoinLab.text(0);
        bonusCoinLab.text(0);

        // 牌型表格
        updateDisplay(pourScore);
        
        // 牌面及hold的提示
        const url = '/images/cards/card-bg.png';
        for (let i = 0; i < 5; i += 1) {
            cardImages[i].attr('src', url);
        }
        for (let i = 0; i < 5; i += 1) {
            cardLabels[i].isShown = false;
            cardLabels[i].hide();
        }

        // 控制按钮
        pourInput.val(pourScore);
        minusBtn.removeAttr('disabled');
        plusBtn.removeAttr('disabled');
        startBtn.text('开始');
    } else if (gameStatus === gameState.running) {
        // 禁用加减注按钮
        minusBtn.attr('disabled', 'disabled');
        plusBtn.attr('disabled', 'disabled');
        // 修改状态提示和开始按钮的文本
        statusLab.text('RUNNING');
        startBtn.text('改变');
        pourCoinLab.text(pourScore);
    } else {
        // 修改状态提示和开始按钮的文本
        statusLab.text('结束');
        startBtn.text('重置');
    }
};

/**
 * 设置卡面图案
 * @param {CardGroup} cards 牌组对象数组
 */
const setCardImg = (cards) => {
    for (let i = 0; i < cards.length; i += 1) {
        const card = cards[i];
        cardImages[i].attr('src', card.path);
    }
};

// 开始按钮, 绑定点击事件
startBtn.on('click', () => {
    // waiting -> running
    if (gameStatus === gameState.waiting) {
        if (pourScore === 0) {
            console.error('先加钱，没钱玩蛇皮');
            return;
        }
        totalCoinLab.text(currCoin - pourScore);
        $.post(`${baseUrl}/pour`, {
            coin: pourScore,
        }, (res) => {
            if (res.code === 0) {
                const {
                    cards,
                } = res;
                setCardImg(cards);
                setToStatus(gameState.running);
            } else {
                alert(res.desc);
                return;
            }
        });
    } else if (gameStatus === gameState.running) {
        $.post(`${baseUrl}/switch`, {
            keep,
        }, (res) => {
            if (res.code === 0) {
                const {
                    cards,
                    result,
                    winCoin,
                    currentCoin
                } = res;
                setCardImg(cards);
                resultText.text(result);
                bonusCoinLab.text(winCoin);
                currCoin = currentCoin;
                totalCoinLab.text(currentCoin);

                setToStatus(gameState.ending);
                // if (winCoin > 0) {
                //     setTimeout(() => {
                //         alert(`Congratulation! You have won ${winCoin}, current coin: ${currentCoin}`);
                //     }, 200);
                // } else {
                //     setTimeout(() => {
                //         alert(`Good Luck next time, current coin: ${currentCoin}`);
                //     }, 200);
                // }
            } else {
                alert(res.desc);
                return;
            }
        });
    } else {
        setToStatus(gameState.waiting);
    }
});