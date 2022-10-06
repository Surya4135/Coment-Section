// Common function to hide and show the form
const formToggle = () => {
  document.querySelector(".form_container").classList.toggle("hidden");
};

// Add button - onclick
document
  .getElementById("footer_add_button")
  ?.addEventListener("click", formToggle);

// Form close icon - On click
document.getElementById("formCloseIcon")?.addEventListener("click", formToggle);

// form onSubmit - Get form values and send to function
document.getElementById('myForm')?.addEventListener('submit', function (evt) {
  evt.preventDefault();
  let formValue = {
    name: document.getElementById("name").value.trim(),
    imageUrl: `/images/avatars/image-${document.getElementById("name").value.trim()}.png`,
    time: document.getElementById("time").value,
    likeCount: document.getElementById("likeCount").value,
    comment: document.getElementById("comment").value,
    replyList: [],
  };
  sendFormValueToJson(formValue);
  formToggle()
})

// common fetch API call
const commonFetch = ((id, body, methodName) => {
  let url = "http://localhost:3000/user"
  if (id !== "") {
    url = `${url}/${id}`
  }
  fetch(url, {
    method: methodName,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  })
})


// Sending form values to the json server
const sendFormValueToJson = (value) => {
  commonFetch('', value, 'POST')
  renderComments()
};


// Get list of records from json server and render in 
let commentValues = [];
const renderComments = () => {
  fetch("http://localhost:3000/user")
    .then((response) => response.json())
    .then((responseJson) => {
      commentValues = responseJson
      renderCommentsHTML(responseJson)
    })
    .catch((error) => {
      console.error(error);
    });
};

const renderCommentsHTML = (commentValues) => {
  commentValues?.map(({ name, imageUrl, likeCount, comment, time, replyList = [], id }) => {
    let html = `
            <div class="comment_container comment${id}">
              <div class="like_section">
                <div class="like_section_container">
                  <div class="increase_like_button" id=${`increment${id}`}>
                    <button class="like_button"><img src="/images/icon-plus.svg" alt=""/></button>
                  </div>
                  <div class="like_count">${likeCount}</div>
                  <div class="decrease_like_button" id=${`decrement${id}`}>
                    <button class="dislike_button"><img src="/images/icon-minus.svg" alt=""/></button>
                  </div>
                </div>
              </div>
              <div class="comment_details">
                <div class="comment_header">
                  <div class="comment_header_left">
                    <div class="user_image">
                      <img src=${imageUrl} alt="Profile" />
                    </div>
                    <div class="user_name">
                      <p>${name}</p>
                    </div>
                    <div class="time">
                      <p>${time}</p>
                    </div>
                  </div>
                  <div class="comment_header_right">
                    <div class="reply_button" id=reply_toggle${id}>
                      <button type="submit"><img src="/images/icon-reply.svg" /> Reply</button>
                    </div>
                  </div>
                </div>

                <div class="comment">
                  <p>
                 ${comment}
                  </p>
                </div>
              </div>
            </div>
           
            <div class="add_reply_container hidden_reply" id="hidden_reply_section${id}">
                <div class="image_container">
                  <img src="images/avatars/image-juliusomo.png" alt="Profile" />
                </div>
                <div class="add_reply_box" >
                  <textarea
                    class="add_reply_box_textarea"
                    rows="4"
                    id="get_reply${id}"
                    >@${name} </textarea>
                </div>
                <div class="reply_button" id="reply_submit${id}">
                  <button type="submit">REPLY</button>
                </div>
              </div>
 `;

    document.querySelector(".container").insertAdjacentHTML("beforeend", html);
    renderReplyList(replyList, id, name)
  });
}

let date = new Date()
const renderReplyList = (replyList, id, name) => {
  replyList?.map(({ description = "", replyLikeCount }, index) => {
    let html = `<div class="reply_main_container">
          <div class="reply_section" id="reply_section${id}${index}">
            <div class="like_section">
              <div class="like_section_container">
                <div class="increase_like_button" id="increment_reply${id}${index}">
                  <button><img src="/images/icon-plus.svg" alt=""/></button>
                </div>
                <div class="like_count">${replyLikeCount}</div>
                <div class="decrease_like_button" id="decrement_reply${id}${index}">
                  <button><img src="/images/icon-minus.svg" alt=""/></button>
                </div>
              </div>
            </div>
            <div class="reply_details">
              <div class="reply_header">
                <div class="reply_header_left">
                  <div class="user_image">
                    <img
                      src="/images/avatars/image-juliusomo.png"
                      alt="Profile"
                    />
                  </div>
                  <div class="user_name">
                    <p>juliusomo</p>
                  </div>
                  <div class="you"><p>you</p></div>
                  <div class="time">
                    <p>${date.getDate()}/${(date.getMonth() + 1)}/${date.getFullYear()}</p>
                  </div>
                </div>
                <div class="reply_header_right">
                  <button type="submit" class="delete_button" id="delete_reply${id}${index}">
                  <img src="/images/icon-delete.svg" alt=""/> Delete
                  </button>
                  <button type="submit" class="edit_button" id="edit_reply${id}${index}">
                  <img src="/images/icon-edit.svg" alt=""/> Edit
                  </button>
                </div>
              </div>
      
              <div class="reply_message" id="reply_message${id}${index}" >
                <p>
                  <span>@${name}</span> ${description}
                </p>
              </div>

              <div class="reply_message_edit hidden_reply_message_edit" id="reply_message_edit${id}${index}">
               <textarea id="reply_edit_message_area${id}${index}"> @${name} ${description}</textarea>
               <div class ="update_button">
               <button type="submit" id="reply_message_submit${id}${index}">UPDATE</button>
             </div>
              </div>
            </div>
          </div>
        </div>`
    document.querySelector(`.comment${id}`).insertAdjacentHTML("afterend", html);
  })

}

