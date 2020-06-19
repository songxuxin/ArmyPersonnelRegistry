const User = require('../models/user');
const user = module.exports;


user.getUsers = (req, res, next) => {
    const searchKeyWord = req.query.searchKeyWord ? req.query.searchKeyWord : '';
    const sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
    const sortDirection = req.query.sortDirection ? req.query.sortDirection: 1;
    const pageRange = req.query.pageRange ? req.query.pageRange: 1;
    const pageSize = 8;

    const reg = new RegExp(searchKeyWord, 'i');
    User.find(
        {
            $or : [
                {name: {$regex: reg}},
                {sex: {$regex: reg}},
                {rank: {$regex: reg}},
                {email: {$regex: reg}},
                {startDate: {$regex: reg}},
            ]
        },
        {
            password : 0
        },
        {
            sort : { [sortColumn] : sortColumn == '_id' ? -1 : sortDirection },
            // limit: pageSize,
            // skip: pageSize * (pageRange - 1)
            limit: pageSize * pageRange
        }
    ).populate('superior', 'name').then(response => {
        res.status(200).json(response);
    }).catch(err => {
        res.status(500).send(new Error(err));
    });
}

user.createUser = (req, res, next) => {
    //create a new user
    const newUser = new User(req.body);
    //get the superior user data
    if (req.body.superiorId) {
        User.findById({ "_id": req.body.superiorId }).then(response => {
            const superior = response;
            // add superior into newUser.superior
            newUser.superior = superior;
            // add newUser into superior as a User.subordinate[]
            superior.subordinate.push(newUser);
            // save new user and superior
            newUser.save();
            superior.save();
            res.status(200).json({ message: 'create success' });
        }).catch(err => {
            res.status(500).json({error: JSON.stringify(err)});
        });
    } else {
        newUser.save();
        try{
            res.status(200).json({ message: 'create success' });
        }catch(err){
            res.status(500).send(new Error(err));
        }
    }
}

function getAllSub(arr, user){
    if(user.subordinate.length === 0){
        return arr;
    }
    user.subordinate.forEach( user => {
        arr.push(user._id);
        getAllSub(arr, user);
    })
}

user.getUser = (req, res, next) => {
    const { userId } = req.params;
    let subList = [];
    User.findById(userId).populate({path:'superior subordinate', populate: {path: 'superior subordinate', populate:{path: 'superior subordinate', populate:{path: 'superior subordinate'}}}}).then(response => {
        getAllSub(subList, response);
        res.status(200).json({data: response, subordinates: subList});
    }).catch(err => {
        res.status(500).send(new Error(err));
    });
}

