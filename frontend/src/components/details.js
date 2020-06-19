import React from 'react';
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import TextField from "@material-ui/core/TextField";

import { getOneUser, updateUser, changePostInfo } from '../redux/actions/userDetails';
import { cleanData } from '../redux/actions/userListAction';

class Details extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: {
                id: '',
                img: '',
                name: '',
                sex: '',
                rank: '',
                startDate: '',
                phone: '',
                email: '',
                superior: '',
                subordinate: [],
            },
            superiors: []
        }
    }

    componentDidMount() {
        this.props.getOneUser(this.props.match.params.id);
    }

    componentWillReceiveProps(props) {
        const user = props.userInfo;
        this.setState({
            user: {
                id: user._id,
                img: user.img,
                name: user.name,
                sex: user.sex,
                rank: user.rank,
                startDate: user.startDate,
                phone: user.phone,
                email: user.email,
                superior: user.superior,
                subordinate: user.subordinate
            },
            superiors: props.superiors,
            errors: '',
            nameError: '',
            emailError: '',
            phoneError: ''
        })
    }

    handleChanges = (event) => {
        const { name, value } = event.target;
        const { user } = this.state;
        if (name === 'img') {
            if (event.target.files.length < 1) {
                return;
            }
            const selectedFile = event.target.files[0];
            const fileReader = new FileReader();
            fileReader.onload = evt => {
                this.setState({
                    user: {
                        ...user,
                        img: evt.target.result
                    }
                });
            }
            fileReader.readAsDataURL(selectedFile);
            return;
        }

        switch (name) {
            case 'name': {
                if (name === 'name' && value === '') {
                    this.setState({ nameError: 'Name cannot be empty.' });
                } else {
                    this.setState({ nameError: '' });
                }
                break;
            }
            case 'phone': {
                if (name === 'phone') {
                    if (event.target.value > 9999999999 || event.target.value < 1000000000) {
                        this.setState({ phoneError: 'Phone number should be 9 digits.' })
                    } else {
                        this.setState({ phoneError: '' })
                    }
                }
                break;
            }
            case 'email': {
                if (name === 'email') {
                    const regexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
                    if (!regexp.test(event.target.value)) {
                        this.setState({ emailError: 'Please check email format.' });
                    } else {
                        this.setState({ emailError: '' });
                    }
                }
                break;
            }
            default:
                break;
        }

        if (name === 'superior' && value === '') {
            this.setState({
                user: {
                    ...user,
                    superior: ''
                }
            });
            return;
        }
        this.setState({
            user: {
                ...user,
                [name]: value
            }
        })
    }

    handleSubmit = () => {
        const { user, errors, phoneError, emailError } = this.state;
        if (!(errors || phoneError || emailError)) {
            window.localStorage.removeItem('lastList');
            this.props.updateUser(user);
        }
    }

    handleCancel = () => {
        this.props.history.goBack();
    };

    render() {
        const { postInfo, error} = this.props;
        const { user, superiors, errors, nameError, phoneError, emailError } = this.state;

        if (postInfo) {
            this.props.changePostInfo();
            this.props.cleanData();
            return <Redirect to='/'></Redirect>
        } else {
            console.log(error);
            return (
                <div className="container">
                    {error ? <div style={{color: 'red'}}>update failed with error: {JSON.stringify(error.message)}</div> : <React.Fragment></React.Fragment>}
                    <div className="header">
                        <img style={{ width: '100px' }} src={require('../default_avatar/icon.png')} alt="new solider img" />
                        <h2>Update Soldier</h2>
                    </div>
                
                    <div>
                        <FormControl component="fieldset" style={{ width: "100%" }}>
                            <div className="btn-group">
                                <button className="my-btn" onClick={this.handleCancel}> 
                                    Cancel
                                </button>
                                <button className="my-btn" type='submit' onClick={this.handleSubmit}>
                                    Save
                            </button>
                            </div>

                            <div className="newSoldier-container">
                                <div>
                                    <div>
                                        <img height={300} width={300} src={user.img} alt={user.name} />
                                    </div>
                                    <input name="img" className="file-upload myinput" type="file" onChange={this.handleChanges} />
                                </div>
                                <div style={{ paddingLeft: '100px' }}>
                                    <div>
                                        <label>
                                            Name:
                                        </label>
                                        <input name="name" className="myinput" value={user.name} onChange={this.handleChanges} />
                                        <div>
                                            <span style={{ color: 'red', fontSize: '12px' }}>{nameError}</span>
                                        </div>
                                        <label>
                                            Rank:
                                        </label>
                                        <select name="rank" value={user.rank} onChange={this.handleChanges}>
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
                                            name="sex"
                                            value={user.sex}
                                            onChange={this.handleChanges}
                                            style={{ display: 'flex', justifyContent: 'space-between' }}
                                        >
                                            <FormControlLabel value="Female" control={<Radio />} label="Female" />
                                            <FormControlLabel value="Male" control={<Radio />} label="Male" />
                                        </RadioGroup>
                                        <TextField
                                            id="date"
                                            label="Start Date"
                                            type="date"
                                            name="startDate"
                                            value={user.startDate}
                                            onChange={this.handleChanges}
                                            InputLabelProps={{
                                                shrink: true
                                            }}
                                        />
                                        <label>
                                            Office Phone:
                                        </label>
                                        <input name="phone" className="myinput" type="number" value={user.phone} onChange={this.handleChanges} />
                                        <div>
                                            <span style={{ color: 'red', fontSize: '12px' }}>{phoneError}</span>
                                        </div>
                                        <label>
                                            Email:
                                        </label>
                                        <input name="email" className="myinput" value={user.email} onChange={this.handleChanges} />
                                        <div>
                                            <span style={{ color: 'red', fontSize: '12px' }}>{emailError}</span>
                                        </div>
                                        <label>
                                            Superior:
                                        </label>
                                        <select name="superior" value={user?.superior?._id} onChange={this.handleChanges}>
                                            <option value={''} key={"superior-none"}>none</option>
                                            {superiors.map((user, index) => {
                                                return (<option value={user._id} key={"superior-" + index}>{user.name}</option>)
                                            })}
                                        </select>
                                        <div>
                                            <span style={{ color: 'red', fontSize: '24px' }}>{errors}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </FormControl>
                    </div>

                </div>
            )
        }
    }
}

const mapStateToProps = state => {
    return {
        userInfo: state.userDetailsReducer.data.data,
        superiors: state.userDetailsReducer.data.superiors,
        userList: state.userListReducer.data,
        postInfo: state.userDetailsReducer.updateInfo,
        error: state.userDetailsReducer.error
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getOneUser: (id) => {
            dispatch(getOneUser(id));
        },
        updateUser: (user) => {
            dispatch(updateUser(user));
        },
        changePostInfo: () => {
            dispatch(changePostInfo());
        },
        cleanData: () => {
            dispatch(cleanData())
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Details);