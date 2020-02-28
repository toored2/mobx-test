//5.1常用的工具函数
//observe toJS trace spy
//性能提升
// 三大法则
// 细粒度拆分视图组件
// 使用专用组件处理列表
// 尽可能晚的解构可观察数据





//spy可以监控所有的事件，每个执行的action、对可观察数据的每次修改、甚至autorun reaction的每次触发都能被监控到
//功能强大，但是会带来性能损耗，不建议在生产环境使用
import {trace,toJS,spy,observe,observable,action,computed} from 'mobx'
import React,{Component,Fragment} from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import {observer,PropTypes as ObservablePropTypes} from 'mobx-react'



// spy(event=>{
//     console.log(event)
// })

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


    disposers=[]
    constructor() {
        //observe监视器
        //observe只能检测到todos变量本身的变化，无法检测它内部对象的属性变化
        observe(this.todos,change=>{
            this.disposers.forEach(disposer=>disposer());
            this.disposers=[];
            for (let todo of change.object){
                let disposer=observe(todo,changex=>{
                })
                this.disposers.push(disposer)
            }
            this.save()
        })
    }

    save(){
        localStorage.setItem('todos',JSON.stringify(toJS(this.todos)))
        console.log(toJS(this.todos))
    }

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
    render() {trace()
        const todo=this.props.todo;
        const store=this.props.store;
        return(
            <Fragment>
                <input type="checkbox" onChange={()=>todo.toggle()} className='toggle' checked={todo.finished} />
                <span className={['title',todo.finished && 'finished'].join(' ')}>{todo.title}</span>
                <span className='delete' onClick={e=>store.removeTodo(todo)}>X</span>
            </Fragment>
        )
    }
}



@observer
class TodoFooter extends Component{
    render() {trace()
        const store =this.props.store

        return <footer>
            {store.left} item(s) unfinished
        </footer>
    }
}

@observer
class TodoView extends Component{
    render() {
        const todos=this.props.todos
        return todos.map(todo=>{
                return (
                    <li key={todo.id} className='todo-item'>
                        <TodoItem  todo={todo}  />
                    </li>
                )
            })
    }
}


@observer

class TodoHeader extends  Component{
    state ={inputValue: ''}

    handleSubmit=(e)=>{
        e.preventDefault();
        let store=this.props.store
        let inputValue=this.state.inputValue

        store.createTodo(inputValue)
        this.setState({
            inputValue:''
        })
    }
    handleChange=(e)=>{
        let inputValue=e.target.value;
        this.setState({
            inputValue
        })
    }
    render() {
        return     <header>
            <form onSubmit={this.handleSubmit}>
                <input type="text" onChange={e=>this.handleChange(e)} value={this.state.inputValue} className='input' placeholder='what needs to be finished'/>
            </form>
        </header>
    }
}

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

    render() {trace()
        //trace对调试非常有用
        const  store=this.props.store
        const todos=store.todos

        return <div className='todo-list'>
            <TodoHeader store={store} />
            <ul>
                {/*遍历输出组件数组，react在渲染列表时有个怪癖，只要列表的任何成员有了变化，他都会尝试重新评估整个列表，会触发odoList组件重渲染*/}
                {/*  {store.todos.map(todo=>{
                    return (
                        <li key={todo.id} className='todo-item'>
                            <TodoItem  todo={todo} store={store}/>
                        </li>
                    )
                })}*/}
                <TodoView todos={todos} />
            </ul>
            <TodoFooter store={store}></TodoFooter>
        </div>
    }
}

ReactDOM.render(<TodoList  store={store2}/>,document.querySelector('#root'))



