var user = process.env.USERDB || "";
var password = process.env.PASSDB || "";
var server = process.env.SERVER || "localhost:27017";
var db = process.env.DATABASE || "UcaCloud";
if(process.env.DATABASE){
    module.exports = {
        mongodb:
        {
            URI: `mongodb://${user}:${password}@${server}/${db}`
        }
    }
}
else{
    module.exports = {
        mongodb:
        {
            URI: `mongodb://${user}${password}@${server}/${db}`
        }
    }
}