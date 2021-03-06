import DeerSDK from "../deer/DeerSDK";



/**
 * 微信开放数据域接口
 */
export default class WXOpenData {

    /**
     * 向子域发送消息
     * 
     * @param msg 
     */
    public static postMessage(msg: object): void {
        // console.log("----  WXOpenData ----");
        // console.log("-  postMessage  -");
        // console.log(msg);

        if (typeof wx == "undefined") return null;

        let openData = wx.getOpenDataContext();
        openData.postMessage(msg);
    }



    /**
     * 上报用户分数
     */
    public static saveUserScoreToCloud(score: number) {
        // console.log("----  WXOpenData ----");
        // console.log("-  saveScoreToCloud  -");

        WXOpenData.saveUserDataToCloud("score", "" + score);

        if (DeerSDK.instance.isReady) {
            DeerSDK.instance.game_saveScoreToService(score);
        }
    }



    /**
     * 上报用户数据
     */
    public static saveUserDataToCloud(key: string, v: string): void {
        // console.log("----  WXOpenData ----");
        // console.log("-  saveUserDataToCloud  -");

        if (typeof wx == "undefined") return;

        let timestamp: number = Math.floor(new Date().getTime()/1000);
        // console.log("key=" + key, "value=" + v);

        //如果是分数，特殊处理
        if (key == "score") {
            //发送消息
            WXOpenData.postMessage({ "action": "__rdm__myScore", "value": parseInt(v) });

            v = '{"wxgame":{"score":' + v + ', "update_time":' + timestamp + '}}'
        }

        try {
            wx.setUserCloudStorage(
                {
                    "KVDataList": [
                        {
                            "key": key,
                            "value": v,
                        }
                    ],

                    success: (res) => {
                        // console.log("saveUserDataToCloud success")
                        console.log(res)
                    },

                    fail: (err) => {
                        // console.log("saveUserDataToCloud fail")
                        console.log(err)
                    }
                }
            );
        } catch (error) {

        }
    }
}
