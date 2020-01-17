//商户属性定义

let def1 = {
    type:1,
    name:'微信',
    fields:[{
        name:'APPID',
        key:'app.id',
        isSubMch:false,
        required:true
    },{
        name:'商户ID',
        key:'mch.id',
        isSubMch:false,
        required:true
    },{
        name:'子商户ID',
        key:'subMch.id',
        isSubMch:true,
        required:false
    },{
        name:'商户KEY',
        key:'mch.key',
        isSubMch:false,
        required:true
    }]
}

let def2 = {
    type:2,
    name:'支付宝',
    fields:[{
        name:'APPID',
        key:'app.id',
        required:true
    },{
        name:'商户ID',
        key:'mch.id',
        required:true
    }]
}

let def3 = {
    type:3,
    name:'好收',
    fields:[{
        name:'APPID',
        key:'app.id',
        isSubMch:true,
        required:true
    },{
        name:'门店ID',
        key:'store.id',
        isSubMch:true,
        required:true
    }]
}
let defs = []
defs.push(def1,def2,def3);

export function getPropFields(type){
    let rs = defs.filter(d=>d.type==type);
    if(rs.length<1) return []
    return rs[0].fields;
}
export const defines = defs