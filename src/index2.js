

//第二章 基础语法知识

"use strict"

function log(target) {
    // console.log('--target---',target)


    let  desc=Object.getOwnPropertyDescriptors(target.prototype)
    // console.log('----desc----------',desc);

    for (const key of Object.keys(desc)){
        if (key==='constructor'){
            continue;
        }
        const func=desc[key].value;
        if('function'===typeof func){
            Object.defineProperty(target.prototype,key,{
                value(...args){
                    // console.log('before'+key)
                    const ret = func.apply(this.args)
                    // console.log('after'+key)
                    return ret;
                }
            })
        }
    }
}

function readonly(target,key,descriptor) {
    // console.log('--readonly---descriptor---',descriptor)
    // console.log('--readonly---descriptor.value---',descriptor.value)
    descriptor.writable=false
}


function validate(target,key,descriptor) {
    console.log('--descriptor-validate--',descriptor)

    const func=descriptor.value;
    console.log('--func---',func)

    descriptor.value=function (...args) {
        console.log('--args---',args)

        for(let num of args){
            if('number'!==typeof num){
                throw new Error(`${num}is not a number`)
            }
        }

        return func.apply(this,args)
    }
    console.log('--descriptor.value---',descriptor.value)

}


@log
class Numberic{
    @readonly PI=3.14;

    @validate
    add(...nums){
        return nums.reduce((p,n)=>(p+n),0)
    }
}
// new Numberic().add(1,2)
// new Numberic().PI=100;
new Numberic().add(1,'x')

