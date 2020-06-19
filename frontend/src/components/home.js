import React from 'react';
import { connect } from 'react-redux';
import { getUserList, deleteUser, openChild, openSuperior } from '../redux/actions/userListAction';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';

class Home extends React.Component {

    storage = window.localStorage;

    constructor(props) {
        super(props);
        this.state = {
            search: '',
            page: 1,
            sortDirection: 0,
            sortColumn: '_id',
            nameFlag: undefined,
            sexFlag: undefined,
            rankFlag: undefined,
            loading: false,
            enableLoadMore: true,
            // data: []
        }
    }

    componentDidMount() {
        console.log('home init');
        if(this.storage.getItem('lastList')){
            this.storage.removeItem('lastList');
            // console.log(newList);
        }else{
            this.props.getData(this.state.search, '_id', 1, 1, false);
            this.refs.myscroll.addEventListener("scroll", () => {
                if (this.refs.myscroll.scrollTop + this.refs.myscroll.clientHeight >= this.refs.myscroll.scrollHeight) {
                    this.loadMore();
                }
            });
        }
    }

    // componentWillReceiveProps(props) {
    //     const list = props.list;
    //     this.setState({ data: list });
    // }

    searchOnChange = (e) => {
        this.setState({ search: e.target.value })
        this.props.getData(e.target.value, '_id', 1, 1, false);
    }

    formatePhoneNumber = (number) => {
        let numberString = number.toString();
        let arr = []
        for (let i = 0; i < numberString.length; i++) {
            arr.push(numberString[i]);
            if (i === 2 || i === 5) {
                arr.push('-')
            }
        }
        return arr.join('');
    }

    recallAllUsers = () => {
        this.setState({sexFlag: undefined, nameFlag: undefined, rankFlag: undefined, search:'' })
        this.props.getData('', '_id', 1, 1, false);
    }

    sortName = () => {
        const currentValue = !this.state.nameFlag;
        this.setState({ nameFlag: currentValue });
        this.setState({ sexFlag: undefined, rankFlag: undefined });
        this.setState({ page: 1 });
        let value = 0;
        if (currentValue === true) {
            value = 1;
        } else if (currentValue === false) {
            value = -1;
        } else {
            value = 0;
        }
        this.setState({ sortDirection: value })
        this.props.getData(this.state.search, 'name', value, 1, false);
    }

    sortSex = () => {
        const currentValue = !this.state.sexFlag;
        this.setState({ sexFlag: currentValue });
        this.setState({ nameFlag: undefined, rankFlag: undefined });
        this.setState({ page: 1 });
        let value = 0;
        if (currentValue === true) {
            value = 1;
        } else if (currentValue === false) {
            value = -1;
        } else {
            value = 0;
        }
        this.setState({ sortDirection: value })
        this.props.getData(this.state.search, 'sex', value, 1, false);
    }

    sortRank = () => {
        const currentValue = !this.state.rankFlag;
        this.setState({ rankFlag: currentValue });
        this.setState({ nameFlag: undefined, sexFlag: undefined });
        this.setState({ page: 1 });
        let value = 0;
        if (currentValue === true) {
            value = 1;
        } else if (currentValue === false) {
            value = -1;
        } else {
            value = 0;
        }
        this.setState({ sortDirection: value })
        this.props.getData(this.state.search, 'rank', value, 1, false);
    }

    loadMore = () => {
        if(this.state.enableLoadMore) {
            let curPage = this.state.page + 1;
            this.setState({ page: curPage, loading: true });
            // console.log(this.state.data)
            let preLength = this.props.list.length;
            this.props.getData(this.state.search, this.state.nameFlag ? 'name' : this.state.sexFlag ? 'sex' : this.state.rankFlag ? 'rank' : '_id', this.state.sortDirection, curPage, true);
            let curLength = this.props.list.length;
            this.setState({ loading: false, enableLoadMore: (preLength != curLength) });
        }
        // this.setState({data: [...this.state.data, ...this.props.list]});
    }

    findChild = (user) => {
        // this.props.getData(user.subordinate, '_id', this.state.sortDirection, 1, true);
        this.props.openChild(user);
    }

