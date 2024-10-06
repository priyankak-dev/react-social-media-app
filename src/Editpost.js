import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'

const Edit = ({posts, handleEdit,editTitle, editBody,setEditBody,setEditTitle}) => {
  const {id } = useParams()
  const post = posts.find(post => (post.id).toString() === id)

  useEffect (() =>{
    if(post){
      setEditTitle(post.title);
      setEditBody(post.body)
    }
  },[post, setEditTitle,setEditBody])
  return (
   <main className='NewPost'>
    {editTitle && 
    <>
    <h2>edit post</h2>
    <form className='newPostForm' onSubmit={(e) => e.preventDefault()}>
      <label>Title:</label>
      <input 
          id='postTitle'
          type='text'
          required
          value={editTitle}
          onChange={(e)=> setEditTitle(e.target.value)}
/>
     <label>Post:</label>
     <textarea 
     id='postBody'
     required
     value={editBody}
     onChange={(e)=> setEditBody(e.target.value)}
     >
      
     </textarea>
     <button type='submit' onClick={() => handleEdit(post.id)}>Update</button>
      
    </form>
    </>

    }
    {!editTitle && 
    <>
    <h2>post not found</h2>
    </>

    }

   </main>
  )
}

export default Edit
