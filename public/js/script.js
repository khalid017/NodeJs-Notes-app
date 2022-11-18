
let list=document.getElementById("task")//parent for tasks div

let btn = document.getElementById("btn")
btn.addEventListener("click",()=>{
    if( (document.getElementById("input").value)=="")
    {
        alert("Enter Task!")
    }
})
  
const getNotes = new XMLHttpRequest()
getNotes.open("GET","http://localhost:3000/notes")
getNotes.send()

getNotes.addEventListener("load",()=>{
    let notes = JSON.parse(getNotes.responseText)// get req bhjne se array aa jayega containing objects
    notes.forEach((t)=>
    {
        populateDom(t.note,t._id)
    })
 
})

function populateDom(note,id)
 {
    let taskDiv=document.createElement("div")
    taskDiv.setAttribute("class","items")
    taskDiv.setAttribute("id",id)
    list.appendChild(taskDiv)
    
    let notes=document.createElement("p")
    notes.innerText = note
    taskDiv.appendChild(notes)


    let edit=document.createElement("button")
    edit.setAttribute("class","edit")
    edit.innerHTML="Edit"
    taskDiv.appendChild(edit)

    let del=document.createElement("button")
    del.setAttribute("class","edit")
    del.innerHTML="X"
    taskDiv.appendChild(del)

    let line=document.createElement("hr")
    taskDiv.appendChild(line)

        del.addEventListener("click",function(e)
        {
            list.removeChild(taskDiv)
            const deleteTodo = new XMLHttpRequest()
            let id = e.target.parentElement.id // for accessing id of delete btns parent div 
            deleteTodo.open("DELETE",`http://localhost:3000/note/${id}`)
            deleteTodo.send()
        })

    edit.addEventListener('click', (e) => {
        let newNote=prompt("Edit Note")
        if(newNote==""){
          alert("Edit Note")
        }
        else{
            taskDiv.children[0].innerText=newNote
            const updateNote = new XMLHttpRequest()
            let id = e.target.parentElement.id
           updateNote.open("PUT",`http://localhost:3000/note/${id}`)
           updateNote.setRequestHeader("content-type","application/json")
           updateNote.send(JSON.stringify({newNote}))
        }
       
    })
 }

   

   



