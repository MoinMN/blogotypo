"use client";

import dynamic from 'next/dynamic';
import Form from 'react-bootstrap/Form';
import Spinner from 'react-bootstrap/Spinner';
import 'bootstrap/dist/css/bootstrap.min.css';

import { useState, useRef, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from 'next/navigation';

import useMetadata from '@hooks/metadata';
import { useUI } from '@context/UIContext';
import { fetchDashboardRecommendBlog } from '@redux/slices/blog/dashboard.recommend.slice';
import { fetchCategoryBlogs } from '@redux/slices/blog/category.slice';
import Loading from '@app/loading';
import { useAddMyBlogMutation, useUpdateMyBlogMutation } from '@redux/services/myBlogsApi';
import { useDispatch } from '@node_modules/react-redux/dist/react-redux';

const JoditEditor = dynamic(() => import('jodit-react'), { ssr: false });

const PublishBlog = () => {
  // set title for page
  useMetadata('Publish Blog - Blogotypo', `Publish Blog in blogotypo`);

  const { showAlert } = useUI();
  const dispatch = useDispatch();

  const router = useRouter();
  // for edit blog search params 
  const blogIdFromParams = useSearchParams().get('blogId');

  const [isLoading, setIsLoading] = useState(
    blogIdFromParams && blogIdFromParams !== "null"
  );

  const [addMyBlog] = useAddMyBlogMutation();
  const [updateMyBlog] = useUpdateMyBlogMutation();

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
    readonly: false,
    placeholder: "Start typing...",

    uploader: {
      insertImageAsBase64URI: true,
    },

    /* Disable color + background tools */
    removeButtons: [
      "brush",
      "font",
      "fontsize",
      "paragraph",
      "superscript",
      "subscript",
      "classSpan",
      "color",
      "background"
    ],

    /* Clean paste behavior */
    askBeforePasteHTML: false,
    askBeforePasteFromWord: false,
    defaultActionOnPaste: "insert_clear_html",
    pastePlain: true,

    /* Clean internal HTML */
    cleanHTML: {
      removeStyle: true,
      removeClass: true,
      fillEmptyParagraph: false
    }

  }), []);

  // Handle 'Enter' key press to add input category
  const handleCategoryEnter = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      if (!currentCategory.trim()) return;

      const newCategories = currentCategory
        .split(",")
        .map((cat) =>
          cat
            .trim()
            .replace(/[^a-zA-Z0-9 ]/g, "") // remove special chars, allow numbers
        )
        .filter((cat) => cat !== "");

      if (newCategories.length === 0) return;

      setBlogData((prev) => {
        const existing = prev?.categories || [];

        const merged = [...existing, ...newCategories];
        const unique = [...new Set(merged)];

        return {
          ...prev,
          categories: unique,
        };
      });

      setCurrentCategory("");
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
    if (isSubmitting) return;

    if (
      !blogData?.title?.trim() ||
      !blogData?.content?.trim()
    ) {
      showAlert("All Fields Required!", "danger");
      return;
    }

    if (!blogIdFromParams && !(blogData?.thumbnail_image instanceof File)) {
      showAlert("Hero Image required for the blog post!", "danger");
      return;
    }

    // auto include remaining typed category
    let finalCategories = [...(blogData.categories || [])];

    if (currentCategory.trim()) {
      const extraCategories = currentCategory
        .split(",")
        .map((cat) =>
          cat.trim().replace(/[^a-zA-Z0-9 ]/g, "")
        )
        .filter((cat) => cat !== "");

      finalCategories = [
        ...new Set([...finalCategories, ...extraCategories]),
      ];
    }

    if (finalCategories.length === 0) {
      showAlert("At least one category required!", "danger");
      return;
    }

    setBlogData((prev) => ({
      ...prev,
      categories: finalCategories,
    }));

    // set submitting true to disable submit btn
    setIsSubmitting(true);

    const formData = new FormData();

    if (blogData.thumbnail_image instanceof File) {
      formData.append("thumbnail_image", blogData.thumbnail_image);
    }

    // Append blogData fields title, content, categories
    formData.append(
      "blogData",
      JSON.stringify({
        ...blogData,
        categories: finalCategories,
      })
    );

    try {
      const reqUrl = '/api/blog/';
      const response = await fetch(reqUrl, {
        method: blogIdFromParams ? 'PATCH' : 'POST',
        body: formData
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        if (blogIdFromParams) {
          await updateMyBlog(result?.updatedBlog);
        } else {
          await addMyBlog(result?.newBlog);
        }
        dispatch(fetchDashboardRecommendBlog(null));
        result?.newBlog?.categories?.forEach((category) => {
          dispatch(fetchCategoryBlogs(category));
        });

        router.push('/my-blogs');
      } else {
        showAlert(result?.msg || "Failed to update the blog!", "danger");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.log('Error while posting blog: ', error);
      showAlert("Internal Server Error!", "danger");
      setIsSubmitting(false);
    }
  }

  useEffect(() => {
    const fetchBlog = async () => {
      if (!blogIdFromParams || blogIdFromParams === "null") {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/blog/edit/${blogIdFromParams}`, { method: 'GET' });
        const data = await response.json();

        if (!response.ok) {
          showAlert(data?.msg || "failed to fetch blog data!", "danger");
          // redirect if unauthorized blog id req
          if (data.msg === 'Unauthorized Access!') {
            router.push('/publish-blog')
          }
          return;
        }
        setBlogData(data);
      } catch (error) {
        console.log('error while fetching blog data ', error);
        showAlert("Error while fetching blog details!", "danger");
      } finally {
        setIsLoading(false);
      }
    }

    fetchBlog();
  }, [blogIdFromParams]);

  if (isLoading) return <Loading />

  return (
    <div className="max-w-6xl mx-auto max-md:px-3 md:px-6 max-md:py-5 md:py-8">
      <form onSubmit={handleSubmitBlog} className="flex flex-col max-md:gap-4 md:gap-6">

        {/* ── Header ── */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-px bg-indigo-500" />
              <span className="text-indigo-500 dark:text-indigo-400 max-md:text-[10px] md:text-xs font-semibold tracking-widest uppercase">
                Creator Studio
              </span>
            </div>

            <h1
              className="max-md:text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              {blogIdFromParams ? "Edit Blog" : "Publish Blog"}
            </h1>
          </div>

          {isSubmitting && (
            <div className="flex items-center gap-2 text-indigo-500 dark:text-indigo-400 max-md:text-xs md:text-sm font-medium">
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              Saving...
            </div>
          )}
        </div>

        {/* ── Main Editor Card ── */}
        <div className="bg-gray-100 dark:bg-[#0f0f22] border border-gray-200 dark:border-gray-100/[0.08] rounded-2xl overflow-hidden">

          {/* ── Top Section ── */}
          <div className="max-md:p-3 md:p-5 flex flex-col max-md:gap-4 md:gap-5">

            {/* ── Title ── */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="title"
                className="text-gray-700 dark:text-gray-300 max-md:text-xs md:text-sm font-semibold uppercase tracking-wide"
              >
                Blog Title
              </label>

              <textarea
                id="title"
                value={blogData?.title}
                disabled={isSubmitting}
                onChange={(e) =>
                  setBlogData((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                placeholder="Write an engaging blog title..."
                rows={2}
                className="
                w-full resize-none outline-none
                bg-gray-50 dark:bg-[#0a0a14]
                border border-gray-200 dark:border-gray-100/[0.08]
                focus:border-indigo-500 dark:focus:border-indigo-500/70
                text-gray-900 dark:text-gray-100
                placeholder:text-gray-400 dark:placeholder:text-gray-600
                rounded-2xl
                max-md:px-3 md:px-4
                max-md:py-3 md:py-3.5
                max-md:text-base md:text-lg
                font-semibold
                transition-all duration-200
              "
                style={{ fontFamily: "'Playfair Display', serif" }}
              />
            </div>

            {/* ── Category + Thumbnail ── */}
            <div className="grid md:grid-cols-2 max-md:gap-4 md:gap-5">

              {/* Categories */}
              <div className="flex flex-col gap-1.5">
                <label className="text-gray-700 dark:text-gray-300 max-md:text-xs md:text-sm font-semibold uppercase tracking-wide">
                  Categories
                </label>

                <div className="
                bg-gray-50 dark:bg-[#0a0a14]
                border border-gray-200 dark:border-gray-100/[0.08]
                focus-within:border-indigo-500 dark:focus-within:border-indigo-500/70
                rounded-2xl
                max-md:p-2.5 md:p-3
                transition-all duration-200
              ">

                  {/* Tags */}
                  {blogData?.categories?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 max-md:mb-2 md:mb-3">
                      {blogData.categories.map((input, index) => (
                        <div
                          key={index}
                          className="
                          inline-flex items-center gap-1
                          bg-indigo-500/10 dark:bg-indigo-500/15
                          border border-indigo-200 dark:border-indigo-500/20
                          text-indigo-600 dark:text-indigo-400
                          rounded-full
                          max-md:px-2 md:px-2.5
                          max-md:py-0.5 md:py-1
                          max-md:text-[10px] md:text-xs
                          font-medium
                        "
                        >
                          {input}

                          <button
                            type="button"
                            disabled={isSubmitting}
                            onClick={() => handleRemoveCategory(index)}
                            className="hover:text-red-500 transition-colors duration-200"
                          >
                            <i className="fa-solid fa-xmark max-md:text-[9px] md:text-[10px]" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Input */}
                  <textarea
                    value={currentCategory}
                    onChange={(e) => setCurrentCategory(e.target.value)}
                    onKeyDown={handleCategoryEnter}
                    placeholder="technology, coding, react..."
                    rows={1}
                    disabled={isSubmitting}
                    className="
                    w-full resize-none border-none outline-none bg-transparent
                    text-gray-800 dark:text-gray-200
                    placeholder:text-gray-400 dark:placeholder:text-gray-600
                    max-md:text-sm md:text-sm
                    leading-relaxed
                  "
                  />

                  <p className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs mt-2">
                    Press Enter or separate categories using commas.
                  </p>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="thumbnail_image"
                  className="text-gray-700 dark:text-gray-300 max-md:text-xs md:text-sm font-semibold uppercase tracking-wide"
                >
                  Thumbnail Image
                </label>

                <div className="
                bg-gray-50 dark:bg-[#0a0a14]
                border border-dashed border-gray-300 dark:border-gray-100/[0.12]
                hover:border-indigo-400 dark:hover:border-indigo-500/50
                rounded-2xl
                max-md:p-4 md:p-5
                transition-all duration-200
              ">
                  <Form.Group controlId="thumbnail_image">
                    <Form.Control
                      type="file"
                      name="thumbnail_image"
                      accept=".png, .jpg, .jpeg, .ico"
                      onChange={(e) =>
                        setBlogData((prev) => ({
                          ...prev,
                          thumbnail_image: e.target.files[0],
                        }))
                      }
                      disabled={isSubmitting}
                      className="
                      bg-transparent
                      border-0
                      shadow-none
                      text-gray-700 dark:text-gray-300
                      max-md:text-sm md:text-sm
                    "
                    />
                  </Form.Group>

                  <p className="text-gray-400 dark:text-gray-500 max-md:text-[10px] md:text-xs mt-2">
                    Recommended: 1280×720 JPG or PNG
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Editor ── */}
          <div className="border-t border-gray-200 dark:border-gray-100/[0.06]">
            <div className="max-md:px-3 md:px-5 max-md:pt-3 md:pt-5">
              <label className="text-gray-700 dark:text-gray-300 max-md:text-xs md:text-sm font-semibold uppercase tracking-wide">
                Blog Content
              </label>
            </div>

            <div className="max-md:p-3 md:p-5">
              <div className="
              rounded-2xl overflow-hidden
              border border-gray-200 dark:border-gray-100/[0.08]
              bg-gray-100 dark:bg-[#0a0a14]
            ">
                <JoditEditor
                  ref={editor}
                  value={blogData?.content}
                  config={config}
                  tabIndex={1}
                  onBlur={(newContent) =>
                    setBlogData((prev) => ({
                      ...prev,
                      content: newContent,
                    }))
                  }
                  onChange={(newContent) =>
                    setBlogData((prev) => ({
                      ...prev,
                      content: newContent,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-end gap-3">

          <button
            type="button"
            onClick={() => router.back()}
            className="
            bg-gray-100 dark:bg-[#0f0f22]
            border border-gray-200 dark:border-gray-100/[0.08]
            hover:border-gray-300 dark:hover:border-gray-100/[0.16]
            text-gray-700 dark:text-gray-300
            rounded-xl
            max-md:px-4 md:px-5
            max-md:py-2 md:py-2.5
            max-md:text-xs md:text-sm
            font-semibold
            transition-all duration-200
          "
          >
            Cancel
          </button>

          <button
            disabled={isSubmitting}
            type="submit"
            className={`
            flex items-center gap-2
            bg-indigo-600 hover:bg-indigo-700
            text-gray-100
            rounded-xl
            max-md:px-4 md:px-5
            max-md:py-2 md:py-2.5
            max-md:text-xs md:text-sm
            font-semibold
            transition-all duration-200
            ${isSubmitting ? "opacity-60 cursor-not-allowed" : ""}
          `}
          >
            {isSubmitting ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                {blogIdFromParams ? "Saving..." : "Publishing..."}
              </>
            ) : (
              <>
                <i className="fa-solid fa-paper-plane max-md:text-[10px] md:text-xs" />
                {blogIdFromParams ? "Save Changes" : "Publish Blog"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PublishBlog
