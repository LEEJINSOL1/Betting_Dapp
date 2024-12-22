const asserRevert = require('chai').assert;


const inLogs = async (logs, eventName) => {
    // 'event'를 'e'로 변경하여 올바르게 비교
    //console.log("네임 : ",eventName);
    const event = logs.find(e => e === eventName);
    

    
    //console.log("tttttttttttt : " , inLogs)

    // 'assert.exists' 대신 'assert.ok' 사용
    assert.ok(event, `event ${eventName} was not found in logs.`);

};


module.exports = {
    inLogs
}