# create a new user POST
#### UI API request: 
{
    name: String,
    rank: String,
    sex: String,
    startDate: Number,
    phone: Number,
    email: String,
    superiorId: String,
}
the superiorId is the _id of selected superior's User._id
superiorId exist means user has superior.

#### In the controller:
create a new user,
if superiorId exist
    1. find the superior
    2. assign the superior to new user
    3. add new user in superior's subrdinate list.
    4. save new user,
    5. save superior.
else 
save new user.

# list all user GET
#### UI API request:
null

#### In the controller:
Populate 'superior'.

###### In UI:
Superior.name is the value of superior column in the list table.
Subordinate.length is the count of subordinate. Display count if user has subordinate.

# get one user GET
#### UI API request;
null + param which should be a user id;
when user click a superior's name in the table, the param should be superior's id
when user click the count of subordinate, the param should be the clicked row user's id

#### In the controller:
populate 'superior' and 'subordinate'

###### In UI:
when user click a superior's name in the table,  display response user.
when user click the count of subordinate, display response.subordinate : User[];

# update one user POST
#### UI API request;
param which should be the selected user's id;
req:
{
    name: String,
    rank: String,
    sex: String,
    startDate: Number,
    phone: Number,
    email: String,
    superiorId: String | '',
}

user is not able to change their subordinate.
user can modify their superior.
if superiorId !== user.superior._id, means superior changed.
the superiorId is the _id of selected superior's User._id
superiorId exist means user has superior.


#### In the controller:
    find user and get the subordinate;
    if user's superior in db is different with superiorId
        find preSuperior.
        remove user from preSuperior's subordinate list
        save preSuperior
    find Superior
    add user into superior's subordiante list
    save user
    save superior

# delete one user DELETE
#### UI API request;
param which should be a user id;
(note: DELETE method don't take req)

#### In the controller:
find the user;
if user has superior:
    remove user from superior's subordinate list.
if user has subordinate:
    find all the subordinate, and change their subordinate to user's superior or none.
save superior
save all subordinate
delete user

###### In UI:
snackbar alter, user delete success or failed (with dismiss).
