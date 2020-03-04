const Medicine = require('../models/Medicine');
const db = require('../plugins/db')();

module.exports = options=>{
    const{message} = options;
    let ss = {
        confirm: '',
        medicine: [],
    };
    eval('ss =' + message);
    let userId = ss.confirm;
    let sp1 = ss.medicine;
    (async () => {
        for (let item of sp1) {
            const res = await Medicine.findOneAndUpdate({name: item, userId}, {isChecked: true});
            console.log(res);
        }
        await db.disconnect();
    })();
};