"use client";

import dynamic from 'next/dynamic';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import AlertBox from '@components/Alert';
import useMetadata from '@hooks/metadata';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const PublishBlog = () => {
  // set title for page
  useMetadata('Publish Blog - Blogotypo', `Publish Blog in blogotypo`);

  const router = useRouter();
  // for edit blog search params 
  const blogIdFromParams = useSearchParams().get('blogId');

  // for form submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [blogData, setBlogData] = useState({
    title: '',
    categories: [],
    thumbnail_image: {},
    content: '',
  });
  const [currentCategory, setCurrentCategory] = useState('');

  // jodit config
  const editor = useRef(null);
  const config = useMemo(() => ({
    readonly: false, // all options from https://xdsoft.net/jodit/docs/,
    placeholder: 'Start typing...',
    uploader: {
      insertImageAsBase64URI: true,
    },
  }), []);

  // alert
  const [showAlert, setShowAlert] = useState(false);
  const [alertData, setAlertData] = useState({
    variant: '',
    dismissible: true,
    header: '',
  });

  // Handle 'Enter' key press to add input category
  const handleCategoryEnter = (e) => {
    if (e.key === 'Enter' && currentCategory.trim() !== '') {
      e.preventDefault();
      setBlogData((prev) => ({
        ...prev,
        categories: [...prev?.categories || [], currentCategory],
      }));
      // reset current category data
      setCurrentCategory('');
    }
  };

  // Handle remove input category
  const handleRemoveCategory = (indexToRemove) => {
    setBlogData((prev) => ({
      ...prev,
      categories: prev.categories.filter((_, index) => index !== indexToRemove),
    }));
  };

  const handleSubmitBlog = async (e) => {
    e.preventDefault();
    if (!blogData?.title || !blogData?.content || !blogData?.thumbnail_image instanceof File) {
      setAlertData((prev) => ({ ...prev, header: "All Fields Required!", variant: 'danger' }));
      setShowAlert(true);
      return;
    }

    if (blogData?.categories.length === 0) {
      setAlertData((prev) => ({ ...prev, header: 'Ensure you press "Enter" after each category!', variant: 'warning' }));
      setShowAlert(true);
      return;
    }

    // set submitting true to disable submit btn
    setIsSubmitting(true);

    const formData = new FormData();

    // Append file
    formData.append("thumbnail_image", blogData.thumbnail_image);

    // Append blogData fields title, content, categories
    formData.append("blogData", JSON.stringify(blogData));

    try {
      const reqUrl = blogIdFromParams ? '/api/blog/update' : '/api/blog/post';
      const response = await fetch(reqUrl, {
        method: 'POST',
        body: formData
      });

      const text = await response.text();
      if (response.ok) {
        router.push('/my-blogs');
      } else {
        setAlertData((prev) => ({ ...prev, header: text, variant: "danger" }));
        setShowAlert(true);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log('Error while posting blog: ', error);
      setAlertData((prev) => ({ ...prev, header: "Internal Server Error!", variant: "danger" }));
      setShowAlert(true);
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      if (blogIdFromParams === null || blogIdFromParams === 'null') return;
      try {
        const response = await fetch(`/api/blog/get?blogId=${blogIdFromParams}`, { method: 'GET' });
        const data = await response.json();

        if (!response.ok) {
          setAlertData((prev) => ({ ...prev, header: data.msg, variant: 'danger' }));
          setShowAlert(true);
          // redirect if unauthorized blog id req
          if (data.msg === 'Unauthorized Access!') {
            router.push('/publish-blog')
          }
          return;
        }
        setBlogData(data.data);
      } catch (error) {
        console.log('error while fetching blog data ', error);
        setAlertData((prev) => ({ ...prev, header: 'Error while fetching blog details', variant: 'danger' }));
        setShowAlert(true);
      }
    }

    fetchBlog();
  }, [blogIdFromParams]);


  return (
    <>
      <form onSubmit={handleSubmitBlog}>
        <h1 className="text-2xl md:text-4xl montserrat_alternates_font font-bold">
          {blogIdFromParams ? 'Edit Blog' : 'Publish Blog'}
        </h1>

        <div className="text-base md:text-lg md:p-4 max-md:py-2 flex flex-col gap-3 md:gap-4">

          {/* title  */}
          <div className="flex flex-col">
            <label className='font-medium' htmlFor="title">Title of the blog:</label>
            <textarea
              name="title"
              id="title"
              className='outline-none px-2 py-2 border shadow-md rounded h-20'
              placeholder='Title of the blog'
              onChange={(e) => setBlogData((prev) => ({ ...prev, title: e.target.value }))}
              value={blogData?.title}
            />
          </div>


          <div className="grid md:grid-cols-2 items-center gap-3 md:gap-4">
            {/* category  */}
            <div className="w-full">
              <label className='font-medium' htmlFor="">Category of blog:</label>
              {/* Render category as tags */}
              <div className='flex flex-wrap w-full gap-2 md:p-2 max-md:p-1 rounded bg-white shadow-md'>
                {blogData['categories']?.map((input, index) => (
                  <div key={index} className="bg-blue-200 hover:bg-blue-300 rounded px-1 py-0.5 md:px-2 md:py-1">
                    <span>{input}</span>
                    <button
                      onClick={() => handleRemoveCategory(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <i className="fa-solid fa-xmark mx-1" />
                    </button>
                  </div>
                ))}

                {/* Input field */}
                <textarea
                  value={currentCategory}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                  onKeyDown={handleCategoryEnter}
                  placeholder="Category"
                  className='border-none p-2 rounded w-full focus:outline-none bg-transparent flex-grow'
                  style={{ resize: 'none', }}
                  rows={1} // One-line by default, expands automatically
                />
              </div>
            </div>

            {/* thumnail image  */}
            <div className="flex flex-col gap-2">
              <label className='font-medium' htmlFor="thumbnail_image">Thumbnail Image:</label>
              <Form.Group controlId="thumbnail_image">
                <Form.Control
                  type="file"
                  name="thumail_image"
                  accept=".png, .jpg, .jpeg, .ico"
                  onChange={(e) => setBlogData((prev) => ({ ...prev, thumbnail_image: e.target.files[0] }))}
                  className='shadow-md'
                />
              </Form.Group>
            </div>
          </div>

          {/* content  */}
          <div className="">
            <label className='font-medium' htmlFor="content">Content:</label>
            <JoditEditor
              ref={editor}
              value={blogData.content}
              config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={newContent => setBlogData((prev) => ({ ...prev, content: newContent }))}
              onChange={newContent => setBlogData((prev) => ({ ...prev, content: newContent }))}
              className='shadow-md'
            />
          </div>
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`relative overflow-hidden bg-theme_4 text-theme_1 md:mx-4 px-8 py-2 font-semibold rounded-lg hover:text-white transition-all duration-500 group shadow-md ${isSubmitting ? 'cursor-not-allowed opacity-55' : 'opacity-100'}`}
        >
          <span
            className="absolute inset-0 bg-theme_5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"
          />
          <span className="relative z-10">
            {blogIdFromParams
              ? isSubmitting
                ? (<>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />  Saving...
                </>)
                : "Save Changes"
              : isSubmitting
                ? (<>
                  <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />  Creating...
                </>)
                : "Create"
            }
          </span>
        </button>

      </form>

      <AlertBox
        show={showAlert}
        setShow={setShowAlert}
        variant={alertData?.variant}
        dismissible={alertData?.dismissible}
        header={alertData?.header}
        position={"top-right-with-space"}
      />
    </>
  )
}

export default PublishBlog
