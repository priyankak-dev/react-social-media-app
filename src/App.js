import { Route, Routes, Link, useNavigate } from "react-router-dom";
import About from "./About";
import Footer from "./Footer";
import Header from "./Header";
import Home from "./Home";
import Missing from "./Missing";
import Nav from "./Nav";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import Post from "./Post";
import PostLayout from "./PostLayout";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import api from "./api/posts"
import Editpost from './Editpost'
import { DataProvider } from "./content/DataContenxt"

function App() {
  const [posts, setPosts] = useState([])

  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [postTitle, setPostTitle] = useState('')
  const [postBody, setPostBody] = useState('');

  const [editTitle, setEditTitle] = useState('')
  const [editBody, setEditBody] = useState('');
  const navigate = useNavigate()

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get('/posts');
        setPosts(response.data)
      } catch (err) {
        if (err.response) {
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.headers);
        } else {
          console.log(`Error: ${err.message}`);

        }
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    const filterResults = posts.filter((posts) =>
      ((posts.body).toLowerCase()).includes(search.toLowerCase())
      || ((posts.title).toLowerCase()).includes(search.toLowerCase()))

    setSearchResults(filterResults.reverse())
  }, [posts, search])

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), 'MMM dd, yyyy pp');
    const newPost = { id, title: postTitle, datetime, body: postBody }
    try {
      const response = await api.post('/posts', newPost);
      const allPosts = [...posts, response.data];
      setPosts(allPosts);
      setPostTitle('');
      setPostBody('');
      navigate('/')
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);

      }
    }

  }

  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMM dd, yyyy pp');
    const updatePost = { id, title: editTitle, datetime, body: editBody }
    try {

      const response = await api.put(`post/${id}`, updatePost)
      setPosts(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      navigate('/')


    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);

      }
    }
  }

  const handledelete = async (id) => {
    try {
      await api.delete(`posts/${id}`)
      const postsList = posts.filter(post => post.id !== id);
      setPosts(postsList)
      navigate('/')
    } catch (err) {
      if (err.response) {
        console.log(err.response.data);
        console.log(err.response.status);
        console.log(err.response.headers);
      } else {
        console.log(`Error: ${err.message}`);

      }
    }

  }


  return (
    <div className="App">
      <DataProvider >
        <Header title="Social Media App" />
        <Nav search={search} setSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Home posts={searchResults} />} />
          <Route path="post">

            <Route index element={<NewPost handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}

            />} />

            <Route path=":id" element={<PostPage posts={posts} handledelete={handledelete} />} />
          </Route >

          <Route path="/edit/:id" element={<Editpost posts={posts} handleEdit={handleEdit} editBody={editBody} setEditBody={setEditBody} editTitle={setEditTitle} setEditTitle={setEditTitle} />} />
          <Route path="about" element={<About />} />
          <Route path="*" element={<Missing />} />



        </Routes>

        <Footer />
      </DataProvider>
    </div>
  );
}

export default App;
