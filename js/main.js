// Firebase定義用ファイル
'use strict';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, get, onChildChanged } 
from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
import { firebaseConfig } from "./FB_myAuthKey.js";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);    // Realtimedatabaseに接続
const dbRef = ref(db, "vote");
// console.log(firebaseConfig);
// console.log(dbRef);

// 初回登録用（登録したらコメントアウト）
function initVote() {
    const obj = {
        'inoki': 0,
        'tyosyu': 0,
        'misawa': 0,
        'hashimoto': 0
    };

    // データベースに初期登録を行う
    set(dbRef, obj).then(() => {
        console.log('初期登録成功！');
    }).catch((error) => {
        console.log('初期登録失敗！');
    });
}

// ロード時（リロード時）処理
// 現在のカウント数を表示する。
window.addEventListener('load', function(){
    countDisp("inoki");
    countDisp("tyosyu");
    countDisp("misawa");
    countDisp("hashimoto");
});

// 猪木クリック時に猪木の投票数カウントアップ
$("#vote-button-inoki").on("click", function(){
    cntUp("inoki");
});

// 長州クリック時に長州の投票数カウントアップ
$("#vote-button-tyosyu").on("click", function(){
    cntUp("tyosyu");
});

// 三沢クリック時に三沢の投票数カウントアップ
$("#vote-button-misawa").on("click", function(){
    cntUp("misawa");
});

// 橋本クリック時に橋本の投票数カウントアップ
$("#vote-button-hashimoto").on("click", function(){
    cntUp("hashimoto");
});

// カウントアップ用関数
function cntUp(key) {
    const voteRef = ref(db, `vote/${key}`);
    // console.log(voteRef);
    // キーに該当するカウント数を取得
    get(voteRef).then((snapshot) => {
        if(snapshot.exists()) {
            const currentCount = snapshot.val();
            // console.log(currentCount + 1);
            // setでカウント数を更新（keyはrefで設定済のため、keyに対するvalue（投票数）のみ上書きする）
            set(voteRef, currentCount + 1);
        } else {
            alert(`該当するキーが存在しません。キー：${key}`);
        }
    }).catch((error) => {
        alert('カウントアップ処理失敗');
        console.log(error.code + '：' + error.message);
    });
}

function countDisp(key){
    const voteRef = ref(db, `vote/${key}`);
    // console.log(voteRef);
    // キーに該当するカウント数を取得
    get(voteRef).then((snapshot) => {
        if(snapshot.exists()) {
            // console.log(snapshot.val());
            $(`.${key}count`).html(snapshot.val());
        } else {
            alert(`該当するキーが存在しません。キー：${key}`);
        }
    }).catch((error) => {
        alert('件数取得処理失敗');
        console.log(error.code + '：' + error.message);
    });
}

// 更新処理（DB更新時に発火。DBと画面と同期をとるためこちらでhtmlのカウント数を上書き）
onChildChanged(dbRef, (data) => {
    $(`.${data.key}count`).html(data.val());
});


// 初期登録（初期化したいときに実行。それ以外はコメントアウトすること！）
// initVote();