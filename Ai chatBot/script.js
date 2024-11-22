// Accessing 
let prompt = document.querySelector("#prompt")
let chatContainer = document.querySelector(".chat-container")
let imageButton = document.querySelector("#image")
let image = document.querySelector("#image img")
let imageInput = document.querySelector("#imageinput")
let submitButton = document.querySelector("#submit")

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAuR0sWcHJFAaQzBMBmExAN6rvWCD-sym8";

let user = {
  message:null,
  file:{
    mime_type:null,
    data:null
  }
}

async function generateResponse(aiChatBox){

    // this helps get the response from the browser console to the ai-chat-box in the "ai-chat-area"
  let text = aiChatBox.querySelector(".ai-chat-area")

    // it is setup, which send my request into gemini API
      // m h b are the curl commands
  let RequestOption = {
    method:"POST",
    headers:{'Content-Type': 'application/json'},
    body:JSON.stringify({
      "contents":[
        {"parts":[{"text":user.message}, (user.file.data ? [{"inline_data" : user.file}] : [])
        ]
      }]
    })
  }

  // API calls, if response then try block to handle the exception , if happens
  try{
    let response = await fetch(Api_Url, RequestOption)
    //after fetching, we have to convert that into JSON for readable format
    let data = await response.json()
      // we get this data,candidates,content,parts from the webbrowser console
    let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g,"$1").trim()
    
      // get the response from browser console to the ai chat box ui
    text.innerHTML = apiResponse
  }
    catch(error){
        console.log(error);
    }
    finally{
      chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})

      // for removing after done with response, the image. but after next prompt image is still as search so for that removal do null of user file
      image.src = `img.svg`
      image.classList.remove("choose")
      user.file = {}
    }
}


// creating chatboxes
function createChatBox(html, classes){
    // to create any div element, we use document.createElement.. and we want to create div so in argument pass "div"
  let div = document.createElement("div") // Select the <div> element
  div.innerHTML = html 
  div.classList.add(classes)// Adds the "new-class" to the <div>
  return div // catch by userChatBox var. from its originally called
}

function handleChatResponse(userMessage){

  user.message = userMessage

  let html = `<img src="user.png" alt="" id="userImage" width="8%">
        <div class="user-chat-area">
           ${user.message}
           
           ${user.file.data ? `<img src = "data:${user.file.mime_type};base64,${user.file.data}" class = "chooseimg">` : ""}
        </div>`
        //in above user.file.data takes image in chat box area


        // prompt (input) will be removes after hitting enter."NULL"
        prompt.value = ""

        // user chat area & image fetch dynamically, 
          // createChatBox() is used for both user&ai chat box
            // "user-chat-box" this is the class which passes it into fn createChatBox
        let userChatBox = createChatBox(html, "user-chat-box")
        chatContainer.appendChild(userChatBox) // when we write prompt, it gives dynamic response... ADD/declare querySelector in top 

        //handling automatically scroll as per response, by using built-in fn. in JS called "scrollTo"
          // scroll from top as per the height of chatContainer
        chatContainer.scrollTo({top:chatContainer.scrollHeight, behavior:"smooth"})


        // after 600milliseconds ai chatbox will response
        setTimeout(()=>{
          let html = `<img src="ai.png" alt="" id="aiImage" width="10%">
        <div class="ai-chat-area">
        <img src="loading.webp" alt="" id="load" width="40px">
        </div>`
        let aiChatBox = createChatBox(html, "ai-chat-box")
        chatContainer.appendChild(aiChatBox) // to pass aiChatBox in argu. for -> jo v response aai ham uska text likh pai

        generateResponse(aiChatBox)

        }, 600)
      }        


// first code 
prompt.addEventListener("keydown", (e)=>{
  if(e.key == "Enter"){
    handleChatResponse(prompt.value)
  }
})



// choosing file option for image button (when click), from prompt area
imageButton.addEventListener("click", ()=>{
  imageButton.querySelector("input").click()
})


//button submit response
submitButton.addEventListener("click",()=>{
  handleChatResponse(prompt.value)
})


imageInput.addEventListener("change",()=>{
    // user file stored in the file var.
  const file = imageInput.files[0]
    // if file is not present then return
  if(!file) return 
    // creating obj of FileReader
  let reader = new FileReader()
  // when file is loading then event comes in Action
  reader.onload = (e)=>{
    // result comes in base64, so we have to convert it that data
        // TEXT and IMAGE input API, target,result comes from browser console
   let base64String = e.target.result.split(",")[1]
   user.file={
    mime_type:file.type,
    data:base64String
  }
  // image shows in input button field, changing the image src
  image.src = `data:${user.file.mime_type};base64,${user.file.data}`
  image.classList.add("choose")
  }

  

  reader.readAsDataURL(file)
})



  