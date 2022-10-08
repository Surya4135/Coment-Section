// Common function to hide and show the form
const formToggle = () => {
  document.querySelector(".form_container").classList.toggle("hidden");
};

// Add button - onclick
document.getElementById("footer_add_button")?.addEventListener("click", formToggle);

// Form close icon - On click
document.getElementById("formCloseIcon")?.addEventListener("click", formToggle);

// form onSubmit - Get form values and send to function
document.getElementById('myForm')?.addEventListener('submit', function (evt) {
  evt.preventDefault();
  const formValue = {
    name: document.getElementById("name").value.trim(),
    imageUrl: `/images/avatars/image-${document.getElementById("name").value.trim()}.png`,
    time: document.getElementById("time").value,
    likeCount: document.getElementById("likeCount").value,
    comment: document.getElementById("comment").value,
  };
  sendFormValueToJson(formValue);
  formToggle();
})

// common fetch API call
const userCommonFetch = ((id, body, methodName) => {
  let url = "http://localhost:3000/user";
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
  });
});

const replyCommonFetch = ((replyid, data, methodName) => {
  let url, fetchContent;
  url = "http://localhost:3000/userReplyList";
  if (replyid !== '') {
    url = `${url}/${replyid}`
  }
  fetchContent = {
    method: methodName,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  };
  if (methodName !== 'DELETE') {
    fetchContent.body = JSON.stringify(data);
  }
  fetch(url, fetchContent);
});


// Sending form values to the json server
const sendFormValueToJson = (value) => {
  userCommonFetch('', value, 'POST');
  renderComments();
};


// Get list of records from json server and render in 
let commentValues = [];
const renderComments = () => {
  fetch("http://localhost:3000/user")
    .then((response) => response.json())
    .then((responseJson) => {
      commentValues = responseJson;
      renderCommentsHTML(responseJson);
    })
    .catch((error) => {
      console.error(error);
    });
};

let userReplyList = [];
fetch("http://localhost:3000/userReplyList")
  .then((response) => response.json())
  .then((responseJson) => {
    userReplyList = responseJson;
  })
  .catch((error) => {
    console.error(error);
  });

const renderCommentsHTML = (commentValues) => {
  commentValues?.map(({ name, imageUrl, likeCount, comment, time, id }) => {
    let replyList = [];
    let replyId = [];
    userReplyList.map((value) => {
      if (value.userId === id) {
        replyList.push(value);
        replyId.push(value.id);
      }

    })
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
    renderReplyList(replyList, replyId, id, name);
  });
}

let date = new Date();
const renderReplyList = (replyList, replyId, commentId, name) => {
  replyList?.map(({ description = "", replyLikeCount, _userId, id }) => {
    let html = `<div class="reply_main_container">
            <div class="reply_section" id="reply_section${commentId}${id}">
              <div class="like_section">
                <div class="like_section_container">
                  <div class="increase_like_button" id="increment_reply${commentId}${id}">
                    <button><img src="/images/icon-plus.svg" alt=""/></button>
                  </div>
                  <div class="like_count">${replyLikeCount}</div>
                  <div class="decrease_like_button" id="decrement_reply${commentId}${id}">
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
                    <button type="submit" class="delete_button" id="delete_reply${commentId}${id}">
                    <img src="/images/icon-delete.svg" alt=""/> Delete
                    </button>
                    <button type="submit" class="edit_button" id="edit_reply${commentId}${id}">
                    <img src="/images/icon-edit.svg" alt=""/> Edit
                    </button>
                  </div>
                </div>
        
                <div class="reply_message" id="reply_message${commentId}${id}" >
                  <p>
                    <span>@${name}</span> ${description}
                  </p>
                </div>
  
                <div class="reply_message_edit hidden_reply_message_edit" id="reply_message_edit${commentId}${id}">
                 <textarea id="reply_edit_message_area${commentId}${id}"> @${name} ${description}</textarea>
                 <div class ="update_button">
                 <button type="submit" id="reply_message_submit${commentId}${id}">UPDATE</button>
               </div>
                </div>
              </div>
            </div>
          </div>`
    document.querySelector(`.comment${commentId}`).insertAdjacentHTML("afterend", html);
  });
};

// Updating likecount of comment to JSON 
const updateLikeCount_comment = ((value, increment) => {
  let bodyValue = {
    "likeCount": increment ? +value.likeCount + 1 : (value.likeCount < 1 ? value.likeCount = 0 : +value.likeCount - 1)
  };
  userCommonFetch(value.id, bodyValue, 'PATCH');
});

