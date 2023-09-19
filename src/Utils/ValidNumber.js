export const  ValidNumber = (number) => {
    if(number !== ""){
        let RegNumber = new RegExp("^(?=.*[a-z])|(?=.*[A-Z])|(?=.*[!@#\$%\^&\*+_-])|(?=.*[A-Z])");
        if (RegNumber.test(number))
            return "form-error";
        else
            return "OKE";
    }
    else
    {
        return "OKE";
    }
}