//4-1  使用mobx-react

//mobx是一个状态管理工具
//node  浏览器都能用

import {observable,action,computed} from 'mobx'
import React,{Component,Fragment} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {observer,PropTypes as ObservablePropTypes} from 'mobx-react'
//observer修饰react组件类本身， @observable是修饰类成员的
//mobx-react可以将react的render方法包装成autorun

//存储数据
class  Store {
    @observable cache ={queue:['11111']}
    @action.bound refresh(){
        console.log('3333333333')
        this.cache.queue.push(1)
    }
}

const  store=new Store()


//Bar Foo
@observer
class Bar extends Component{
    static  propTypes={
        queue:PropTypes.array
        // queue:observablePropTypes.observableArray
    }
    render() {
        const queue=this.props.queue
        console.log('--queue-555555---',queue)

        return <span>{queue.length}</span>
    }
}


//@observer
//@observer不起作用
//mobx能够精确得知autorun依赖哪些可观察数据做到按需触发
//Foo没用到queue而Bar用到了
//谁真正用到了被修改的可观察数据，谁就重渲染，谁就应该被@observer修饰
//所以修饰Foo无效，修饰Bar生效
//对于没有使用到任何可观察数据的react组件，被修饰也没有副作用，考虑到扩展性，建议修饰所有react组件
class Foo extends Component{
    static propTypes={
        cache:PropTypes.object
        // cache:observablePropTypes.observableArray
    }
    render(){
        const cache=this.props.cache
        console.log('---cache-111--',cache)
        // return <div><Bar queue={cache.queue}/></div>
        return <div><button onClick={this.props.refresh}>Refresh</button><Bar queue={cache.queue}/></div>
    }
}

//挂在
// ReactDOM.render(<Foo cache={store.cache} refresh={store.refresh}/>,document.querySelector('#root'))




//TodoList
//TODO条目的列表展示
//增加TODO条目
//修改完成状态
//删除TODO条目


class Todo {
    @observable id=Math.random();
    @observable title=''
    @observable finished=false
    constructor(title) {
        this.title=title;
    }
    @action.bound toggle(){
        this.finished=!this.finished
    }
}

class Store2 {
    @observable todos=[]

    @action.bound createTodo(title){
        this.todos.unshift(new Todo(title))
    }
    @action.bound removeTodo(todo){
        //remove不是js数据原生的方法，它是mobx在observableArray上提供的
        this.todos.remove(todo)
    }
    @computed get left(){
        return this.todos.filter((todo)=>!todo.finished).length
    }
}

let store2=new Store2()

@observer
class TodoItem extends Component{
    static propTypes ={
        todo:PropTypes.shape({
            id:PropTypes.number.isRequired,
            title:PropTypes.string.isRequired,
            finished:PropTypes.bool.isRequired,
        }).isRequired
    }
    handleClick=(e)=>{
        this.props.todo.toggle()
    }
    render() {
        const todo=this.props.todo;
        const store=this.props.store;
        console.log('-------store-----',store)
        return(
            <Fragment>
                <input type="checkbox" onChange={()=>todo.toggle()} className='toggle' checked={todo.finished} />
                <span className={['title',todo.finished && 'finished'].join(' ')}>{todo.title}</span>
                <span className='delete' onClick={e=>store.removeTodo(todo)}>X</span>
            </Fragment>
        )
    }
}


//视图组件
@observer
class TodoList extends  Component{
    //参数类型校验
    static propTypes={
        store:PropTypes.shape({
            createTodo:ObservablePropTypes.func,
            todos:ObservablePropTypes.observableArrayOf(ObservablePropTypes.observableObject).isRequired
        }).isRequired
    }
    constructor(props) {
        super(props);
        this.state={
            inputValue:''
        }
    }
    handleChange=(e)=>{
        let inputValue=e.target.value;
        this.setState({
            inputValue
        })
    }
    handleSubmit=(e)=>{
        e.preventDefault();
        let store=this.props.store
        var inputValue=this.state.inputValue

        store.createTodo(inputValue)
        this.setState({
            inputValue:''
        })
    }

    render() {
        const  store=this.props.store

        return <div className='todo-list'>
            <header>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" onChange={e=>this.handleChange(e)} value={this.state.inputValue} className='input' placeholder='what needs to be finished'/>
                </form>
            </header>
            <ul>
                {store.todos.map(todo=>{
                    return (
                        <li key={todo.id} className='todo-item'>
                            <TodoItem  todo={todo} store={store}/>
                        </li>
                    )
                })}
            </ul>
            <footer>
                {store.left} item(s) unfinished
            </footer>
        </div>
    }
}

ReactDOM.render(<TodoList  store={store2}/>,document.querySelector('#root'))

//1.将react中的用户操作行为转化为action
//2.将数据绑定到react上以驱动视图，这是一个闭环