// Updating likecount of comment to JSON 
const updateLikeCount_comment = ((value, increment) => {
  let bodyValue = {
    "likeCount": increment ? +value.likeCount + 1 : (value.likeCount < 1 ? value.likeCount = 0 : +value.likeCount - 1)
  }
  commonFetch(value.id, bodyValue, 'PATCH')
});

// Updating likecount of reply to JSON
const updateLikeCount_reply = ((index, value, increment) => {
  let reply_likecount = value.replyList[index].replyLikeCount;
  let data = value.replyList
  data[index].replyLikeCount = increment ? +reply_likecount + 1 : (reply_likecount < 1 ? reply_likecount = 0 : +reply_likecount - 1)

  let body = {
    "replyList": data,
  }
  commonFetch(value.id, body, 'PATCH')
})


// Sending reply comment to JSON
const sendReplyToJSON = ((value, replyText) => {
  let replies = value.replyList;
  replies.push({
    description: replyText,
    replyLikeCount: 1
  })
  let bodyValue = {
    "replyList": replies,
  }
  commonFetch(value.id, bodyValue, 'PATCH')
})

// Deleting reply from db
const deleteReplyfromJSON = (parentIndex, childIndex) => {
  let replies = commentValues[parentIndex].replyList.filter((_reply, index) => {
    return childIndex != index;
  })
  let bodyValue = {
    "replyList": replies,
  }
  commonFetch(commentValues[parentIndex].id, bodyValue, 'PATCH')
}

// Editing replylist from db
const editReplyfromJSON = (parentIndex, index, textValue) => {
  let allReply = commentValues[parentIndex].replyList
  allReply[index].description = textValue.replace(`@${commentValues[parentIndex].name}`, "").trim()
  let bodyValue = {
    "replyList": allReply,
  }
  commonFetch(commentValues[parentIndex].id, bodyValue, 'PATCH')
}

setTimeout(() => {
  commentValues?.map((val, parentIndex) => {
    // like count for comment
    document.getElementById(`increment${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault()
      updateLikeCount_comment(val, true)
    })
    document.getElementById(`decrement${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault()
      updateLikeCount_comment(val, false)
    })

    //  Toggle reply container
    document.getElementById(`reply_toggle${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(`hidden_reply_section${val.id}`).classList.toggle("hidden_reply")
    })
    // Getting reply from reply container
    document.getElementById(`reply_submit${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault();
      let trimmedValue = document.getElementById(`get_reply${val.id}`).value.replace(`@${val.name}`, "").trim()
      sendReplyToJSON(val, trimmedValue)
      document.getElementById(`hidden_reply_section${val.id}`).classList.toggle('hidden_reply')
    })

    val.replyList.length > 0 &&
      val.replyList.map((_reply, index) => {
        // Like count for reply
        document.getElementById(`increment_reply${val.id}${index}`).addEventListener('click', (e) => {
          e.preventDefault()
          updateLikeCount_reply(index, val, true)
        })

        document.getElementById(`decrement_reply${val.id}${index}`).addEventListener('click', (e) => {
          e.preventDefault()
          updateLikeCount_reply(index, val, false)
        }) //Like count reply end is here

        // delete reply
        document.getElementById(`delete_reply${val.id}${index}`).addEventListener('click', (e) => {
          e.preventDefault()
          document.querySelector('.delete_modal').classList.remove('hidden_modal');
          document.querySelector(`.container`).style.opacity = 0.4;

          document.querySelector('.sure_delete_button').addEventListener('click', () => {
            deleteReplyfromJSON(parentIndex, index)
            document.querySelector(`.container`).style.opacity = 1;
          })

          document.querySelector('.dont_delete_button').addEventListener('click', () => {
            document.querySelector('.delete_modal').classList.add('hidden_modal');
            document.querySelector('.container').style.opacity = 1;
          })

        }) //Delete reply ended

        // Edit reply
        document.getElementById(`edit_reply${val.id}${index}`).addEventListener('click', () => {
          document.getElementById(`reply_message${val.id}${index}`).classList.toggle('hidden_reply_message')
          document.getElementById(`reply_message_edit${val.id}${index}`).classList.toggle('hidden_reply_message_edit')
          document.getElementById(`reply_section${val.id}${index}`).style.height = '180px'
        })
        document.getElementById(`reply_message_submit${val.id}${index}`).addEventListener('click', () => {
          let ReplyValue = document.getElementById(`reply_edit_message_area${val.id}${index}`).value
          editReplyfromJSON(parentIndex, index, ReplyValue)
          document.getElementById(`reply_section${val.id}${index}`).style.height = 'auto';
          document.getElementById(`reply_message${val.id}${index}`).classList.toggle('hidden_reply_message')
          document.getElementById(`reply_message_edit${val.id}${index}`).classList.toggle('hidden_reply_message_edit')
        }) //Edit reply end here
      })
  })
}, 1000);


renderComments();