async function logout() 
{
    const dpass = prompt("For Logout please enter your password: ");

    const result = await eel.logout(dpass)();

    if (result["code"] == 200) 
    {
        localStorage.removeItem("manager");
        window.location.href = "login.html";
    }
    else{
        alert("Wrong Password please retry......");
        return;
    }

}