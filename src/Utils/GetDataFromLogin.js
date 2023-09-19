
let UserData = JSON.parse(localStorage.getItem("Accountinfor")===""?"{}":localStorage.getItem("Accountinfor"));

export const GetDataFromLogin = (data) => {
    if (data === "AccountId") {
        return UserData === null || UserData.AccountId === undefined ? "Login pls" : UserData.AccountId;
    }
    else if (data === "AccountName") {
        return UserData === null || UserData.AccountName === undefined ? "Login pls" : UserData.AccountName;
    }
    else if (data === "Avatar") {
        return UserData === null || UserData.Avatar === undefined ? "../../assets/img/user.png" : UserData.Avatar;
    }
    else if (data === "Phone") {
        return UserData === null || UserData.Phone === undefined ? "Login pls" : UserData.Phone;
    } 
    else if (data === "Email") {
        return UserData === null || UserData.Email === undefined ? "Login pls" : UserData.Email;
    } 
    else if (data === "Birthday") {
        return UserData === null || UserData.Birthday === undefined ? "Login pls" : UserData.Birthday;
    }
    else if (data === "WarehouseId") {
        return UserData === null || UserData.WarehouseId === undefined ? "Login pls" : UserData.WarehouseId;
    }else if (data === "IdentityCard") {
        return UserData === null || UserData.IdentityCard === undefined ? "Login pls" : UserData.IdentityCard;
    }
}

