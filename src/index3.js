//3-1 可观察数据


import {observable,isArrayLikec,computed,autorun,when ,reaction ,action,runInAction} from 'mobx'


//array object map


//array
// const arr=observable(['a','b','c']);
// console.log(arr,Array.isArray(arr),isArrayLike(arr))
// console.log(arr[0])


// const obj=observable({a:1,b:2})
// console.log(obj)
//
// const map=observable(new Map())
//
// map.set('a',1)
// console.log(map.has('a'))
// map.delete('a')
// console.log(map)
// console.log(map.has('a'))


// var num=observable.box(20)
// var str=observable.box('Hello')
// var bool=observable.box(false)
//
//
// num.set(50)
// str.set('world')
// bool.set(false)
// console.log(num,str,bool)
// console.log(num.get(),str.get(),bool.get())



//3-2对可观察数据作出反应




class  Store {
    @observable array=[];
    @observable obj={}
    @observable map=new Map()

    @observable str='hello'
    @observable num=20
    @observable bool=false


    @computed get mixed(){
        return store.str+'/'+store.num
    }

    @action bar(){
        this.str='world'
        this.num=30
    }

    @action.bound baz(){
        this.str='nihao'
        this.num=100
    }
}


//computed
var store =new Store();
// var foo=computed(function () {
//     return store.str+'/'+store.num
// })
// console.log(foo)

// foo.observe(function (change) {
//     console.log(change)
// })
//
// console.log(foo.get())
//
// store.str='world'
// store.num=30


//autorun
//自动运行什么？自动运行传入aotorun的函数
//什么触发自动运行？修改autorun中引用的任意一个观察数据
//autorun执行的条件是，其引用的可观察数据发生了变化
//在可观察数据被修改之后，自动执行依赖可观察数据的行为，这个行为指的是传入autorun的函数
// autorun(()=>{
//     // console.log('------',store.str+'/'+store.num)
//
//     //computed值可以作为一种新的可观察数据
//     //computed值除了可以引用普通可观察数据，可以嵌套引用其他computed值，但是不能用循环引用
//     console.log('--111----',store.mixed)
// })
//
// store.str='11111'
// store.num=100



//when
//接收两个函数参数，第一个函数必须根据可观察数据返回一个布尔值，当改布尔值为true时，就去执行第二个函数，并且保证最多只会执行一次
//如果第一个函数一开始就返回true，第二个函数就会同步立即执行
//无论是否修改可观察数据，autorun都会先执行一次，否则mobx不知道引用了哪些可观察数据，更做不到可观察数据被修改时触发第二个函数执行
// console.log('before')
//
// when(()=>store.bool,()=>{
//     console.log('11111111')
// })
// console.log('after')
//
// store.bool=true


//reaction
//接受两个函数类型的参数，第一个函数引用可观察数据并返回一个值，这个值作为第二个函数的参数
//

// reaction(()=>[store.str,store.num],arr=>{
//     console.log(arr)
// })

// store.str='world'
// store.num=30

//总结
//computed能将多个可观察数据组合成一个可观察数据
//autorun能自动追踪其引用的可观察数据，并在数据发生变化时重新触发
//when提供了条件执行逻辑，它是autorun的一种变种
//reaction能通过分离可观察数据声明，以副作用的方式对autorun作出改进







//3-3 修改可观察数据action

//action是任何修改状态的行为，多次对数据的赋值合并成一次，从而减少触发autorun和reaction的次数
//与observable computed类似，action既可以作为普通函数，也可以作为decorator来使用

reaction(()=>[store.str,store.num],arr=>{
    console.log(arr)
})
// store.bar()

//@action的变种@action.bound，@action.bound可以将被修饰的方法的上下文强制绑定到该对象上
//无论是@action还是@action.bound，都需要绑定在预先定义的对象方法上
var baz=store.baz;
baz()

//runInAction，语法糖，和调用store.bar()是一样的
//对于有多处重复调用的修改状态逻辑，建议用action实现复用，否则用runInAction即可
runInAction(()=>{
    store.str='ssssss'
    store.num=888
})
//runInAction可以接受多一个字符串类型的参数,对于调试比较友好
runInAction('modify',()=>{
    store.str='ssssss'
    store.num=888
})



