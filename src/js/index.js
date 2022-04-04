import "../css/index.less";
console.log("我是入口");
let a = () => {
    console.log("我来调用");
}
console.log("箭头函数被无视了");
console.log(a);

let p = new Promise((resolve, reject)=>{
    setTimeout(()=>{console.log("11");})
    reject('1');
});
console.log(p);