import eel
import json
from datetime import datetime


eel.init("Forntend")


try:
    with open("Project.json","r") as f:
        pr_data = json.load(f)
except FileNotFoundError:
    pr_data = []


@eel.expose
def login(name,mail,password):

    data = {
        "User":name,
        "Mail":mail,
        "Password":password,
        "Date":datetime.now().strftime("%d/%m/%Y, %H:%M:%S")
    }

    with open("Login.json","w") as f:
        json.dump(data,f,indent=4)

    return{"status":200}


@eel.expose
def load(name,desc,status):

    new_data = {
        "Project":name,
        "Desc":desc,
        "Status":status,
        "Date":datetime.now().strftime("%d/%m/%Y")
    }

    pr_data.append(new_data)

    with open("Project.json","w") as fw:
        json.dump(pr_data,fw,indent=4)

    return{"status":200}


@eel.expose
def projects():

    processing = 0
    pending = 0
    complete = 0

    try:
        with open("Project.json","r") as f:
            pr_data = json.load(f)
    except FileNotFoundError:
        pr_data = []

    total = len(pr_data)

    for i in pr_data:
        if i["Status"] == "processing":
            processing += 1

    for i in pr_data:
        if i["Status"] == "complete":
            complete += 1
    
    for i in pr_data:
        if i["Status"] == "pending":
            pending += 1

    

    return{
        "status":200,
        "tot":total,
        "complete":complete,
        "processing":processing,
        "pending":pending,
        "all":pr_data
    }


@eel.expose
def savechange(index, pname, desc, status):
    try:
        # Load existing project data
        with open("Project.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        # Check whether the selected project exists
        if not isinstance(data, list) or not (0 <= index < len(data)):
            return {"status": 404, "message": "Project not found"}

        # Update the selected project
        data[index]["Project"] = pname
        data[index]["Desc"] = desc
        data[index]["Status"] = status
        data[index]["Date"] = datetime.now().strftime("%d/%m/%Y")

        # Save the updated list back to JSON
        with open("Project.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        return {"status": 200, "message": "Project updated successfully"}

    except Exception as e:
        print("Update error:", e)
        return {"status": 500, "message": str(e)}



@eel.expose
def remove(rpass, index):
    try:
        # Verify password
        with open("Login.json", "r", encoding="utf-8") as f:
            login_data = json.load(f)

        if login_data["Password"] != rpass:
            return {"code": 401, "message": "Wrong password"}

        # Load projects
        with open("Project.json", "r", encoding="utf-8") as f:
            data = json.load(f)

        # Validate the selected index
        if not isinstance(data, list) or not (0 <= index < len(data)):
            return {"code": 404, "message": "Project not found"}

        # Remove the selected project
        deleted_project = data.pop(index)

        # Save updated projects
        with open("Project.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        return {
            "code": 200,
            "message": "Project deleted successfully",
            "project": deleted_project["Project"]
        }

    except Exception as e:
        print("Delete error:", e)
        return {"code": 500, "message": "Something went wrong"}


@eel.expose
def logout(dpass):

    with open("Login.json", "r", encoding="utf-8") as f:
        login_data = json.load(f)

    if dpass == login_data["Password"]:
        return {"code":200}
    else:
        return {"code":500}


@eel.expose
def search(item):
    try:
        with open("Project.json", "r") as f:
            pr_data = json.load(f)

    except FileNotFoundError:
        return {"code": 500}

    name = item.strip().lower()

    for index, project in enumerate(pr_data):
        if project["Project"].strip().lower() == name:
            return {
                "code": 200,
                "index": index,
                "project": project["Project"]
            }

    return {"code": 404}


eel.start("login.html")