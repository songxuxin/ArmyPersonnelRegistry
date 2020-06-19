const User = require('../models/user');
const user = module.exports;

function handleError( res, name, error){
    console.log(name, error);
    res.status(500).send(name);
}

user.getAllSuperior = async (req, res, next) =>{
    try{
        const users = await User.find({});
        res.status(200).json(users);
    }catch(error){
        handleError(res, 'get all superior users', error);
    }
}

user.getUsers = async (req, res, next) => {
    const searchKeyWord = req.query.searchKeyWord ? req.query.searchKeyWord : '';
    const sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
    const sortDirection = req.query.sortDirection ? req.query.sortDirection : 1;
    const pageRange = req.query.pageRange ? req.query.pageRange : 1;
    const pageSize = 10;
    const reg = new RegExp(searchKeyWord, 'i');

    try{
        const users = await User.find(
            {
                $or: [
                    { name: { $regex: reg } },
                    { sex: { $regex: reg } },
                    { rank: { $regex: reg } },
                    { email: { $regex: reg } },
                    { startDate: { $regex: reg } },
                ]
            },
            {
                password: 0
            },
            {
                sort: { [sortColumn]: sortColumn == '_id' ? -1 : sortDirection },
                limit: pageSize * pageRange
            }
        ).populate('superior', 'name');
        res.status(200).json(users);
    }
    catch(error){
        console.log('Get User Failed', error);
        res.status(500).send('Get user Failed');
    }
}

user.createUser = async (req, res, next) =>{
    const newUser = new User(req.body);
    if(req.body.superiorId) {
        newUser.superior = req.body.superiorId;
        try{
            await User.findByIdAndUpdate(req.body.superiorId, {"$push": {"subordinate": newUser._id}});
        }
        catch (error){
            handleError(res, 'Failed to add new user to superior: ', error);
        }
    }
    try {
        await newUser.save();
        res.status(200).json({ message: 'create success' });
    }
    catch (error){
        handleError(res, 'Failed to create a new user');
    }

}

function getAllSub(arr, user) {
    if (user.subordinate.length === 0) {
        return arr;
    }
    user.subordinate.forEach(user => {
        arr.push(user._id);
        getAllSub(arr, user);
    })
}

user.getUser = async (req, res, next) =>{
    const {userId} = req.params;
    const subList = [];
    try{
        const user = await User.findById(userId)
        .populate ({ 
            path: 'superior subordinate',            
            populate: { 
                path: 'superior subordinate',                
                populate: { 
                    path: 'superior subordinate',                    
                    populate: { 
                        path: 'superior subordinate',                        
                        populate: { 
                            path: 'superior subordinate',                            
                            populate: { 
                                path: 'superior subordinate',                                
                                populate: { 
                                    path: 'superior subordinate',
                                    
                                }
                            }
                        }
                    }
                }
            }
        });
        getAllSub(subList, user);
        subList.push(user._id);
        const superiors = await User.find({"_id": {$nin: subList}}).select({'name': 1});
        console.log('get a user has ', superiors.length, 'optional superiors');
        res.status(200).json({data: user, superiors: superiors});
    }
    catch(error){
        handleError(res, 'Failed to get the user', error);
    }
}

user.updateUser = async (req, res, next) => {
    const { userId } = req.params;
    console.log('update user: ', userId);
    try{
        const user = await User.findById(userId);
        // _id, superior and subordinate do not need to update.
        user.img = req.body.img;
        user.name = req.body.name;
        user.rank = req.body.rank;
        user.sex = req.body.sex;
        user.startDate = req.body.startDate;
        user.phone = req.body.phone;
        user.email = req.body.email;

        if(user.superior && user.superior._id){
            console.log('user has superior');
            // remove user form superior's subordinate
            await User.findByIdAndUpdate({"_id": user.superior._id}, {$pull: {subordinate: user._id}});
            if(req.body.superiorId){
                console.log('replace superior', req.body.superiorId);
                await User.findOneAndUpdate({"_id": req.body.superiorId}, {$push: {subordinate: user._id}});
                user.superior = req.body.superiorId;
            }else{
                console.log('remove exist superior');
                await user.save();
                await User.updateOne({_id: user._id}, {$unset: {"superior": user.superior}});
            }
        }else{
            console.log('do not have superior before');
            if(req.body.superiorId){
                console.log('user new add superior');
                await User.findOneAndUpdate({"_id": req.body.superiorId}, {$push: {"subordinate": user._id}});
                user.superior = req.body.superiorId;
            }
        }
        await user.save();
        res.status(200).json({message: 'update success'});
    }
    catch(error){
        handleError(res, 'update User faild', error);
    }
    
}

user.deleteUser = async (req, res, next) => {
    const { userId } = req.params;
    try{
        const user = await User.findById(userId).populate('superior'); 
        // user has superior
        console.log('delete user ', user.name);
        if(user.superior && user.superior._id){
            console.log('user has superior ', user.superior.name);
            const superior = user.superior;
            const index = superior.subordinate.indexOf(userId);
            superior.subordinate.splice(index, 1);
            // if user has child
            if(user.subordinate.length){
                console.log('user has subordinate. ', 'superior contains: ', superior.subordinate.length);
                superior.subordinate = superior.subordinate.concat(user.subordinate);
                console.log('superior now contains: ', superior.subordinate.length);
                await User.updateMany({"superior": user}, {$set: {"superior": superior}});
            }
            await superior.save();
        }else{
        // user don't have superior
            if(user.subordinate.length){
                await User.updateMany({"superior": user}, {$unset: {"superior": user}});
            }
        }
        await User.deleteOne({"_id": userId});
        res.status(200).json({message: 'delete success'});
    }
    catch(error){
        handleError(res, 'Failed to delete a user', error);
    }
}