    handleRouterChanges = (tag, id) => {
        this.storage.clear();
        this.storage.setItem('lastList', 'true');
        if(tag === 'new'){
            this.props.history.push('/newuser');
            
        }else{
            this.props.history.push(`/details/${id}`);
        }
    }

    render() {
        const { list, loading, error } = this.props;
        const { search, nameFlag, sexFlag, rankFlag } = this.state;
        return (
            <div ref="myscroll" style={{ height: '650px', overflow: "auto" }}>
                    {error ? <div style={{color: 'red'}}>update failed with error: {JSON.stringify(error.message)}</div> : <React.Fragment></React.Fragment>}
                <div className="header"><img style={{ width: '100px' }} src={require('../default_avatar/icon.png')} alt="icon" /><h2>US Army Personnel Registry</h2></div>
                <div className="head">
                    <input className="myinput" value={search} placeholder="Search" onChange={this.searchOnChange} />
                    <div>
                        <button className="my-btn" onClick={this.recallAllUsers} >
                            Reset
                        </button>
                        <button className="my-btn" onClick={() => {this.handleRouterChanges('new', '')}}>
                            {/* <Link to='/newuser'>New Solider</Link> */}
                            New Solider
                        </button>
                    </div>
                </div>
                <div>
                    {loading ? (<div>.............................................................................Loading..............................................................</div>)
                        : (<table>
                            <thead>
                                <tr>
                                    <td>Avatar</td>
                                    <td onClick={this.sortName}>Name {(nameFlag === undefined) ? (<React.Fragment></React.Fragment>) : (nameFlag ? <FaArrowDown /> : <FaArrowUp />)}</td>
                                    <td onClick={this.sortSex}>Sex {(sexFlag === undefined) ? (<React.Fragment></React.Fragment>) : (sexFlag ? <FaArrowDown /> : <FaArrowUp />)}</td>
                                    <td onClick={this.sortRank}>Rank {(rankFlag === undefined) ? (<React.Fragment></React.Fragment>) : (rankFlag ? <FaArrowDown /> : <FaArrowUp />)}</td>
                                    <td>Start Date</td>
                                    <td>Phone</td>
                                    <td>Email</td>
                                    <td>Superior</td>
                                    <td># of D.S.</td>
                                    <td>Edit</td>
                                    <td>Delete</td>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((user, index) => {
                                    const tempDate = new Date(user.startDate);
                                    const date = `${tempDate.getMonth() + 1}/${tempDate.getDate() + 1}/${tempDate.getFullYear()}`
                                    const phone = this.formatePhoneNumber(user.phone)
                                    return (
                                        <tr key={index}>
                                            <td><img src={user.img} alt={user.img} /></td>
                                            <td>{user.name}</td>
                                            <td>{user.sex}</td>
                                            <td>{user.rank}</td>
                                            <td>{date}</td>
                                            <td><a href={`tel: 1${phone}`}>{phone}</a></td>
                                            <td> <a href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${user.email}`} target="_blank">{user.email}</a></td>
                                            <td>{user.superior?._id ? <button className="button-icon"  onClick={(() => {this.props.openSuperior(user.superior?._id)})}>{user.superior?.name}</button>: <React.Fragment></React.Fragment>}</td>

                                            <td>{user.subordinate.length ? <button className="button-icon"  onClick={()=> this.findChild(user)}>{user.subordinate.length}</button>: <React.Fragment></React.Fragment>}</td>
                                            <td><button className="button-icon" onClick={() => { this.handleRouterChanges('edit', user._id) }}><EditIcon /></button></td>
                                            <td><button className="button-icon" onClick={() => { this.props.deleteUser(user._id) }} ><DeleteIcon /></button></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table >)
                    }

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        list: state.userListReducer.data,
        loading: state.userListReducer.isLoading,
        postInfo: state.userCreatorReducer.postInfo,
        error: state.userListReducer.error,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getData: (searchKeyWord, sortColumn, sortDirection, pageRange, t) => {
            dispatch(getUserList(searchKeyWord, sortColumn, sortDirection, pageRange, t));
        },
        deleteUser: (userId) => {
            dispatch(deleteUser(userId));
        },
        openChild: (user) => {
            dispatch(openChild(user));
        },
        openSuperior: (id) =>{
            dispatch(openSuperior(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
// export default Home;