// Updating likecount of reply to JSON
const updateLikeCount_reply = ((_replyid, reply, increment) => {
  let reply_likecount = reply.replyLikeCount;
  let data = reply.replyLikeCount;
  data = increment ? +reply_likecount + 1 : (reply_likecount < 1 ? reply_likecount = 0 : +reply_likecount - 1);
  let body = {
    "replyLikeCount": data,
  }
  replyCommonFetch(reply.id, body, 'PATCH');
});


// Sending reply comment to JSON
const sendReplyToJSON = ((value, replyText) => {
  let bodyValue = {
    description: replyText,
    userId: value.id,
    replyLikeCount: 1
  };
  replyCommonFetch('', bodyValue, 'POST');
});

// Deleting reply from db
const deleteReplyfromJSON = (replyId) => {
  replyCommonFetch(replyId, '', 'DELETE');
};

// Editing replylist from db
const editReplyfromJSON = (name, reply, replyId, textValue) => {
  let editedReply = reply.description;
  editedReply = textValue.replace(`@${name}`, "").trim();

  let bodyValue = {
    "description": editedReply,
  };
  replyCommonFetch(replyId, bodyValue, 'PATCH')
};

setTimeout(() => {
  commentValues?.map((val) => {
    // like count for comment
    document.getElementById(`increment${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault();
      updateLikeCount_comment(val, true);
    });
    document.getElementById(`decrement${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault();
      updateLikeCount_comment(val, false);
    });

    //  Toggle reply container
    document.getElementById(`reply_toggle${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(`hidden_reply_section${val.id}`).classList.toggle("hidden_reply");
    });
    // Getting reply from reply container
    document.getElementById(`reply_submit${val.id}`)?.addEventListener('click', (e) => {
      e.preventDefault();
      let trimmedValue = document.getElementById(`get_reply${val.id}`).value.replace(`@${val.name}`, "").trim();
      sendReplyToJSON(val, trimmedValue);
      document.getElementById(`hidden_reply_section${val.id}`).classList.toggle('hidden_reply');
    });

    userReplyList.length > 0 &&
      userReplyList.map((reply, index) => {
        if (val.id === reply.userId) {

          // Like count for reply
          document.getElementById(`increment_reply${val.id}${reply.id}`).addEventListener('click', (e) => {
            e.preventDefault();
            updateLikeCount_reply(reply.id, reply, true);
          });

          document.getElementById(`decrement_reply${val.id}${reply.id}`).addEventListener('click', (e) => {
            e.preventDefault();
            updateLikeCount_reply(reply.id, reply, false);
          }); //Like count reply end is here

          // delete reply
          document.getElementById(`delete_reply${val.id}${reply.id}`).addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('.delete_modal').classList.remove('hidden_modal');
            document.querySelector(`.container`).style.opacity = 0.4;

            document.querySelector('.sure_delete_button').addEventListener('click', () => {
              deleteReplyfromJSON(reply.id);
              document.querySelector(`.container`).style.opacity = 1;
            });

            document.querySelector('.dont_delete_button').addEventListener('click', () => {
              document.querySelector('.delete_modal').classList.add('hidden_modal');
              document.querySelector('.container').style.opacity = 1;
            });

          }) //Delete reply ended

          // Edit reply
          document.getElementById(`edit_reply${val.id}${reply.id}`).addEventListener('click', () => {
            document.getElementById(`reply_message${val.id}${reply.id}`).classList.toggle('hidden_reply_message');
            document.getElementById(`reply_message_edit${val.id}${reply.id}`).classList.toggle('hidden_reply_message_edit');
            document.getElementById(`reply_section${val.id}${reply.id}`).style.height = '180px';
            document.getElementById(`edit_reply${val.id}${reply.id}`).addEventListener('click', () => {
              document.getElementById(`reply_section${val.id}${reply.id}`).style.height = 'auto';
            });
          });
          document.getElementById(`reply_message_submit${val.id}${reply.id}`).addEventListener('click', () => {
            let ReplyValue = document.getElementById(`reply_edit_message_area${val.id}${reply.id}`).value;
            editReplyfromJSON(val.name, reply, reply.id, ReplyValue);
            document.getElementById(`reply_section${val.id}${reply.id}`).style.height = 'auto';
            document.getElementById(`reply_message${val.id}${reply.id}`).classList.toggle('hidden_reply_message');
            document.getElementById(`reply_message_edit${val.id}${reply.id}`).classList.toggle('hidden_reply_message_edit');
          });//Edit reply end here
        };
      });
  });
}, 1000);

renderComments();