user.updateUser = (req, res, next) => {
    const { userId } = req.params;
    //find selected user
    User.findById(userId).then(response => {
        const modifiedUser = response;
        // _id, superior and subodinate do not need to update.
        modifiedUser.img = req.body.img;
        modifiedUser.name = req.body.name;
        modifiedUser.rank = req.body.rank;
        modifiedUser.sex = req.body.sex;
        modifiedUser.startDate = req.body.startDate;
        modifiedUser.phone = req.body.phone;
        modifiedUser.email = req.body.email;
        //condition one: user doesn't change the superior
        if ((!req.body.superiorId && !modifiedUser.superior) 
        || (req.body.superior && modifiedUser.superior && req.body.superior._id == modifiedUser.superior._id)) {
            modifiedUser.save();
            res.status(200).json({ message: 'update success' });
            return;
        }
        // condition two: user first time add a superior
        console.log("condition two: user first time add a superior", (!modifiedUser.superior&& req.body.superiorId )? 'true': 'false');
        if (!modifiedUser.superior && req.body.superiorId) {
            // find the superior
            User.findById({ "_id": req.body.superiorId }).then(response => {
                const superior = response;
                // add superior into modified.superior
                modifiedUser.superior = superior;
                // add modified user into superior as a User.subordinate[]
                superior.subordinate.push(modifiedUser);
                // save new user and superior
                modifiedUser.save();
                superior.save();
                res.status(200).json({ message: 'create success' });
                return;
            }).catch(err => { console.log(err) });
        }
        // condition three: selected user's superior changes either be other persion or none
        console.log("condition three: selected user's superior changes either be other persion or none", modifiedUser.superior && modifiedUser.superior._id && (modifiedUser.superior._id !== req.body.superiorId)? 'true': 'false');
        if (modifiedUser.superior && modifiedUser.superior._id && (modifiedUser.superior._id !== req.body.superiorId)) {
            // remove selected user from old superior.
            User.findById({ "_id": response.superior._id }).then(response => {
                console.log('remove pre superior, ', response._id);
                const preSuperior = response;
                const index = response.subordinate.indexOf(req.params);
                preSuperior.subordinate.splice(index, 1);
                preSuperior.save();
                if (!req.body.superiorId) {
                    console.log('user removed superior');
                    modifiedUser.save();
                    User.updateOne({_id: modifiedUser._id}, {$unset: {"superior": preSuperior}}).then(resp =>{
                        res.status(200).json({ message: 'create success' });
                    }).catch(err => {console.log(err)});
                    return;
                }
                // find the new superior
                User.findById({ "_id": req.body.superiorId }).then(response => {
                    console.log('reassign to superior, ', req.body.superiorId);
                    const superior = response;
                    // add superior into modified.superior
                    modifiedUser.superior = superior;
                    // add modified user into superior as a User.subordinate[]
                    superior.subordinate.push(modifiedUser);
                    // save new user and superior
                    modifiedUser.save();
                    superior.save();
                    res.status(200).json({ message: 'create success' });
                }).catch(err => { console.log(err) });
            }).catch(err => { console.log(err) });
        }
    }).catch(err => { 
        console.log(err); 
        res.status(500).send(new Error('update failed')); 
    });
}

user.deleteUser = (req, res, next) => {
    const { userId } = req.params;

    User.findById(userId).populate('superior')
        .then(response => {
            const deletedUser = response;
            // get user's superior
            const superior = deletedUser.superior;
            if (superior) {
                const index = superior.subordinate.indexOf(deletedUser._id);
                superior.subordinate.splice(index, 1);
                if(deletedUser.subordinate.length){
                    deletedUser.subordinate.map(user => superior.subordinate.push(user));
                }
                superior.save();
            }

            if (deletedUser.subordinate.length){
                if(superior){
                    User.updateMany({"superior": deletedUser}, {$set: {"superior": superior}})
                    .then(response => {
                        User.deleteOne({"_id":userId}).then(response => {
                            res.status(200).json({ message: 'delete success' });
                            User.deleteOne({"_id":userId}).then(response => {
                                res.status(200).json({ message: 'delete success' });
                            }).catch(error => { console.log(error) });
                            return;
                        }).catch(error => { console.log(error) });
                    }).catch(error => {console.log(error)});
                }else{
                    User.updateMany({"superior": deletedUser}, {$unset: {"superior": deletedUser}})
                    .then(response => {
                        User.deleteOne({"_id":userId}).then(response => {
                            res.status(200).json({ message: 'delete success' });
                            User.deleteOne({"_id":userId}).then(response => {
                                res.status(200).json({ message: 'delete success' });
                            }).catch(error => { console.log(error) });
                            return;
                        }).catch(error => { console.log(error) });
                    }).catch(error => { console.log(error) });
                }
            }else{
                User.deleteOne({"_id":userId}).then(response => {
                    res.status(200).json({ message: 'delete success' });
                }).catch(error => { console.log(error) });
            }
        }).catch(err => {
            console.log(err);
            res(500).send(new Error('delete failed'));
        });
}

function toDelete(userId, User, res) {
    User.deleteOne({"_id":userId}).then(response => {
        res.status(200).json({ message: 'delete success' });
    }).catch(error => { console.log(error) });
}