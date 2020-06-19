import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";
import SRC from "../util"; 

import { createUser, changePostInfo, getSuperiors} from '../redux/actions/userCreator';
import { cleanData } from '../redux/actions/userListAction';

class NewUser extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            img: SRC,
            name: '',
            radio: '',
            rank: '',
            startDate: '',
            phone: '',
            email: '',
            superior: '',
            errors: '',
            phoneError: '',
            emailError: '',
            superiors: []
        }
    }

    componentDidMount() {
        this.props.listSuperior();
    }

    componentWillReceiveProps(props) {
        const list = props.superiors;
        this.setState({ superiors: list });
    }

    handleChanges = (event, name) => {
        if(name === 'img'){
            if(event.target.files.length < 1) {
                return;
            }
            const selectedFile = event.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = evt => this.setState({img: evt.target.result});
            fileReader.readAsDataURL(selectedFile);
            return;
        }
        this.setState({ [name]: event.target.value });
        if (name === 'phone') {
            if (event.target.value > 9999999999 || event.target.value  < 1000000000) {
                this.setState({ phoneError: 'Phone number should be 10 digits.' })
            } else {
                this.setState({ phoneError: '' })
            }
        }
        if (name === 'email') {
            const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!regexp.test(event.target.value)) {
                this.setState({ emailError: 'Please check email format.' });
            } else {
                this.setState({ emailError: '' });
            }
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const user = this.state;
        const { emailError, phoneError, errors } = this.state;
        if (user.img === '' || user.name === '' || user.radio === '' || user.rank === '' || user.startDate === '' || user.phone === '' || user.email === '') {
            this.setState({ errors: 'Fields cannot be empty.' });
        }else {
            window.localStorage.removeItem('lastList');
            this.props.register(user);
        }
    }

    getSuperiorList(superiors) {
        const list = [];
        superiors.map((user, index) => {
            list.push(<option value={user._id} key={"superior-" + index}>{user.name}</option>);
        });
        return list;
    }

    goBack = () => {
        this.props.history.push('/');
    }

    render() {
        const { img, name, radio, rank, startDate, phone, email, superior, errors, phoneError, emailError, superiors } = this.state;
        const { error, creationInfo } = this.props;
        if (creationInfo) {
            this.props.changePostInfo();
            this.props.cleanData();
            return <Redirect to='/'></Redirect>
        } else {
            return (
                <div className="container">
                    {error ? <div style={{color: 'red'}}>update failed with error: {JSON.stringify(error.message)}</div> : <React.Fragment></React.Fragment>}
                    <div className="header">
                        <img style={{ width: '100px' }} src={require('../default_avatar/icon.png')} alt="new solider img" />
                        <h2>New Soldier</h2>
                    </div>
                    <div>
                        <FormControl component="fieldset" style={{ width: "100%" }}>
                            <div className="btn-group">
                                <button className="my-btn" onClick={this.goBack}>
                                    Cancel
                                </button>
                                <button className="my-btn" type='submit' onClick={(e) => this.handleSubmit(e)}>
                                    Save
                            </button>
                            </div>
                            <div className="newSoldier-container">
                                <div>
                                    <div>
                                        <img height={300} width={300} src={img} alt={name} />
                                    </div>
                                    <input className="file-upload myinput" type="file" onChange={(e) => this.handleChanges(e, "img")}/>
                                </div>
                                <div style={{ paddingLeft: '100px' }}>
                                    <div>
                                        <label>
                                            Name:
                                        </label>
                                        <input name="name" className="myinput" value={name} onChange={(e) => this.handleChanges(e, "name")} />
                                        <label>
                                            Rank:
                                        </label>
                                        <select value={rank} onChange={(e) => this.handleChanges(e, "rank")}>
                                            <option></option>
                                            <option>General</option>
                                            <option>Colonel</option>
                                            <option>Major</option>
                                            <option>Captain</option>
                                            <option>Lieutenant</option>
                                            <option>Warrant Officer</option>
                                            <option>Sergeant</option>
                                            <option>Corporal</option>
                                            <option>Specialist</option>
                                            <option>Private</option>
                                        </select>
                                        <label>Sex: </label>
                                        <RadioGroup
                                            aria-label="gender"
                                            name="radio"
                                            value={radio}
                                            onChange={(e) => this.handleChanges(e, "radio")}
                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                        >
                                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                        </RadioGroup>
                                        <TextField
                                            id="date"
                                            label="Start Date"
                                            type="date"
                                            value={startDate}
                                            onChange={(e) => this.handleChanges(e, "startDate")}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                        <label>
                                            Office Phone:
                                        </label>
                                        <input name="phone" className="myinput" type="number" value={phone} onChange={(e) => this.handleChanges(e, "phone")} />
                                        <div>
                                            <span style={{ color: 'red', fontSize: '12px' }}>{phoneError}</span>
                                        </div>
                                        <label>
                                            Email:
                                        </label>
                                        <input name="email" className="myinput" value={email} onChange={(e) => this.handleChanges(e, "email")} />
                                        <div>
                                            <span style={{ color: 'red', fontSize: '12px' }}>{emailError}</span>
                                        </div>
                                        <label>
                                            Superior:
                                        </label>
                                        <select name="superior" value={superior} onChange={(e) => this.handleChanges(e, "superior")}>
                                            <option value={''} key={"superior-none"}>none</option>
                                            {superiors ? this.getSuperiorList(superiors) : (<React.Fragment></React.Fragment>) }
                                        </select>

                                        <div>
                                            <span style={{ color: 'red', fontSize: '24px' }}>{errors}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormControl>
                    </div>
                </div >
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        superiors: state.userCreatorReducer.superiors,
        creationInfo: state.userCreatorReducer.postInfo,
        error: state.userCreatorReducer.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        register: (user) => {
            dispatch(createUser(user));
        },
        listSuperior: ()=>{
            dispatch(getSuperiors());
        },
        changePostInfo: () => {
            dispatch(changePostInfo());
        },
        cleanData: () => {
            dispatch(cleanData());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NewUser);